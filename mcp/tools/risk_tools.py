from mcp.server import MCPServer

from services.backend_client import call_backend


def register_risk_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def calculate_risk(case_id: str) -> dict:
        """
        Retrieve the risk assessment for an identity verification case.

        The risk score is calculated by the backend Risk Engine.
        """

        result = await call_backend(
            "/api/v1/risk/assess",
            {
                "case_id": case_id
            }
        )

        return result