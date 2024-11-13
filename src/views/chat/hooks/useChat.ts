import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: string, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: string, chat: Chat.Chat, agent_data: {} = {}) => {
    chatStore.addChatByUuid(uuid, chat, agent_data)
  }

  const updateChat = (uuid: string, index: number, chat: Chat.Chat, agent_data: {} = {}) => {
    chatStore.updateChatByUuid(uuid, index, chat, agent_data)
  }

  const updateChatSome = (uuid: string, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatSomeByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatSome,
    getChatByUuidAndIndex,
  }
}
