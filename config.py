import os
from dotenv import load_dotenv

# Carrega variáveis do .env
load_dotenv()

class Config:
    # As chaves continuam seguras no .env, mas você pode comentar os e-mails aqui para referência
    GROQ_API_KEYS = [
        os.getenv("GROQ_API_KEY_1"),  # email: ??
        os.getenv("GROQ_API_KEY_2"),  # email: menino a
        os.getenv("GROQ_API_KEY_3"),  # email: joao inteli
        os.getenv("GROQ_API_KEY_4"),  # email: joao tourinho
        os.getenv("GROQ_API_KEY_5"),  # email: joao 19801981
    ]
