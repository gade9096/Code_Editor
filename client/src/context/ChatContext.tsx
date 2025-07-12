import { ChatContext as ChatContextType, ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react"
import { useSocket } from "./SocketContext"

const ChatContext = createContext<ChatContextType | null>(null)

export const useChatRoom = (): ChatContextType => {
    const context = useContext(ChatContext)
    if (!context) {
        throw new Error("useChatRoom must be used within a ChatContextProvider")
    }
    return context
}

function ChatContextProvider({ children }: { children: ReactNode }) {
    const { socket } = useSocket()
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isNewMessage, setIsNewMessage] = useState<boolean>(false)
    const [lastScrollHeight, setLastScrollHeight] = useState<number>(0)
    const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)

    // Handle loading chat history from MongoDB
    const handleChatHistory = useCallback(
        ({ messages: historyMessages }: { messages: ChatMessage[] }) => {
            setMessages(historyMessages)
            setIsLoadingHistory(false)
        },
        [],
    )

    // Request chat history when joining room
    const requestChatHistory = useCallback(() => {
        setIsLoadingHistory(true)
        socket.emit(SocketEvent.REQUEST_CHAT_HISTORY)
    }, [socket])

    useEffect(() => {
        socket.on(
            SocketEvent.RECEIVE_MESSAGE,
            ({ message }: { message: ChatMessage }) => {
                setMessages((messages) => [...messages, message])
                setIsNewMessage(true)
            },
        )
        
        socket.on(SocketEvent.CHAT_HISTORY, handleChatHistory)
        
        return () => {
            socket.off(SocketEvent.RECEIVE_MESSAGE)
            socket.off(SocketEvent.CHAT_HISTORY)
        }
    }, [socket, handleChatHistory])

    return (
        <ChatContext.Provider
            value={{
                messages,
                setMessages,
                isNewMessage,
                setIsNewMessage,
                lastScrollHeight,
                setLastScrollHeight,
                isLoadingHistory,
                requestChatHistory,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export { ChatContextProvider }
export default ChatContext
