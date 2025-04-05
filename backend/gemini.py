from google import genai
from google.genai import types
from flask import Flask, request

import PIL.Image
import dotenv
import os

dotenv.load_dotenv()

app = Flask(__name__)
@app.route('/generate', methods=['POST'])
def generate_html(image_path):
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
    return '''<!DOCTYPE html>
<html>
<head>
  <title>Random HTML Page</title>
</head>
<body>
  <h1>Hello, Random Visitor!</h1>
  <p>This is a random paragraph that doesn't really say anything meaningful. 
     But it serves as an example of a basic HTML structure.</p>
  
  <ul>
    <li>Random Fact #1: Banana is actually a berry.</li>
    <li>Random Fact #2: The Eiffel Tower can be 15 cm taller during the summer.</li>
    <li>Random Fact #3: Honey never spoils!</li>
  </ul>
  
  <img src="https://via.placeholder.com/150" alt="Random placeholder image" />

  <p>Thanks for stopping by and reading this random content!</p>
</body>
</html>'''


if __name__ == '__main__':
    # html = generate_html('image.png')
    app.run(debug=True, host='127.0.0.1', port=3000)
    # generate_server(html)