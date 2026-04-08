"""start_game event - Start the game in a lobby"""
from flask import request
from flask_socketio import emit
import flask
from application.lobby_manager import can_start_active_lobby
from routes.socket.lobby import countdown


def on_start_game(data):
    """
    Handle game start request from lobby host
    
    Args:
        data (dict): {"lobbyCode": str}
    """
    if not isinstance(data, dict):
        emit("lobby_error", {"message": "Invalid start payload"})
        return

    sid = request.sid
    code = data.get("lobbyCode", "").upper()

    allowed, error_message = can_start_active_lobby(sid, code)
    if not allowed:
        emit("lobby_error", {"message": error_message or "Unable to start game"})
        return

    current_socketio = flask.current_app.extensions['socketio']
    countdown.start_countdown_task(current_socketio, code)
    print(f"[Lobby] Host started countdown in {code}")


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("start_game")(on_start_game)



