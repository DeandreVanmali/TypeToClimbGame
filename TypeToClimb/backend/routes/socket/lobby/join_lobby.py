"""join_lobby event - Join an existing lobby"""
from flask import request
from flask_socketio import emit, join_room
from application.lobby_manager import (
    get_lobby,
    add_player_to_lobby,
    is_lobby_started,
    is_lobby_full
)


def on_join_lobby(data):
    """
    Handle player joining an existing lobby
    
    Args:
        data (dict): {"lobbyCode": str, "playerName": str}
    """
    sid = request.sid
    code = data.get("lobbyCode", "").upper()
    player_name = data.get("playerName", "Player")
    
    lobby = get_lobby(code)
    
    # Validation
    if not lobby:
        emit("lobby_error", {"message": "Lobby not found"})
        return
    
    if is_lobby_started(code):
        emit("lobby_error", {"message": "Game already started"})
        return
    
    if is_lobby_full(code, max_players=2):
        emit("lobby_error", {"message": "Lobby is full"})
        return
    
    # Add player to lobby
    new_player = add_player_to_lobby(code, player_name)
    if not new_player:
        emit("lobby_error", {"message": "Failed to join lobby"})
        return
    
    # Join socket room
    join_room(code)
    
    # Notify player they joined
    emit("lobby_joined", {
        "lobbyCode": code,
        "players": lobby["players"]
    })
    
    # Notify other players
    import flask
    current_socketio = flask.current_app.extensions['socketio']
    current_socketio.emit("player_joined", {
        "playerName": player_name,
        "players": lobby["players"]
    }, room=code, skip_sid=sid)
    
    print(f"[Lobby] {player_name} joined {code}")


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("join_lobby")(on_join_lobby)
