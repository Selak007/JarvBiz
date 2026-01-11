"use client";
import { createContext, useContext, useState } from 'react';
import RiskChatbox from '../components/RiskChatbox';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [chatState, setChatState] = useState({
        isOpen: false,
        title: "",
        initialQuery: "",
        initialDisplay: null,
        agentType: "RISK", // Default to RISK
        metaData: {} // For passing extra data like order_id, customer_id
    });

    const openChat = ({ title, initialQuery, initialDisplay, agentType = "RISK", metaData = {} }) => {
        setChatState({
            isOpen: true,
            title,
            initialQuery,
            initialDisplay,
            agentType,
            metaData
        });
    };

    const closeChat = () => {
        setChatState(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <ChatContext.Provider value={{ openChat, closeChat, chatState }}>
            {children}
            {chatState.isOpen && (
                <RiskChatbox
                    title={chatState.title}
                    initialQuery={chatState.initialQuery}
                    initialDisplay={chatState.initialDisplay}
                    agentType={chatState.agentType}
                    metaData={chatState.metaData}
                    onClose={closeChat}
                />
            )}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);
