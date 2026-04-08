"""submit event - Submit a typed word"""
from flask import request
from flask_socketio import emit


def on_submit(payload):
    """
    Handle word submission from player

    Args:
        payload (dict): {"typed": str, "timeMs": int}
    """
    from application.game_manager import (
        get_player,
        update_player_progress,
        reset_player,
        generate_new_word,
        ROUND_TARGET_HEIGHT,
    )
    from application.scoring import calc_score
    from data.leaderboard import insert_score
    from application.lobby_manager import get_game_lobby_code, get_game_sids_for_lobby, end_lobby_match
    sid = request.sid
    player = get_player(sid)

    if not player or not player["current_word"]:
        return

    typed = payload.get("typed", "")
    time_ms = payload.get("timeMs", 0)
    word = player["current_word"]["text"]
    lobby_code = get_game_lobby_code(sid)

    if typed.lower().strip() == word.lower():
        inc, acc = calc_score(word, typed, time_ms)
        updated_player = update_player_progress(sid, inc, acc, time_ms)

        emit("progress", {
            "height": min(updated_player["height"], ROUND_TARGET_HEIGHT),
            "lastIncrement": inc,
            "accuracy": acc,
            "timeMs": time_ms,
            "rounds": updated_player["rounds"],
        })

        if updated_player["height"] >= ROUND_TARGET_HEIGHT:
            player_name = updated_player.get("name", "Player")
            player_animal = updated_player.get("animal", "monkey")
            final_score = updated_player["total_height"]

            try:
                insert_score(player_name, player_animal, final_score)
                print(f"[Game] Saved score: {player_name} ({player_animal}) = {final_score}")
            except Exception as e:
                print(f"[Game] Failed to save score: {e}")

            if lobby_code:
                import flask
                current_socketio = flask.current_app.extensions['socketio']
                game_sids = get_game_sids_for_lobby(lobby_code)
                for game_sid in game_sids:
                    recipient = get_player(game_sid)
                    current_socketio.emit("match_finished", {
                        "winner": player_name,
                        "finalHeight": recipient["total_height"] if recipient else 0,
                        "rounds": recipient["rounds"] if recipient else 0,
                    }, room=game_sid)
                print(f"[Game] Multiplayer match finished! Winner: {player_name} in lobby {lobby_code}")
                for game_sid in game_sids:
                    reset_player(game_sid)
                end_lobby_match(lobby_code)
            else:
                emit("game_complete", {
                    "finalHeight": updated_player["total_height"],
                    "rounds": updated_player["rounds"],
                })
                reset_player(sid)
            return

        new_word = generate_new_word(sid, lobby_code=lobby_code)
        current_player = get_player(sid)
        if not current_player or not new_word:
            return

        emit("word", new_word)
        return

    emit("progress", {
        "height": player["height"],
        "lastIncrement": 0,
        "accuracy": 0,
        "timeMs": time_ms,
        "rounds": player["rounds"],
    })
    emit("word", player["current_word"])


def register(socketio):
    """Register this event with SocketIO"""
    socketio.on("submit")(on_submit)