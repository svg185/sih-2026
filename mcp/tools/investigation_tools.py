from mcp.server import MCPServer

from services.backend_client import call_backend
from services.gemini_client import investigate


def register_investigation_tools(mcp: MCPServer) -> None:

    @mcp.tool()
    async def investigate_case(case_id: str) -> str:
        """
        Collect verification evidence from multiple services
        and generate an AI-assisted investigation report.
        """

        # 1. Document Analysis
        document = await call_backend(
            "/api/v1/document/analyze",
            {
                "case_id": case_id
            }
        )

        # 2. MRZ Analysis
        mrz = await call_backend(
            "/api/v1/document/mrz",
            {
                "case_id": case_id
            }
        )

        # 3. Tampering Analysis
        tampering = await call_backend(
            "/api/v1/forensics/tampering",
            {
                "case_id": case_id
            }
        )

        # 4. Face Verification
        face = await call_backend(
            "/api/v1/biometric/face/verify",
            {
                "case_id": case_id
            }
        )

        # 5. Liveness Detection
        liveness = await call_backend(
            "/api/v1/biometric/liveness",
            {
                "case_id": case_id
            }
        )

        # 6. Face Morph Detection
        morph = await call_backend(
            "/api/v1/biometric/morph",
            {
                "case_id": case_id
            }
        )

        # 7. Watchlist Search
        watchlist = await call_backend(
            "/api/v1/intelligence/watchlist/search",
            {
                "case_id": case_id
            }
        )

        # 8. Risk Assessment
        # Send actual verification results to the Risk Engine
        risk = await call_backend(
            "/api/v1/risk/assess",
            {
                "case_id": case_id,
                "tampering_score": tampering.get(
                    "tampering_score", 0.0
                ),
                "face_similarity": face.get(
                    "similarity_score", 0.0
                ),
                "liveness_score": liveness.get(
                    "liveness_score", 0.0
                ),
                "morph_probability": morph.get(
                    "morph_probability", 0.0
                ),
                "mrz_valid": mrz.get(
                    "check_digits_valid", True
                ),
                "watchlist_match": watchlist.get(
                    "match_found", False
                )
            }
        )

        # 9. Audit History
        audit = await call_backend(
            "/api/v1/audit/history",
            {
                "case_id": case_id
            }
        )

        # Combine all verification evidence
        evidence = {
            "case_id": case_id,
            "document_analysis": document,
            "mrz_analysis": mrz,
            "tampering_analysis": tampering,
            "face_verification": face,
            "liveness_check": liveness,
            "morph_detection": morph,
            "watchlist_search": watchlist,
            "risk_assessment": risk,
            "audit_history": audit
        }

        # Send complete evidence to AI Investigator
        report = investigate(evidence)

        return report

    @mcp.tool()
    async def get_audit_history(case_id: str) -> dict:
        """
        Retrieve the audit history for an identity verification case.

        The audit history is retrieved from the backend audit service.
        """

        result = await call_backend(
            "/api/v1/audit/history",
            {
                "case_id": case_id
            }
        )

        return result

    @mcp.tool()
    async def create_investigation(case_id: str) -> dict:
        """
        Create a formal investigation case for a flagged
        identity verification case.

        The investigation is assigned for human officer review.
        """

        result = await call_backend(
            "/api/v1/investigation/create",
            {
                "case_id": case_id
            }
        )

        return result