"""Leaderboard database operations"""
from data.database import query, execute


def get_top_scores(limit: int = 100) -> list[dict]:
    """Get top scores from the leaderboard."""
    return query("""
        SELECT id, player_name, animal, score, created_at
        FROM scores
        ORDER BY score DESC
        LIMIT %s
    """, (limit,))


def insert_score(player_name: str, animal: str, score: int) -> dict:
    """Insert a new score into the leaderboard."""
    return execute("""
        INSERT INTO scores (player_name, animal, score)
        VALUES (%s, %s, %s)
        RETURNING id, player_name, animal, score, created_at
    """, (player_name, animal, score))
