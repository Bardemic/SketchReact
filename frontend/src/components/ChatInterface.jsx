import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Button from './Button'

function ChatInterface({ onSendMessage, iframeId, sketchId, iframeContent }) {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    setIsLoading(true)

    // Determine the current HTML content directly
    let htmlToSend = '';
    if (iframeContent) {
      htmlToSend = iframeContent;
    } else if (iframeId) {
      // Fallback to getting content directly from iframe element if ID is provided
      const iframeElement = document.getElementById(iframeId);
      if (iframeElement && iframeElement.srcdoc) {
        htmlToSend = iframeElement.srcdoc;
      } else {
        console.warn(`ChatInterface: Could not find iframe with ID ${iframeId} or its srcdoc.`);
      }
    }

    // Make sure we actually got some HTML
    if (!htmlToSend) {
        alert('Error: Preview content is empty or could not be accessed.');
        setIsLoading(false); // Reset loading state
        return;
    }

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          currentHtml: htmlToSend // Send the determined HTML directly
        })
      })

      if (!response.ok) {
        // Provide more specific error feedback if possible
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${response.status} ${errorText}`);
      }

      const newHtml = await response.text()
      
      // Update the page in the UI
      onSendMessage(newHtml)

      // Update the database with the new HTML
      if (sketchId) {
        const { error } = await supabase
          .from('sketches')
          .update({
            page_result: newHtml,
            last_modified: new Date().toISOString()
          })
          .eq('id', sketchId);

        if (error) {
          console.error('Error updating sketch in database:', error);
          throw new Error('Failed to save changes to database');
        }
      }

      setMessage('') // Clear input
    } catch (error) {
      console.error('Error sending message:', error)
      alert(`Failed to process your request: ${error.message}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    // Use fixed positioning to keep it at the bottom
    <div className="p-2 z-40">
      {/* Added shadow and ensured z-index is below header but above iframe potentially */}
      <form onSubmit={handleSubmit} className="flex gap-2 mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the changes you want to make..."
          className="flex-1 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50"
          disabled={isLoading}
        />
        <Button
          type="submit"
          variant="primary"
          className="px-6 transition duration-150 ease-in-out disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </form>
    </div>
  )
}

export default ChatInterface 