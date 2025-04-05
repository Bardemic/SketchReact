import requests

import base64
import mimetypes

import dotenv
import os

dotenv.load_dotenv()

HEADERS = {
    "x-api-key": os.getenv('ANTHROPIC_API_KEY'),
    "Content-Type": "application/json",
    "anthropic-version": "2024-03-01"
}

def send_prompt_with_file(prompt, image_path):
    try:
        # Open and encode the image
        mime_type, _ = mimetypes.guess_type(image_path)
        if not mime_type:
            mime_type = 'application/octet-stream'
        
        with open(image_path, 'rb') as file:
            file_content = base64.b64encode(file.read()).decode('utf-8')
        
        messages = [{
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt
                },
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": mime_type,
                        "data": file_content
                    }
                }
            ]
        }]

        DATA = {
            "model": "claude-3-sonnet-20240307",
            "messages": messages,
            "max_tokens": 4000  # Increased for longer React/HTML responses
        }

        response = requests.post("https://api.anthropic.com/v1/messages", json=DATA, headers=HEADERS)
        response.raise_for_status()
        result = response.json()
        return result["content"][0]["text"]
    except Exception as e:
        print(f"Error: {e}")
        return None

# Main execution
image_path = 'image2.png'

# With HTML
prompt = "You are a 100x expert in turning rough sketches into beautiful web pages made from HTML. Convert this rough sketch into an image of a web page. Include only the components in the rough sketch in the image, with nothing else. Use the same colors and positions of the components for the web page. Please don't include any extra text besides the HTML script that is used to generate the website."

# With React
#prompt = "You are a 100x expert in turning rough sketches into beautiful web pages made from React. Convert this rough sketch into an image of a web page. Include only the components in the rough sketch in the image, with nothing else. Use the same colors and positions of the components for the web page. Please don't include any extra text besides the React script that is used to generate the website."

# Get the response from Claude
response = send_prompt_with_file(prompt, image_path)

if response:
    # Clean up the response (remove markdown if present)
    html_content = response.strip()
    if html_content.startswith("```html"):
        html_content = html_content[7:]
    if html_content.endswith("```"):
        html_content = html_content[:-3]
    html_content = html_content.strip()

    # Save the clean HTML to a file
    with open('generated_website.html', 'w') as f:
        f.write(html_content)

    print("HTML code has been saved to 'generated_website.html'")
    print("\nCleaned HTML content:")
    print(html_content)
else:
    print("Failed to generate HTML code")