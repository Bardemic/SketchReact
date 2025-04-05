from google import genai
from google.genai import types

import PIL.Image
import dotenv
import os

dotenv.load_dotenv()

image = PIL.Image.open('image2.png')
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

# Save the clean HTML to a file
with open('generated_website.html', 'w') as f:
    f.write(html_content)

print("HTML code has been saved to 'generated_website.html'")
print("\nCleaned HTML content:")
print(html_content)