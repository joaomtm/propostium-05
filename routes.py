from flask import Blueprint, request, jsonify, current_app
from chat import processar_mensagem, inicializar_chat

bp = Blueprint('chat', __name__)

# Histórico de chat em memória (não persistente)
chat_history = inicializar_chat()

# --- ROTA PRINCIPAL DO CHAT ---
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


# --- NOVA ROTA PARA REINICIAR CHAT (FUNCIONAL, SEM COMANDO /REINICIAR) ---
@bp.route('/reset', methods=['POST'])
def reset_chat():
    global chat_history
    chat_history = inicializar_chat()
    return jsonify({"status": "ok", "mensagem": "Sessão reiniciada com sucesso."})


# --- SERVE OS ARQUIVOS ESTÁTICOS (index.html, CSS, JS etc.) ---
@bp.route('/', defaults={'path': 'index.html'})
@bp.route('/<path:path>')
def static_proxy(path):
    # current_app.send_static_file procura em app.static_folder (por padrão app/static)
    return current_app.send_static_file(path)
