import ChatInput from "@/components/chats/ChatInput"
import ChatList from "@/components/chats/ChatList"
import { useChatRoom } from "@/context/ChatContext"
import useResponsive from "@/hooks/useResponsive"
import { useEffect } from "react"

const ChatsView = () => {
    const { viewHeight } = useResponsive()
    const { requestChatHistory } = useChatRoom()

    // Request chat history when component mounts
    useEffect(() => {
        requestChatHistory()
    }, [requestChatHistory])

    return (
        <div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-2 p-4"
            style={{ height: viewHeight }}
        >
            <h1 className="view-title">Group Chat</h1>
            {/* Chat list */}
            <ChatList />
            {/* Chat input */}
            <ChatInput />
        </div>
    )
}

export default ChatsView
