from mcp.server import MCPServer

from services.backend_client import call_backend


def register_intelligence_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def search_watchlist(case_id: str) -> dict:
        """
        Search the authorized watchlist service for a verification case.

        The watchlist search result is retrieved from the backend
        Intelligence service.
        """

        result = await call_backend(
            "/api/v1/intelligence/watchlist/search",
            {
                "case_id": case_id
            }
        )

        return result