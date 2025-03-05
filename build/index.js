import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const SWYTCHCODE_BASE_URL = "https://api.swytchcode.com/v1";
const USER_AGENT = "swytchcode/1.0.0";
// Create server instance
const server = new McpServer({
    name: "swytchcode",
    version: "1.0.0",
});
// Helper function for making Swytchcode API requests
async function apiCall(url, body) {
    const headers = {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
        "Content-Type": "application/json",
    };
    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json());
    }
    catch (error) {
        console.error("Error making API call:", error, url, body);
        return null;
    }
}
// Register swytchcode tools
server.tool("swytchcode-generate-code", "Get code for a given method in a given language and library version", {
    service: z.string().describe("Name of the service like Stripe, Paypal, etc."),
    version: z.string().describe("Version of the service like v1, v2, etc."),
    language: z.string().describe("Programming language like Python, Typescript, etc."),
    method: z.string().describe("Name of the method"),
}, async ({ service, version, language, method }) => {
    const generateCodeUrl = `${SWYTCHCODE_BASE_URL}/mcp-agent-generate`;
    const generateCodeData = await apiCall(generateCodeUrl, {
        "service": service, "version": version, "language": language, "type": "code", "method_workflow": method
    });
    if (!generateCodeData) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve data",
                },
            ],
        };
    }
    const code = generateCodeData.data || "";
    if (!code) {
        return {
            content: [
                {
                    type: "text",
                    text: `No code`,
                },
            ],
        };
    }
    const decodedCode = Buffer.from(code.code, 'base64').toString('utf-8');
    return {
        content: [
            {
                type: "text",
                text: decodedCode,
            },
        ],
    };
});
server.tool("swytchcode-list-options", "List all the possible methods, workflows, services and versions", {
    service: z.string().describe("Name of the service like Stripe, Paypal, etc."),
    version: z.string().describe("Version of the service like v1, v2, etc."),
    param: z.string().describe("Param can be one of methods, services, versions or workflows."),
    regex_input: z.string().describe("Name of the method, service, version, or workflow. Full name or regex pattern can be provided"),
}, async ({ service, version, param, regex_input }) => {
    const generateListUrl = `${SWYTCHCODE_BASE_URL}/mcp-agent-list`;
    const generateListData = await apiCall(generateListUrl, {
        "service": service, "version": version, "param": param, "type": "code", "regex_input": regex_input
    });
    if (!generateListData) {
        return {
            content: [
                {
                    type: "text",
                    text: "Failed to retrieve data",
                },
            ],
        };
    }
    const listData = generateListData.data || [];
    if (!listData) {
        return {
            content: [
                {
                    type: "text",
                    text: `No data`,
                },
            ],
        };
    }
    const concatenatedNames = generateListData.data.map((item) => item.name).join('\n');
    return {
        content: [
            {
                type: "text",
                text: concatenatedNames,
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Swytchcode MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
