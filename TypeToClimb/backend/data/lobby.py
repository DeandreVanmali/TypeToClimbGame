"""Lobby and player database operations"""
from data.database import query, execute
from typing import Optional


def get_active_lobby() -> Optional[dict]:
    """Get the currently active lobby."""
    rows = query("""
        SELECT id, code, created_at
        FROM lobbies
        ORDER BY created_at DESC
        LIMIT 1
    """)
    return rows[0] if rows else None


def create_lobby(code: str) -> dict:
    """Create a new lobby in the database."""
    return execute("""
        INSERT INTO lobbies (code)
        VALUES (%s)
        RETURNING id, code, created_at
    """, (code,))


def get_lobby_players(lobby_id: int) -> list[dict]:
    """Get all players in a lobby."""
    return query("""
        SELECT id, name, animal, lobby_id, joined_at
        FROM players
        WHERE lobby_id = %s
        ORDER BY joined_at ASC
    """, (lobby_id,))


def add_player(lobby_id: int, name: str, animal: str = 'monkey') -> dict:
    """Add a player to a lobby."""
    return execute("""
        INSERT INTO players (name, animal, lobby_id)
        VALUES (%s, %s, %s)
        RETURNING id, name, animal, lobby_id, joined_at
    """, (name, animal, lobby_id))


def remove_player(player_id: int) -> bool:
    """Remove a player from the database."""
    return execute("""
        DELETE FROM players
        WHERE id = %s
        RETURNING id
    """, (player_id,)) is not None


def remove_player_by_name(lobby_id: int, name: str) -> bool:
    """Remove a player by name from a lobby."""
    return execute("""
        DELETE FROM players
        WHERE lobby_id = %s AND name = %s
        RETURNING id
    """, (lobby_id, name)) is not None


def clear_lobby(lobby_id: int) -> bool:
    """Delete a lobby and all its players (cascade)."""
    return execute("""
        DELETE FROM lobbies
        WHERE id = %s
        RETURNING id
    """, (lobby_id,)) is not None


def get_lobby_by_id(lobby_id: int) -> Optional[dict]:
    """Get lobby by ID."""
    rows = query("""
        SELECT id, code, created_at
        FROM lobbies
        WHERE id = %s
    """, (lobby_id,))
    return rows[0] if rows else None
