from google import genai
from google.genai import types
from flask import Flask, request

import PIL.Image
import dotenv
import os

dotenv.load_dotenv()

def generate_html(image_path):
    image = PIL.Image.open(image_path)
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

def generate_server(html):
    app = Flask(__name__)

    @app.route('/')
    def index():
        return html

    app.run(debug=True, host='0.0.0.0', port=3000)

if __name__ == '__main__':
    html = generate_html('image.png')
    generate_server(html)