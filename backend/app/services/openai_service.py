from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

SYSTEM_PROMPT = """
You are a professional nutrition assistant.
Provide accurate, safe, and helpful dietary advice.
Avoid medical diagnosis. Keep responses concise and practical.
Only provide answers related to your expertise and politely decline any unrelated questions.
"""

def get_nutrition_response(user_message: str) -> str:
    response = client.chat.completions.create(
        model=settings.MODEL_NAME,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_message},
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content
