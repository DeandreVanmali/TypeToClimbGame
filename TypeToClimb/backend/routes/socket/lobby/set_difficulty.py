"""set_lobby_difficulty event - Host sets lobby difficulty profile"""
from flask import request
from flask_socketio import emit
import flask
from application.lobby_manager import (
    update_lobby_difficulty,
    get_active_lobby_snapshot,
    MAX_PLAYERS,
)


def on_set_lobby_difficulty(data):
    """
    Handle host changing lobby difficulty.

    Args:
        data (dict): {"lobbyCode": str, "difficulty": "easy"|"normal"|"hard"}
    """
    if not isinstance(data, dict):
        emit("lobby_error", {"message": "Invalid difficulty payload"})
        return

    sid = request.sid
    lobby_code = data.get("lobbyCode", "").upper()
    difficulty = str(data.get("difficulty", "normal")).lower()

    ok, message = update_lobby_difficulty(sid, lobby_code, difficulty)
    if not ok:
        emit("lobby_error", {"message": message or "Unable to update difficulty"})
        return

    lobby_data = get_active_lobby_snapshot()
    if not lobby_data or lobby_data['code'] != lobby_code:
        emit("lobby_error", {"message": "Lobby not found"})
        return

    players_data = [
        {
            "id": p['id'],
            "name": p['name'],
            "animal": p['animal'],
            "isReady": True,
        }
        for p in lobby_data['players']
    ]

    current_socketio = flask.current_app.extensions['socketio']
    current_socketio.emit("lobby_update", {
        "players": players_data,
        "hostName": lobby_data['host_name'],
        "maxPlayers": MAX_PLAYERS,
        "difficulty": lobby_data.get('difficulty', 'normal'),
    }, room=lobby_code)



def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("set_lobby_difficulty")(on_set_lobby_difficulty)

