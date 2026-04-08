"""request_word event - Request a new word"""
from flask import request
from flask_socketio import emit
from application.game_manager import ensure_current_word
from application.lobby_manager import get_game_lobby_code


def on_request_word():
    """
    Handle player requesting a word
    Ensures player has a current word and sends it
    """
    sid = request.sid
    lobby_code = get_game_lobby_code(sid)
    word = ensure_current_word(sid, lobby_code=lobby_code)
    if not word:
        return
    emit("word", word)


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("request_word")(on_request_word)
