import asyncio

from backend_client import call_backend


async def main():
    result = await call_backend(
        "/api/v1/risk/assess",
        {
            "case_id": "CASE-001"
        }
    )

    print("\nBackend Response:")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())