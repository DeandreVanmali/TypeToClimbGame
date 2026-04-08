"""GET /health - Health check endpoint"""
from flask import jsonify


def health():
    """
    Simple health check endpoint
    
    Returns:
        JSON response with status ok
    """
    return jsonify({"status": "ok"})


def register(app):
    """Register this route with the Flask app"""
    app.route("/health", methods=["GET"])(health)
