import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def main():
    print(" Post-Op Pal AI Brain (Terminal Mode)")
    print("Type 'exit' to quit\n")

    while True:
        user_input = input("You: ")

        if user_input.lower() in ["exit", "quit"]:
            print("AI: Session ended.")
            break

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful medical recovery assistant. Reply in the same language as the user."},
                {"role": "user", "content": user_input}
            ],
            temperature=0.4
        )

        print("AI:", response.choices[0].message.content)
        print("-" * 50)

if __name__ == "__main__":
    main()
