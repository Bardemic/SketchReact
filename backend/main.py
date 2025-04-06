from flask import Flask, request
from flask_cors import CORS
import dotenv
from claude import claude_generate_html, claude_chat
from gemini import gemini_generate_html, gemini_chat

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_html():
    return claude_generate_html(request)

@app.route('/chat', methods=['POST'])
def chat():
    return gemini_chat(request)

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=3000) 