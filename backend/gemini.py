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
    
    prompt = '''
    You are an expert front-end developer.
    Assume the sketch represents a web page in a 1920x1080 browser window.
    The sketch has a drawn frame – this represents the browser window. All UI elements should stay within this container.
    Make sure that the drawn frame takes up the entire browser window of the output.
    Can you generate an HTML code for this image which is a mockup of a website? 
    Match the features as much as you can. 
    Make sure that items that look like checkboxes are checkable.
    Make sure that all items that look like buttons are clickable.
    Make sure you include everything that is in the image and all text.  
    At the end can you make all the components look like ShadCN? 
    Please don't include any extra text besides the HTML that is used to generate the website. 
    Don't say anything except the HTML.
    '''

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

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data or 'currentHtml' not in data:
        return 'Missing message or current HTML', 400
    
    prompt = f'''
    You are an expert front-end developer. A user has requested the following change to their website:
    "{data['message']}"
    
    Below is the current HTML of the website. Modify it to incorporate the requested changes while preserving the existing structure and functionality.
    Make sure any new elements match the existing styling.
    Only respond with the complete modified HTML code, no explanations or markdown.
    
    Current HTML:
    {data['currentHtml']}
    '''

    client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Content(
                parts=[types.Part(text=prompt)]
            )
        ]
    )
    
    # Extract HTML code from the response and remove any markdown formatting
    html_content = response.text.strip()
    if html_content.startswith("```html"):
        html_content = html_content[7:]
    if html_content.endswith("```"):
        html_content = html_content[:-3]
    html_content = html_content.strip()

    print(html_content)
    
    return html_content

if __name__ == '__main__':
    # html = generate_html('image.png')
    app.run(debug=True, host='127.0.0.1', port=3000)
    # generate_server(html)