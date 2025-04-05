from google import genai
from google.genai import types
from flask import Flask, request, render_template_string
import PIL.Image
import dotenv
import os
import subprocess
import threading

app = Flask(__name__)
dotenv.load_dotenv()

# HTML template for the upload form
UPLOAD_FORM = """
<!DOCTYPE html>
<html>
<head>
    <title>Image to Website Generator</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .form-container { max-width: 500px; margin: 0 auto; }
        input { margin: 10px 0; padding: 5px; width: 100%; }
        button { padding: 10px; background: #007bff; color: white; border: none; cursor: pointer; }
        button:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="form-container">
        <h1>Image to Website Generator</h1>
        <form method="POST">
            <input type="text" name="image_path" placeholder="Enter path to your image" required>
            <input type="number" name="port" placeholder="Enter port number for the generated website (e.g., 3001)" required>
            <button type="submit">Generate Website</button>
        </form>
        {% if message %}
        <p>{{ message }}</p>
        {% endif %}
    </div>
</body>
</html>
"""

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
    return html_content.strip()

def create_server_file(html_content, port):
    # Create a temporary Python file for the second server
    server_code = f"""
from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return '''
    {html_content}
    '''

if __name__ == '__main__':
    app.run(port={port})
"""
    with open('generated_server.py', 'w') as f:
        f.write(server_code)

def start_server(port):
    subprocess.Popen(['python', 'generated_server.py'])

@app.route('/', methods=['GET', 'POST'])
def index():
    message = None
    if request.method == 'POST':
        image_path = request.form['image_path']
        port = request.form['port']
        
        try:
            # Generate HTML from the image
            html_content = generate_html(image_path)
            
            # Create and start the second server
            create_server_file(html_content, port)
            start_server(port)
            
            message = f"Website generated! Visit http://localhost:{port} to view it."
        except Exception as e:
            message = f"Error: {str(e)}"
    
    return render_template_string(UPLOAD_FORM, message=message)

if __name__ == '__main__':
    app.run(port=5001) 