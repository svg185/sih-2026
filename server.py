from mcp.server import MCPServer

from tools.risk_tools import register_risk_tools
from tools.investigation_tools import register_investigation_tools


mcp = MCPServer("Identity Security MCP")


register_risk_tools(mcp)
register_investigation_tools(mcp)


if __name__ == "__main__":
    mcp.run()