"""auto_join_lobby event - Automatically join the active lobby"""
from flask import request
from flask_socketio import emit, join_room
from application.lobby_manager import add_player_to_active_lobby, MAX_PLAYERS


def on_auto_join_lobby(data):
    """
    Handle player automatically joining the active lobby
    Players are added to the database
    
    Args:
        data (dict): {"playerName": str, "animal": str}
    """
    if not isinstance(data, dict):
        emit("lobby_error", {"message": "Invalid lobby join payload"})
        return

    sid = request.sid
    player_name = data.get("playerName", "Player")
    animal = data.get("animal", "monkey")
    
    print(f"[Lobby] Received auto_join_lobby event")
    print(f"[Lobby] Raw data: {data}")
    print(f"[Lobby] Player name: {player_name}, animal: {animal}, sid: {sid}")
    
    # Get or create active lobby first
    lobby_data = add_player_to_active_lobby(sid, player_name, animal)

    if lobby_data is None:
        print(f"[Lobby] Rejecting {player_name}: lobby is already full")
        emit("lobby_error", {"message": "Lobby is full"})
        return

    join_room(lobby_data['code'])
    
    print(f"[Lobby] {player_name} added to lobby {lobby_data['code']} (Total: {len(lobby_data['players'])} players)")
    
    # Prepare player list for frontend
    players_data = [
        {
            "id": p['id'],
            "name": p['name'],
            "animal": p['animal'],
            "isReady": True
        }
        for p in lobby_data['players']
    ]
    
    # Send lobby data to this player
    emit("lobby_joined", {
        "lobbyCode": lobby_data['code'],
        "players": players_data,
        "hostName": lobby_data['host_name'],
        "maxPlayers": MAX_PLAYERS,
        "difficulty": lobby_data.get('difficulty', 'normal'),
    })
    
    print(f"[Lobby] Sent lobby_joined to {player_name} with {len(players_data)} players")
    
    # Broadcast to ALL players (including this one) the updated player list
    import flask
    current_socketio = flask.current_app.extensions['socketio']
    current_socketio.emit("lobby_update", {
        "players": players_data,
        "hostName": lobby_data['host_name'],
        "maxPlayers": MAX_PLAYERS,
        "difficulty": lobby_data.get('difficulty', 'normal'),
    }, room=lobby_data['code'])
    
    print(f"[Lobby] Broadcast lobby_update to all players with {len(players_data)} players")
    
    print(f"[Lobby] Waiting for host to start ({len(lobby_data['players'])}/{MAX_PLAYERS})")


def register(socketio):
    """Register this event with SocketIO"""
    print("[Lobby] Registering auto_join_lobby event handler")
    socketio.on("auto_join_lobby")(on_auto_join_lobby)

