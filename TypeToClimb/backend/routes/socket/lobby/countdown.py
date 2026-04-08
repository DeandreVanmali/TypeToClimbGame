"""Backend-controlled countdown and game start"""
import eventlet
from application import game_state
from application.lobby_manager import get_active_lobby_snapshot, get_lobby_difficulty

countdown_greenlet = None


def start_countdown_task(socketio, lobby_code: str):
    """
    Start a background task that manages countdown and broadcasts to all clients
    
    Args:
        socketio: SocketIO instance
    """
    global countdown_greenlet
    
    # Cancel existing countdown if any
    if countdown_greenlet is not None:
        countdown_greenlet.kill()
    
    def countdown_loop():
        """Background task that counts down and broadcasts updates"""
        print(f"[Countdown] Starting 10 second countdown for lobby {lobby_code}")
        game_state.start_countdown()
        
        for remaining in range(10, -1, -1):
            print(f"[Countdown] {remaining} seconds remaining - broadcasting to all clients")
            
            # Broadcast countdown to the active lobby only
            socketio.emit("countdown_update", {
                "remaining": remaining
            }, room=lobby_code)
            
            if remaining == 0:
                # Game starts!
                print("[Countdown] Game starting now! Broadcasting game_start")
                lobby_data = get_active_lobby_snapshot()
                if not lobby_data or lobby_data['code'] != lobby_code:
                    game_state.reset_game_state()
                    return
                socketio.emit("game_start", {
                    "lobbyCode": lobby_data['code'],
                    "difficulty": get_lobby_difficulty(lobby_data['code']),
                }, room=lobby_code)
                game_state.reset_game_state()
                break
            
            eventlet.sleep(1)
    
    # Spawn the countdown task
    countdown_greenlet = eventlet.spawn(countdown_loop)


def cancel_countdown_task():
    """Cancel the countdown task"""
    global countdown_greenlet
    
    if countdown_greenlet is not None:
        print("[Countdown] Cancelling countdown")
        countdown_greenlet.kill()
        countdown_greenlet = None
        game_state.cancel_countdown()


def register(socketio):
    """Make socketio available to this module"""
    # Store for later use
    pass




