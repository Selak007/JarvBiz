"use client";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function RiskChatbox({ title, initialQuery, initialDisplay, agentType, metaData, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const messagesEndRef = useRef(null);
    const initializedRef = useRef(false);

    // Track if we are waiting for the refund reason input
    const [isWaitingForRefundReason, setIsWaitingForRefundReason] = useState(agentType === 'REFUND');

    useEffect(() => {
        // Reset state when chat opens or changes context
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        setMessages([]);
        setIsWaitingForRefundReason(agentType === 'REFUND');
        initializedRef.current = false;

        // Immediate initialization based on type
        // We do this in a timeout to ensure state has settled or just let the next effect handle it
    }, [agentType, title]);

    useEffect(() => {
        if (!sessionId || initializedRef.current) return;

        if (agentType === 'REFUND') {
            // Explicitly set the agent message
            setMessages([{ role: "agent", content: "Please state the reason for the refund." }]);
            console.log("RiskChatbox: Initialized REFUND prompt");
        } else if (initialQuery) {
            // For other agents, send initial query
            // We manually add the user message and trigger the fetch to ensure control
            const visualContent = initialDisplay || initialQuery;
            setMessages([{ role: "user", content: visualContent }]);
            setLoading(true);

            // Trigger fetch manually to avoid circular dependencies in sendMessage
            fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputText: initialQuery,
                    sessionId: sessionId,
                    agentType: agentType
                }),
            })
                .then(res => res.json())
                .then(data => {
                    if (data.response) {
                        setMessages(prev => [...prev, { role: "agent", content: data.response }]);
                    } else {
                        setMessages(prev => [...prev, { role: "error", content: data.error || "Error" }]);
                    }
                })
                .catch(err => {
                    console.error(err);
                    setMessages(prev => [...prev, { role: "error", content: "Failed to connect." }]);
                })
                .finally(() => setLoading(false));
        }

        initializedRef.current = true;
    }, [sessionId, agentType, initialQuery, initialDisplay]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setInput("");
        setLoading(true);

        let payloadText = text;

        // Intercept refund reason
        if (isWaitingForRefundReason) {
            const { customer_id, order_id, order_item_id } = metaData || {};
            payloadText = `I need a refund for this details : customer_id "${customer_id}", order_id "${order_id}", order_item_id "${order_item_id}" , the reason of the refund is "${text}"`;
            setIsWaitingForRefundReason(false);
        }

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    inputText: payloadText,
                    sessionId: sessionId,
                    agentType: agentType
                }),
            });

            const data = await res.json();
            if (data.response) {
                setMessages((prev) => [...prev, { role: "agent", content: data.response }]);
            } else {
                setMessages((prev) => [...prev, { role: "error", content: data.error || "Error" }]);
            }
        } catch (error) {
            setMessages((prev) => [...prev, { role: "error", content: "Failed to send message." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            sendMessage(input);
        }
    };

    return (
        <div className="chatbox-container glass-card">
            <div className="chatbox-header">
                <h4>{title || "AI Assistance"}</h4>
                <button onClick={onClose} className="close-btn">
                    &times;
                </button>
            </div>
            <div className="chatbox-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
                {loading && <div className="message agent loading">Analyzing...</div>}
                <div ref={messagesEndRef} />
            </div>
            <div className="chatbox-input">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={loading}
                />
                <button onClick={() => sendMessage(input)} disabled={loading}>
                    Send
                </button>
            </div>

            <style jsx>{`
        .chatbox-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 350px;
          height: 500px;
          display: flex;
          flex-direction: column;
          z-index: 1000;
          background: hsl(var(--card));
          border: 1px solid hsl(var(--border) / 0.5);
          border-radius: var(--radius);
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
          overflow: hidden;
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .chatbox-header {
          padding: 1rem;
          border-bottom: 1px solid hsl(var(--border) / 0.5);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.2);
        }
        .chatbox-header h4 {
          margin: 0;
          font-size: 0.9rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }
        .close-btn {
          background: none;
          border: none;
          color: hsl(var(--muted-foreground));
          font-size: 1.5rem;
          cursor: pointer;
          line-height: 1;
        }
        .chatbox-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .message {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.9rem;
          line-height: 1.4;
          max-width: 85%;
          word-wrap: break-word;
        }
        .message.user {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          align-self: flex-end;
          border-bottom-right-radius: 0;
        }
        .message.agent {
          background: hsl(var(--muted));
          color: hsl(var(--foreground));
          align-self: flex-start;
          border-bottom-left-radius: 0;
        }
        .message.error {
          background: hsl(var(--destructive) / 0.1);
          color: hsl(var(--destructive));
          align-self: center;
          font-size: 0.8rem;
        }
        .message.loading {
            font-style: italic;
            opacity: 0.7;
        }
        .chatbox-input {
          padding: 1rem;
          border-top: 1px solid hsl(var(--border) / 0.5);
          display: flex;
          gap: 0.5rem;
          background: rgba(0,0,0,0.2);
        }
        .chatbox-input input {
          flex: 1;
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
          padding: 0.5rem 0.75rem;
          border-radius: 0.25rem;
          color: hsl(var(--foreground));
          font-size: 0.9rem;
        }
        .chatbox-input input:focus {
            outline: none;
            border-color: hsl(var(--primary));
        }
        .chatbox-input button {
          background: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          font-weight: 500;
        }
        .chatbox-input button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
      `}</style>
        </div>
    );
}
