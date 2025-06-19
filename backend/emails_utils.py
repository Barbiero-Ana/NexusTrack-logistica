import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

# Carregar variáveis do .env
load_dotenv()

EMAIL_ORIGEM = os.getenv("EMAIL_ORIGEM")
SENHA_APLICATIVO = os.getenv("SENHA_APLICATIVO")

def enviar_email(destinatario, assunto, corpo):
    msg = EmailMessage()
    msg['Subject'] = assunto
    msg['From'] = EMAIL_ORIGEM
    msg['To'] = destinatario
    msg.set_content(corpo)

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ORIGEM, SENHA_APLICATIVO)
        smtp.send_message(msg)
