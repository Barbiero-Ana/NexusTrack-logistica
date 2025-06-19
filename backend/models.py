from data import DB_NAME
import sqlite3

def get_user_by_email(email):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE email = ?", (email,))
        return cursor.fetchone()

def insert_user(nome, sobrenome, email, senha_hash):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO usuarios (nome, sobrenome, email, senha_hash) VALUES (?, ?, ?, ?)",
            (nome, sobrenome, email, senha_hash)
        )
        conn.commit()
        return cursor.lastrowid

def insert_pedido(usuario_id, tracking_code, recipient_name, email, created_at):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO pedidos (usuario_id, tracking_code, recipient_name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            (usuario_id, tracking_code, recipient_name, email, created_at, created_at)
        )
        conn.commit()
        return cursor.lastrowid

def get_pedidos_por_usuario(usuario_id):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM pedidos WHERE usuario_id = ?", (usuario_id,))
        return cursor.fetchall()

def atualizar_status_pedido(pedido_id, novo_status):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE pedidos SET status = ?, updated_at = datetime('now') WHERE id = ?",
            (novo_status, pedido_id)
        )
        conn.commit()

def get_email_por_pedido(pedido_id):
    with sqlite3.connect(DB_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT email FROM pedidos WHERE id = ?", (pedido_id,))
        result = cursor.fetchone()
        return result[0] if result else None
