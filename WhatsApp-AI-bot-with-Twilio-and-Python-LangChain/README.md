---
Title: WhatsApp AI bot with Twilio and Python LangChain.
Excerpt: Simple example of a WhatsApp Bot using AI to answer questions.
Tech: "Twilio, Python, LangChain, OpenAI, ngrok"
---

# WhatsApp AI bot with Twilio and Python LangChain

Simple POC using LangChain to built a WhatsApp bot chat with.

## Requirements

 incoming_msg = request.values.get('Body', '').strip()  # User's WhatsApp message
    incoming_file_url = request.values.get('MediaUrl0')  # File URL if provided
