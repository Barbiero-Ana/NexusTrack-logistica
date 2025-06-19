from flask import Flask, request, jsonify
from flask_cors import CORS
from data import init_db
from models import (
    get_user_by_email, insert_user,
    insert_pedido, get_pedidos_por_usuario,
    atualizar_status_pedido, get_email_por_pedido
)
from emails_utils import enviar_email
from datetime import datetime
import bcrypt

app = Flask(__name__)
CORS(app)

# Inicializa o banco
init_db()

@app.route('/api/registrar', methods=['POST'])
def registrar():
    data = request.get_json()
    nome = data.get('nome')
    sobrenome = data.get('sobrenome')
    email = data.get('email')
    senha = data.get('senha')

    if get_user_by_email(email):
        return jsonify({'erro': 'Email já cadastrado'}), 400

    senha_hash = bcrypt.hashpw(senha.encode(), bcrypt.gensalt())
    user_id = insert_user(nome, sobrenome, email, senha_hash)

    return jsonify({'mensagem': 'Usuário registrado com sucesso!', 'id': user_id})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    user = get_user_by_email(email)
    if user and bcrypt.checkpw(senha.encode(), user[4]):
        return jsonify({
            'id': user[0],
            'nome': user[1],
            'sobrenome': user[2],
            'email': user[3]
        })
    return jsonify({'erro': 'Email ou senha inválidos'}), 401

@app.route('/api/pedidos', methods=['POST'])
def criar_pedido():
    data = request.get_json()
    user_id = data.get('usuario_id')
    tracking_code = data.get('tracking_code')
    recipient_name = data.get('recipient_name')
    email = data.get('email')

    pedido_id = insert_pedido(
        user_id, tracking_code, recipient_name, email,
        created_at=datetime.now().isoformat()
    )

    return jsonify({'mensagem': 'Pedido criado!', 'id': pedido_id})

@app.route('/api/pedidos/<int:pedido_id>', methods=['PUT'])
def atualizar_status(pedido_id):
    data = request.get_json()
    novo_status = data.get('status')

    atualizar_status_pedido(pedido_id, novo_status)
    email = get_email_por_pedido(pedido_id)

    if email:
        enviar_email(
            destinatario=email,
            assunto='Atualização no seu pedido',
            corpo=f'O status do seu pedido {pedido_id} foi atualizado para: {novo_status}.'
        )

    return jsonify({'mensagem': 'Status atualizado e e-mail enviado'})

@app.route('/api/pedidos/usuario/<int:user_id>', methods=['GET'])
def listar_pedidos(user_id):
    pedidos = get_pedidos_por_usuario(user_id)
    return jsonify(pedidos)

if __name__ == '__main__':
    app.run(debug=True)
