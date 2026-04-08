"""Lobby management for multiplayer games"""
import random
import string
from data import lobby as lobby_db
from application import game_state

MAX_PLAYERS = 5
MIN_PLAYERS_TO_START = 2

# In-memory session mapping (sid → player_data)
player_sessions: dict = {}  # {sid: {"name": str, "animal": str, "player_id": int}}

# Reverse mapping (name → sid) to prevent duplicates
player_name_to_sid: dict = {}  # {name: sid}

# In-memory game socket tracking (game_sid → lobby_code)
game_sessions: dict = {}  # {game_sid: lobby_code}

# In-memory lobby settings (lobby_code -> settings)
lobby_settings: dict[str, dict] = {}
DEFAULT_DIFFICULTY = "normal"
ALLOWED_DIFFICULTIES = {"easy", "normal", "hard"}


def _ensure_lobby_settings(lobby_code: str) -> dict:
    return lobby_settings.setdefault(lobby_code, {"difficulty": DEFAULT_DIFFICULTY})


def get_lobby_difficulty(lobby_code: str | None) -> str:
    if not lobby_code:
        return DEFAULT_DIFFICULTY
    return _ensure_lobby_settings(lobby_code).get("difficulty", DEFAULT_DIFFICULTY)


def update_lobby_difficulty(sid: str, lobby_code: str, difficulty: str) -> tuple[bool, str | None]:
    """Allow only the lobby host to set multiplayer difficulty before countdown starts."""
    if difficulty not in ALLOWED_DIFFICULTIES:
        return False, "Invalid difficulty"

    lobby_data = get_active_lobby_snapshot()
    if not lobby_data or lobby_data['code'] != lobby_code:
        return False, "Lobby not found"

    requester = player_sessions.get(sid)
    if not requester:
        return False, "Player session not found"

    if requester['name'] != lobby_data['host_name']:
        return False, "Only the host can change difficulty"

    if game_state.is_counting() or game_state.is_game_started():
        return False, "Difficulty is locked after countdown starts"

    settings = _ensure_lobby_settings(lobby_code)
    settings["difficulty"] = difficulty
    return True, None


def register_game_session(sid: str, lobby_code: str) -> None:
    """Associate a game socket with a lobby code for match_finished broadcasts."""
    game_sessions[sid] = lobby_code
    print(f"[LobbyManager] Registered game session: {sid[:8]}… → lobby {lobby_code}")


def get_game_lobby_code(sid: str) -> str | None:
    """Get the lobby code for a game socket ID."""
    return game_sessions.get(sid)



def get_game_sids_for_lobby(lobby_code: str) -> list[str]:
    """Return game socket IDs registered for a lobby."""
    return [sid for sid, code in game_sessions.items() if code == lobby_code]


def end_game_session_for_sid(sid: str) -> None:
    """Remove a single game session entry (called on socket disconnect)."""
    game_sessions.pop(sid, None)


def end_lobby_match(lobby_code: str) -> None:
    """Clean up all game sessions for a finished multiplayer match."""
    sids_to_remove = [sid for sid, code in game_sessions.items() if code == lobby_code]
    for sid in sids_to_remove:
        game_sessions.pop(sid, None)
    from application.game_manager import clear_lobby_word_sequence
    clear_lobby_word_sequence(lobby_code)
    lobby_settings.pop(lobby_code, None)
    print(f"[LobbyManager] Cleaned up game sessions for lobby {lobby_code}")


def _get_active_player_ids_for_lobby(lobby_id: int) -> set[int]:
    """Return currently connected player IDs for a given lobby."""
    return {
        session["player_id"]
        for session in player_sessions.values()
        if session.get("lobby_id") == lobby_id
    }


def _prune_stale_players(lobby_id: int) -> list[dict]:
    """Remove database players that no longer have an active socket session."""
    players = lobby_db.get_lobby_players(lobby_id)
    active_player_ids = _get_active_player_ids_for_lobby(lobby_id)

    if not players:
        return []

    stale_players = [player for player in players if player["id"] not in active_player_ids]
    if not stale_players:
        return players

    print(f"[LobbyManager] Removing {len(stale_players)} stale player(s) from lobby {lobby_id}")
    for player in stale_players:
        lobby_db.remove_player(player["id"])

    return lobby_db.get_lobby_players(lobby_id)


def generate_lobby_code() -> str:
    """Generate a random 6-character lobby code"""
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


def get_or_create_active_lobby() -> dict:
    """
    Get the active lobby, or create one if none exists
    
    Returns:
        dict: Active lobby with players list
    """
    # Check for active lobby in database
    lobby = lobby_db.get_active_lobby()
    
    if not lobby:
        # Create new lobby
        code = generate_lobby_code()
        lobby = lobby_db.create_lobby(code)

    _ensure_lobby_settings(lobby['code'])
    
    # Remove any stale DB rows left behind by restarts/disconnects
    players = _prune_stale_players(lobby['id'])
    
    host_name = players[0]['name'] if players else None

    return {
        "id": lobby['id'],
        "code": lobby['code'],
        "created_at": lobby['created_at'],
        "players": players,
        "host_name": host_name,
        "difficulty": get_lobby_difficulty(lobby['code']),
    }


def add_player_to_active_lobby(sid: str, player_name: str, animal: str = 'monkey') -> dict | None:
    """
    Add a player to the active lobby
    
    Args:
        sid: Socket ID
        player_name: Player name
        animal: Animal character
        
    Returns:
        dict | None: Full lobby data with players, or None if lobby is full
    """
    # Get or create active lobby
    lobby_data = get_or_create_active_lobby()
    print(f"[LobbyManager] Active lobby: {lobby_data['code']}, Current players: {len(lobby_data['players'])}")
    
    # Check if this player name is already connected with a different socket
    if player_name in player_name_to_sid:
        old_sid = player_name_to_sid[player_name]
        if old_sid != sid and old_sid in player_sessions:
            # Remove old session
            print(f"[LobbyManager] Player {player_name} reconnecting, removing old session {old_sid}")
            old_session = player_sessions.pop(old_sid, None)
            if old_session:
                lobby_db.remove_player(old_session['player_id'])
    
    # Check if player already exists in database
    existing_player = next((p for p in lobby_data['players'] if p['name'] == player_name), None)
    
    if game_state.is_counting() or game_state.is_game_started():
        print(f"[LobbyManager] Rejecting join for {player_name}: game already starting/started")
        return None

    if existing_player:
        print(f"[LobbyManager] Player {player_name} already exists, updating session")
        # Update session mapping for existing player (reconnect case)
        player_sessions[sid] = {
            "name": player_name,
            "animal": existing_player['animal'],
            "player_id": existing_player['id'],
            "lobby_id": lobby_data['id']
        }
        player_name_to_sid[player_name] = sid
        lobby_data['players'] = lobby_db.get_lobby_players(lobby_data['id'])
        return lobby_data

    if len(lobby_data['players']) >= MAX_PLAYERS:
        print(f"[LobbyManager] Lobby {lobby_data['code']} is full ({len(lobby_data['players'])}/{MAX_PLAYERS})")
        return None

    if not existing_player:
        # Add new player to database
        player = lobby_db.add_player(lobby_data['id'], player_name, animal)
        print(f"[LobbyManager] Added new player to DB: {player}")
        
        # Store session mappings
        player_sessions[sid] = {
            "name": player_name,
            "animal": animal,
            "player_id": player['id'],
            "lobby_id": lobby_data['id']
        }
        player_name_to_sid[player_name] = sid
        
        # Refresh players list
        lobby_data['players'] = lobby_db.get_lobby_players(lobby_data['id'])
        print(f"[LobbyManager] Refreshed players list, now {len(lobby_data['players'])} players")
    
    return lobby_data


def remove_player_from_active_lobby(sid: str) -> bool:
    """
    Remove a player from the active lobby by session ID.
    
    Args:
        sid: Socket ID
        
    Returns:
        bool: True if player was removed
    """
    session = player_sessions.get(sid)
    if not session:
        return False
    
    # Remove from database
    removed = lobby_db.remove_player(session['player_id'])
    
    # Remove from in-memory session tracking
    player_sessions.pop(sid, None)
    player_name_to_sid.pop(session['name'], None)
    
    # Check if lobby is now empty and clean it up
    lobby_data = lobby_db.get_lobby_by_id(session['lobby_id'])
    if lobby_data:
        players = lobby_db.get_lobby_players(session['lobby_id'])
        if not players:
            from application.game_manager import clear_lobby_word_sequence
            clear_lobby_word_sequence(lobby_data['code'])
            lobby_settings.pop(lobby_data['code'], None)
            lobby_db.clear_lobby(session['lobby_id'])
    
    return removed


def get_lobby_player_count() -> int:
    """Get count of players in active lobby"""
    lobby = lobby_db.get_active_lobby()
    if not lobby:
        return 0
    return len(_prune_stale_players(lobby['id']))


def get_active_lobby_snapshot() -> dict | None:
    """Get the active lobby with host metadata, if any."""
    lobby = lobby_db.get_active_lobby()
    if not lobby:
        return None
    return get_or_create_active_lobby()


def can_start_active_lobby(sid: str, lobby_code: str) -> tuple[bool, str | None]:
    """Validate whether the requesting socket can start the active lobby."""
    lobby_data = get_active_lobby_snapshot()
    if not lobby_data or lobby_data['code'] != lobby_code:
        return False, "Lobby not found"

    if not lobby_data['players']:
        return False, "Lobby has no players"

    host_name = lobby_data['host_name']
    requester = player_sessions.get(sid)
    if not requester:
        return False, "Player session not found"

    if requester['name'] != host_name:
        return False, "Only the host can start the game"

    if len(lobby_data['players']) < MIN_PLAYERS_TO_START:
        return False, f"At least {MIN_PLAYERS_TO_START} players are required to start"

    if game_state.is_counting():
        return False, "Countdown already in progress"

    if game_state.is_game_started():
        return False, "Game already started"

    return True, None


def get_player_session(sid: str) -> dict | None:
    """Get player session data by socket ID"""
    return player_sessions.get(sid)

