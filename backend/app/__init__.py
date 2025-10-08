from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Libera CORS para todas as origens (ajuste para produção se quiser)
    CORS(app)

    # Registra o blueprint das rotas
    from . import routes
    app.register_blueprint(routes.bp)

    return app
