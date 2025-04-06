from flask import Flask, request
from flask_cors import CORS
import anthropic
import base64
import PIL.Image
import dotenv
import os
from io import BytesIO
import json

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
    
    # Convert image to base64 for Claude API
    buffered = BytesIO()
    composite.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
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

    try:
        client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )

        message = client.messages.create(
            model="claude-3-7-sonnet-20250219",
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": img_str
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        )
        
        html_content = message.content[0].text.strip()
        
        # Extract HTML code from the response and remove markdown formatting
        if html_content.startswith("```html"):
            html_content = html_content[7:]  # Remove ```html
        if html_content.endswith("```"):
            html_content = html_content[:-3]  # Remove ```
        html_content = html_content.strip()  # Remove any extra whitespace
        return html_content
        
    except anthropic.APIError as e:
        print(f"API error: {str(e)}")
        return f'Claude API error: {str(e)}', 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return f'Error generating HTML: {str(e)}', 500

@app.route('/random', methods=['GET'])
def random():
    return '''<h1>This is a test</h1>'''

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    if not data or 'message' not in data or 'currentHtml' not in data:
        return 'Missing message or current HTML', 400
    
    user_message = data['message']
    current_html = data['currentHtml']

    # Ensure current_html is treated as a full document if it isn't already
    # (Claude works best with full documents for context)
    if not current_html.strip().lower().startswith(('<!doctype html>', '<html')):
        print("Warning: Received partial HTML for chat. Wrapping in basic structure.")
        current_html = f"<!DOCTYPE html>\n<html>\n<head><title>Preview</title></head>\n<body>\n{current_html}\n</body>\n</html>"

    prompt = f'''
    You are an expert front-end developer.
    A user wants to modify the following HTML code based on their request.

    User Request:
    """
    {user_message}
    """

    Current HTML:
    """
    {current_html}
    """

    Please provide the complete, modified HTML code that incorporates the user's request.
    Preserve the existing structure, functionality, and styling (including Tailwind classes and any inline styles or scripts like the drag-and-drop handlers) as much as possible.
    Only respond with the raw, complete HTML code, starting with <!DOCTYPE html> or <html> and ending with </html>. Do not include any explanations, apologies, or markdown formatting like ```html ... ```.
    '''

    try:
        client = anthropic.Anthropic(
            api_key=os.getenv('ANTHROPIC_API_KEY')
        )

        # Using Claude Sonnet 3.5 as it's generally good for coding tasks
        # You might adjust the model based on desired capability/cost
        message = client.messages.create(
            model="claude-3-5-sonnet-20240620", 
            max_tokens=4000, # Adjust max_tokens if needed
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        )
        
        modified_html_content = message.content[0].text.strip()
        
        # Basic cleanup (sometimes models still add markdown)
        if modified_html_content.startswith("```html"):
            modified_html_content = modified_html_content[7:]
        if modified_html_content.endswith("```"):
            modified_html_content = modified_html_content[:-3]
        modified_html_content = modified_html_content.strip()

        # Ensure it looks like a full HTML document
        if not modified_html_content.strip().lower().startswith(('<!doctype html>', '<html')):
             print("Warning: Claude chat response didn't start with <!doctype html> or <html>. Returning as is.")
             # Avoid wrapping here as it might hide the actual model error/output

        return modified_html_content
        
    except anthropic.APIError as e:
        print(f"Claude Chat API error: {str(e)}")
        return f'Claude API error during chat: {str(e)}', 500
    except Exception as e:
        print(f"Unexpected error during chat: {str(e)}")
        return f'Error processing chat request: {str(e)}', 500

if __name__ == '__main__':
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("Warning: ANTHROPIC_API_KEY is not set in .env file")
    app.run(debug=True, host='127.0.0.1', port=3000) 