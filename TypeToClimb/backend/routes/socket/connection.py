"""Socket connection events (connect/disconnect)"""
from flask import request
from flask_socketio import emit
from application.game_manager import create_player, remove_player
from application.lobby_manager import remove_player_from_active_lobby
from application.lobby_manager import remove_player_from_active_lobby, end_game_session_for_sid


def on_connect():
    """
    Handle socket connection event
    Creates a new player state
    """
    sid = request.sid
    create_player(sid)
    print(f"[+] Socket Connected: {sid}")
    emit("connection_confirmed", {"sid": sid})


def on_disconnect():
    """
    Handle socket disconnection event
    Removes player from game state and lobby
    """
    sid = request.sid
    
    # Remove from lobby if they were in one
    remove_player_from_active_lobby(sid)
    
    end_game_session_for_sid(sid)
    
    # Remove from game state
    remove_player(sid)
    
    print(f"[-] Disconnected: {sid}")


def register(socketio):
    """Register these events with SocketIO"""
    socketio.on("connect")(on_connect)
    socketio.on("disconnect")(on_disconnect)
