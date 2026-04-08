"""
TypeToClimb Backend Server
Entry point for the Flask + SocketIO application
"""
import os
from dotenv import load_dotenv

load_dotenv()

import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS

# ─── Config ───────────────────────────────────────────────────────────────────
CLIENT_URL = os.getenv("CLIENT_URL", "http://localhost:3000")
PORT = int(os.getenv("PORT", 5000))

# Allow multiple origins for development (localhost + network access)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://0.0.0.0:3000",
]
# Add network IPs if CLIENT_URL is different
if CLIENT_URL not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(CLIENT_URL)

# ─── Flask + SocketIO Setup ───────────────────────────────────────────────────
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "jungle-secret")
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)
sio = SocketIO(
    app, 
    cors_allowed_origins="*",  # Allow all origins in development
    async_mode="eventlet",
    logger=True,
    engineio_logger=True,
    ping_timeout=60000,
    ping_interval=25000
)

# ─── Register Routes ──────────────────────────────────────────────────────────
# REST API Routes
from routes.api.leaderboard import get_leaderboard, post_leaderboard
from routes.api import health

get_leaderboard.register(app)
post_leaderboard.register(app)
health.register(app)

# Socket Event Routes
from routes.socket import connection
from routes.socket.game import join_public, request_word, submit, join_game_session
from routes.socket.lobby import auto_join_lobby, countdown, start_game, set_difficulty

connection.register(sio)
join_public.register(sio)
request_word.register(sio)
submit.register(sio)
join_game_session.register(sio)
auto_join_lobby.register(sio)
countdown.register(sio)
start_game.register(sio)
set_difficulty.register(sio)

# ─── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"[Server] Starting TypeToClimb backend")
    print(f"[Server] Allowed CORS origins: {ALLOWED_ORIGINS}")
    print(f"[Server] Socket.IO CORS: * (all origins)")
    print(f"[Server] Listening on http://0.0.0.0:{PORT}")
    sio.run(app, host="0.0.0.0", port=PORT, debug=False)

