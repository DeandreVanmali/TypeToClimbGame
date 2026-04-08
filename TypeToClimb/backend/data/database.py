"""Database connection management

Uses eventlet.tpool to run psycopg connections in real OS threads,
avoiding the incompatibility between psycopg's C sockets and
eventlet's monkey-patched green threads.
"""
import os
import eventlet
import eventlet.tpool
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:0617392600@localhost:5432/typetoclimb")


def _connect():
    """Create a connection in a real OS thread."""
    return psycopg.connect(
        DATABASE_URL,
        row_factory=dict_row,
        connect_timeout=5
    )


def _query(sql, params=None):
    """Execute a SELECT query and return all rows."""
    conn = _connect()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            return cur.fetchall()
    finally:
        conn.close()


def _execute(sql, params=None):
    """Execute an INSERT/UPDATE/DELETE and return the first row (if RETURNING)."""
    conn = _connect()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            conn.commit()
            return cur.fetchone()
    finally:
        conn.close()


def query(sql, params=None):
    """Run a SELECT in a real OS thread (safe under eventlet)."""
    return eventlet.tpool.execute(_query, sql, params)


def execute(sql, params=None):
    """Run an INSERT/UPDATE/DELETE in a real OS thread (safe under eventlet)."""
    return eventlet.tpool.execute(_execute, sql, params)
