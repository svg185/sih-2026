from mcp.server import MCPServer

from services.backend_client import call_backend
from services.gemini_client import investigate


def register_investigation_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def investigate_case(case_id: str) -> str:
        """
        Analyze an identity verification case and generate
        an AI-assisted investigation report.
        """

        evidence = await call_backend(
            "/api/v1/risk/assess",
            {
                "case_id": case_id
            }
        )

        report = investigate(evidence)

        return report