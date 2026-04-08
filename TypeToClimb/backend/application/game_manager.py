"""Game state management for solo play"""
from application.word_generator import pick_word_for_difficulty

# In-memory player state (sid → player dict)
players: dict = {}
ROUND_TARGET_HEIGHT = 15

# Shared multiplayer word sequences (lobby_code → [word, ...])
lobby_word_sequences: dict[str, list[dict]] = {}


def init_player() -> dict:
    """
    Initialize a new player state
    
    Returns:
        dict: Player state with default values
    """
    return {
        "name": "Player",
        "animal": "monkey",
        "height": 0,
        "total_height": 0,
        "total_typed": 0.0,
        "total_time_ms": 0,
        "rounds": 0,
        "current_round": 1,
        "round_word_index": 0,
        "current_word": None,
    }


def get_player(sid: str) -> dict | None:
    """Get player state by socket ID"""
    return players.get(sid)


def create_player(sid: str) -> dict:
    """Create a new player and return their state"""
    players[sid] = init_player()
    return players[sid]


def remove_player(sid: str) -> None:
    """Remove player from state"""
    players.pop(sid, None)


def set_player_name(sid: str, name: str) -> None:
    """Set player name"""
    if sid in players:
        players[sid]["name"] = name


def set_player_animal(sid: str, animal: str) -> None:
    """Set player animal"""
    if sid in players:
        players[sid]["animal"] = animal


def _ensure_lobby_word(lobby_code: str, word_index: int) -> dict:
    """Ensure a multiplayer lobby has a shared word for a specific word index."""
    from application.lobby_manager import get_lobby_difficulty

    words = lobby_word_sequences.setdefault(lobby_code, [])
    difficulty_profile = get_lobby_difficulty(lobby_code)

    while len(words) <= word_index:
        words.append(pick_word_for_difficulty(difficulty_profile=difficulty_profile))

    return words[word_index]


def ensure_current_word(sid: str, lobby_code: str | None = None) -> dict:
    """
    Ensure player has a current word, generate one if needed
    
    Returns:
        dict: Current word {"text": str, "difficulty": int}
    """
    if sid not in players:
        return None

    player = players[sid]

    if lobby_code:
        player["current_word"] = _ensure_lobby_word(
            lobby_code,
            player["round_word_index"],
        )
        return player["current_word"]

    if not player["current_word"]:
        player["current_word"] = pick_word_for_difficulty()
    return player["current_word"]


def update_player_progress(sid: str, score_inc: int, accuracy: float, time_ms: int) -> dict:
    """
    Update player progress after a successful word
    
    Returns:
        dict: Updated player state
    """
    player = players[sid]
    player["height"] += score_inc
    player["total_height"] += score_inc
    player["total_time_ms"] += time_ms
    player["rounds"] += 1
    player["total_typed"] += accuracy
    return player


def reset_player(sid: str) -> None:
    """Reset player to initial state"""
    if sid in players:
        players[sid] = init_player()


def generate_new_word(sid: str, lobby_code: str | None = None) -> dict:
    """Generate and set a new word for the player"""
    if sid in players:
        players[sid]["round_word_index"] += 1
        if lobby_code:
            players[sid]["current_word"] = _ensure_lobby_word(
                lobby_code,
                players[sid]["round_word_index"],
            )
        else:
            players[sid]["current_word"] = pick_word_for_difficulty()
        return players[sid]["current_word"]
    return None


def clear_lobby_word_sequence(lobby_code: str) -> None:
    """Clear the shared word sequence for a finished or emptied multiplayer lobby."""
    lobby_word_sequences.pop(lobby_code, None)
