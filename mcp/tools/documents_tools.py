from mcp.server import MCPServer

from services.backend_client import call_backend


def register_document_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def analyze_document(case_id: str) -> dict:
        """
        Analyze an identity document for a verification case.

        The document analysis result is retrieved from the backend
        Document AI service.
        """

        result = await call_backend(
            "/api/v1/document/analyze",
            {
                "case_id": case_id
            }
        )

        return result

    @mcp.tool()
    async def extract_mrz(case_id: str) -> dict:
        """
        Extract and validate the MRZ from an identity document.

        The MRZ extraction result is retrieved from the backend
        Document AI service.
        """

        result = await call_backend(
            "/api/v1/document/mrz",
            {
                "case_id": case_id
            }
        )

        return result