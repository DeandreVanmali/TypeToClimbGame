"""GET /api/leaderboard - Retrieve top scores"""
from flask import jsonify
from data.leaderboard import get_top_scores


def get_leaderboard():
    """
    Get the top 100 scores from the leaderboard
    
    Returns:
        JSON response with list of scores
    """
    scores = get_top_scores(limit=100)
    return jsonify(scores)


def register(app):
    """Register this route with the Flask app"""
    app.route("/api/leaderboard", methods=["GET"])(get_leaderboard)
