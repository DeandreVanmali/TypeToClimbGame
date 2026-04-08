"""leave_lobby event - Leave a lobby"""
from flask import request
from flask_socketio import emit, leave_room
from application.lobby_manager import get_lobby, remove_player_from_lobby
from application.game_manager import get_player


def on_leave_lobby(data):
    """
    Handle player leaving a lobby
    
    Args:
        data (dict): {"lobbyCode": str}
    """
    sid = request.sid
    code = data.get("lobbyCode", "").upper()
    
    lobby = get_lobby(code)
    if not lobby:
        return
    
    # Get player name from game manager
    player = get_player(sid)
    player_name = player.get("name", "") if player else ""
    
    # Remove player from lobby
    removed = remove_player_from_lobby(code, player_name)
    
    # Leave socket room
    leave_room(code)
    
    # Notify remaining players if lobby still exists
    if removed and get_lobby(code):
        import flask
        current_socketio = flask.current_app.extensions['socketio']
        current_socketio.emit("player_left", {
            "playerName": player_name,
            "players": lobby["players"]
        }, room=code)


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("leave_lobby")(on_leave_lobby)
