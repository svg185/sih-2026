from mcp.server import MCPServer
from tools.forensic_tools import register_forensic_tools
from tools.risk_tools import register_risk_tools
from tools.investigation_tools import register_investigation_tools
from tools.documents_tools import register_document_tools
from tools.biometric_tools import register_biometric_tools
from tools.intelligence_tools import register_intelligence_tools

mcp = MCPServer("Identity Security MCP")


register_risk_tools(mcp)
register_biometric_tools(mcp)
register_investigation_tools(mcp)
register_document_tools(mcp)
register_forensic_tools(mcp)
register_intelligence_tools(mcp)
if __name__ == "__main__":
    mcp.run()