from mcp.server import MCPServer

from services.backend_client import call_backend


def register_biometric_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def verify_face(case_id: str) -> dict:
        """
        Verify the face associated with an identity document.

        The face verification result is retrieved from the backend
        Biometric service.
        """

        result = await call_backend(
            "/api/v1/biometric/face/verify",
            {
                "case_id": case_id
            }
        )

        return result

    @mcp.tool()
    async def check_liveness(case_id: str) -> dict:
        """
        Check whether the subject associated with a verification case
        is a live person or a spoof attempt.

        The liveness result is retrieved from the backend
        Biometric service.
        """

        result = await call_backend(
            "/api/v1/biometric/liveness",
            {
                "case_id": case_id
            }
        )

        return result

    @mcp.tool()
    async def detect_morph(case_id: str) -> dict:
        """
        Detect whether the face associated with an identity document has been morphed.

        The morph detection result is retrieved from the backend
        Biometric service.
        """

        result = await call_backend(
            "/api/v1/biometric/morph",
            {
                "case_id": case_id
            }
        )

        return result
