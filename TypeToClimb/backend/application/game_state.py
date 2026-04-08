"""Game state management - controls lobby countdown and game transitions"""
from datetime import datetime, timedelta
from typing import Optional

# Game state
game_state = {
    "countdown_start": None,  # datetime when countdown started
    "countdown_duration": 10,  # seconds
    "is_counting": False,
    "game_started": False,
}


def start_countdown() -> datetime:
    """
    Start the countdown timer
    
    Returns:
        datetime: When the game will start
    """
    game_state["is_counting"] = True
    game_state["countdown_start"] = datetime.utcnow()
    game_state["game_started"] = False
    
    start_time = game_state["countdown_start"] + timedelta(seconds=game_state["countdown_duration"])
    return start_time


def get_countdown_remaining() -> Optional[int]:
    """
    Get remaining seconds in countdown
    
    Returns:
        int: Seconds remaining, or None if not counting
    """
    if not game_state["is_counting"] or not game_state["countdown_start"]:
        return None
    
    elapsed = (datetime.utcnow() - game_state["countdown_start"]).total_seconds()
    remaining = game_state["countdown_duration"] - int(elapsed)
    
    if remaining <= 0:
        game_state["is_counting"] = False
        game_state["game_started"] = True
        return 0
    
    return remaining


def cancel_countdown():
    """Cancel the countdown"""
    game_state["is_counting"] = False
    game_state["countdown_start"] = None
    game_state["game_started"] = False


def is_counting() -> bool:
    """Check if a countdown is currently running."""
    return game_state["is_counting"]


def is_game_started() -> bool:
    """Check if game has started"""
    return game_state["game_started"]


def reset_game_state():
    """Reset all game state"""
    game_state["is_counting"] = False
    game_state["countdown_start"] = None
    game_state["game_started"] = False
