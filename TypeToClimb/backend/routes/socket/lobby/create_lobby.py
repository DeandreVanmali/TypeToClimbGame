"""create_lobby event - Create a new multiplayer lobby"""
from flask import request
from flask_socketio import emit, join_room
from application.lobby_manager import create_lobby


def on_create_lobby(data):
    """
    Handle lobby creation
    
    Args:
        data (dict): {"playerName": str}
    """
    sid = request.sid
    player_name = data.get("playerName", "Player")
    
    lobby = create_lobby(sid, player_name)
    join_room(lobby["code"])
    
    emit("lobby_created", {
        "lobbyCode": lobby["code"],
        "player": lobby["players"][0]
    })
    
    print(f"[Lobby] Created {lobby['code']} by {player_name}")


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("create_lobby")(on_create_lobby)
