"""POST /api/leaderboard - Submit a new score"""
from flask import request, jsonify
from data.leaderboard import insert_score


def post_leaderboard():
    """
    Submit a new score to the leaderboard
    
    Request body:
        - playerName (str): Player's name
        - animal (str): Animal character chosen
        - score (int): Final score
        
    Returns:
        JSON response with created score, 201 status
    """
    data = request.get_json()
    player_name = data.get("playerName")
    animal = data.get("animal", "monkey")
    score = data.get("score")
    
    if not player_name or score is None:
        return jsonify({"error": "Missing required fields: playerName, score"}), 400
    
    try:
        score_int = int(score)
    except (ValueError, TypeError):
        return jsonify({"error": "Score must be a valid integer"}), 400
    
    result = insert_score(player_name, animal, score_int)
    return jsonify(result), 201


def register(app):
    """Register this route with the Flask app"""
    app.route("/api/leaderboard", methods=["POST"])(post_leaderboard)
