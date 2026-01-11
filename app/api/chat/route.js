
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { NextResponse } from "next/server";

const client = new BedrockAgentRuntimeClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function POST(req) {
    try {
        const { inputText, sessionId, agentType } = await req.json();

        if (!inputText || !sessionId) {
            return NextResponse.json(
                { error: "Missing inputText or sessionId" },
                { status: 400 }
            );
        }

        let agentId = process.env.AGENT_ID;
        let agentAliasId = process.env.AGENT_ALIAS_ID;

        if (agentType === 'DELIVERY') {
            agentId = process.env.DELIVERY_AGENT_ID;
            agentAliasId = process.env.DELIVERY_AGENT_ALIAS_ID;
        } else if (agentType === 'PRODUCT') {
            agentId = process.env.PRODUCT_AGENT_ID;
            agentAliasId = process.env.PRODUCT_AGENT_ALIAS_ID;
        } else if (agentType === 'REFUND') {
            agentId = process.env.REFUND_AGENT_ID;
            agentAliasId = process.env.REFUND_AGENT_ALIAS_ID;
        }

        const command = new InvokeAgentCommand({
            agentId: agentId,
            agentAliasId: agentAliasId,
            sessionId: sessionId,
            inputText: inputText,
        });

        const response = await client.send(command);

        let finalAnswer = "";

        if (response.completion) {
            for await (const event of response.completion) {
                if (event.chunk && event.chunk.bytes) {
                    finalAnswer += new TextDecoder("utf-8").decode(event.chunk.bytes);
                }
            }
        }

        return NextResponse.json({ response: finalAnswer });
    } catch (error) {
        console.error("Error invoking Bedrock agent:", error);
        console.error("Error details:", {
            message: error.message,
            name: error.name,
            stack: error.stack,
            agentId: process.env.AGENT_ID,
            region: process.env.AWS_REGION
        });
        return NextResponse.json(
            { error: "Failed to communicate with the agent", details: error.message },
            { status: 500 }
        );
    }
}
