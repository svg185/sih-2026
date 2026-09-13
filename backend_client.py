import httpx


BACKEND_URL = "http://127.0.0.1:8000"


async def call_backend(endpoint: str, payload: dict) -> dict:
    """
    Send a request to the Identity Security backend
    and return its JSON response.
    """

    url = f"{BACKEND_URL}{endpoint}"

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            url,
            json=payload
        )

        response.raise_for_status()

        return response.json()