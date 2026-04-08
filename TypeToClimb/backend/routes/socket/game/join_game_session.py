"""join_game_session event - Join a multiplayer game session room"""
from flask import request
from flask_socketio import join_room
from application.lobby_manager import register_game_session


def on_join_game_session(data):
    """
    Re-join the lobby socket room from the game page so match_finished events reach this player.

    Args:
        data (dict): {"lobbyCode": str, "playerName": str}
    """
    if not isinstance(data, dict):
        return

    sid = request.sid
    lobby_code = data.get("lobbyCode", "").upper()
    player_name = data.get("playerName", "Player")

    if not lobby_code:
        return

    join_room(lobby_code)
    register_game_session(sid, lobby_code)
    print(f"[Game] {player_name} ({sid[:8]}…) joined multiplayer game session in lobby {lobby_code}")


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("join_game_session")(on_join_game_session)