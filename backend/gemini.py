from google import genai
from google.genai import types
from flask import Flask, request
from flask_cors import CORS

import PIL.Image
import dotenv
import os

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_html():
    # image = PIL.Image.open(image_path)
    image = request.files.get('image')
    prompt = "Can you generate an HTML code for this image which is a mockup of a website? Match the features as much as you can. Make sure you include everything that is in the image and all text. Please don't include any extra text besides the HTML that is used to generate the website."

    client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt, image])

    # Extract HTML code from the response and remove markdown formatting
    html_content = response.text.strip()
    if html_content.startswith("```html"):
        html_content = html_content[7:]  # Remove ```html
    if html_content.endswith("```"):
        html_content = html_content[:-3]  # Remove ```
    html_content = html_content.strip()  # Remove any extra whitespace
    return html_content

@app.route('/random', methods=['GET'])
def random():
    return '''<h1>This is a test</h1>'''


if __name__ == '__main__':
    # html = generate_html('image.png')
    app.run(debug=True, host='127.0.0.1', port=3000)
    # generate_server(html)