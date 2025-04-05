from google import genai
from google.genai import types
from flask import Flask, request
from flask_cors import CORS

import PIL.Image
import dotenv
import os
from io import BytesIO

dotenv.load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_html():
    if 'image' not in request.files:
        return 'No image file provided', 400
        
    image_file = request.files['image']
    # Read the image data once
    image_data = image_file.read()
    
    # Convert image to PIL Image and ensure white background
    image = PIL.Image.open(BytesIO(image_data))
    
    # Convert the image to RGBA if it isn't already
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    # Create a white background image
    background = PIL.Image.new('RGBA', image.size, (255, 255, 255, 255))
    
    # Composite the image onto the background
    composite = PIL.Image.alpha_composite(background, image)
    
    # Convert back to RGB (removing alpha channel) and save
    composite.convert('RGB').save('test_image.png', 'PNG')
    
    prompt = "Can you generate an HTML code for this image which is a mockup of a website? Match the features as much as you can. Make sure you include everything that is in the image and all text. Assume that the boundary of the image is the boundary of the computer screen, and scale the elements accordingly. At the end can you make all the components look like ShadCN? Please don't include any extra text besides the HTML that is used to generate the website."

    client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Content(
                parts=[
                    types.Part(text=prompt),
                    types.Part(inline_data=types.Blob(
                        mime_type='image/png',
                        data=image_data
                    ))
                ]
            )
        ]
    )

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