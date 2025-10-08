from flask import Blueprint, request, jsonify
from .chat import processar_mensagem, inicializar_chat

bp = Blueprint('chat', __name__)

# Histórico de chat em memória (não persistente)
chat_history = inicializar_chat()

@bp.route('/chat', methods=['POST'])
def chat():
    dados = request.get_json()
    pergunta = dados.get("pergunta")

    if not pergunta:
        return jsonify({"erro": "Campo 'pergunta' é obrigatório."}), 400

    resposta, atualizado = processar_mensagem(pergunta, chat_history)
    return jsonify({
        "resposta": resposta,
        "historico": atualizado
    })

from flask import current_app

# Serve index.html e qualquer arquivo estático dentro da pasta static como se estivessem na raiz
@bp.route('/', defaults={'path': 'index.html'})
@bp.route('/<path:path>')
def static_proxy(path):
    # current_app.send_static_file procura em app.static_folder (por padrão app/static)
    return current_app.send_static_file(path)

