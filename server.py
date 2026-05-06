import os
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

DB_PATH = os.environ.get("DB_PATH", "/data/wordsmith.db")
DIST_DIR = Path(__file__).parent / "dist"
MAX_ENTRIES = 10
MAX_NAME_LEN = 16
MAX_WORD_LEN = 32

app = Flask(__name__, static_folder=None)

_db_initialized = False


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                words_found INTEGER NOT NULL,
                best_word TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        conn.commit()


@app.before_request
def _ensure_db():
    global _db_initialized
    if not _db_initialized:
        init_db()
        _db_initialized = True


@app.post("/submit-score")
def submit_score():
    data = request.get_json(silent=True) or {}

    raw_name = (data.get("player_name") or "").strip()
    player_name = (raw_name or "Anonymous")[:MAX_NAME_LEN]

    try:
        score = int(data.get("score"))
        words_found = int(data.get("words_found"))
    except (TypeError, ValueError):
        return jsonify({"error": "score and words_found must be integers"}), 400

    best_word = (data.get("best_word") or "").strip()[:MAX_WORD_LEN] or None

    with get_db() as conn:
        conn.execute(
            "INSERT INTO scores (player_name, score, words_found, best_word) "
            "VALUES (?, ?, ?, ?)",
            (player_name, score, words_found, best_word),
        )
        conn.commit()

    return jsonify({"ok": True}), 201


@app.get("/leaderboard")
def leaderboard():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT player_name, score, words_found, best_word, created_at "
            "FROM scores ORDER BY score DESC, created_at ASC LIMIT ?",
            (MAX_ENTRIES,),
        ).fetchall()
    return jsonify([dict(r) for r in rows])


@app.get("/", defaults={"path": ""})
@app.get("/<path:path>")
def spa(path):
    if path:
        candidate = DIST_DIR / path
        if candidate.is_file():
            return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
