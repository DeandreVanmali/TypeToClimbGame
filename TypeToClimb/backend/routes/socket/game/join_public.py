"""join_public event - Join public solo game"""
from flask import request
from application.game_manager import set_player_name, set_player_animal


def on_join_public(payload):
    """
    Handle player joining public solo game

    Args:
        payload (dict): {"name": str, "animal": str}
    """
    sid = request.sid
    name = payload.get("name", "Player") if isinstance(payload, dict) else payload
    animal = payload.get("animal", "monkey") if isinstance(payload, dict) else "monkey"
    set_player_name(sid, name)
    set_player_animal(sid, animal)


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("join_public")(on_join_public)
