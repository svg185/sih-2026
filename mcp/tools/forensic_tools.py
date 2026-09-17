from mcp.server import MCPServer

from services.backend_client import call_backend


def register_forensic_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def detect_tampering(case_id: str) -> dict:
        """
        Detect possible tampering or manipulation in an identity document.

        The tampering analysis result is retrieved from the backend
        Forensics service.
        """

        result = await call_backend(
            "/api/v1/forensics/tampering",
            {
                "case_id": case_id
            }
        )

        return result