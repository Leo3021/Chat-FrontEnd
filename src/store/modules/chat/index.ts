import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { defaultState, getLocalState, setLocalState } from './helper'
import { router } from '@/router'
import { t } from '@/locales'
// import PatientsInfo from '@/assets/patients.json'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },

    getPatientIdByUuid(state: Chat.ChatState) {
      return (uuid: string) => {
        const index = state.history.findIndex(item => item.uuid === uuid)
        if (index !== -1)
          return state.history[index].hosId
        return null
      }
    },

    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: string) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },

    getAgentDataByUuid(state: Chat.ChatState) {
      return (uuid?: string) => {
        if (uuid)
          return state.agent.find(item => item.uuid === uuid)?.data ?? {}
        return state.agent.find(item => item.uuid === state.active)?.data ?? {}
      }
    },

    getPatientDataByhosId(state: Chat.ChatState) {
      return (hosId: string) => {
        return state.patientData.find(item => item.hosId === hosId)?.result ?? {}
      }
    },
  },

  actions: {
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },

    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      this.history.unshift(history)
      this.chat.unshift({ uuid: history.uuid, data: chatData })
      this.active = history.uuid
      this.reloadRoute(history.uuid)
    },

    updateHistory(uuid: string, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState()
      }
    },

    async deleteHistory(index: number) {
      this.history.splice(index, 1)
      this.chat.splice(index, 1)

      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: string) {
      this.active = uuid
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: string, index: number) {
      if (!uuid || uuid === '') {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChatByUuid(uuid: string, chat: Chat.Chat, agent_data: {}) {
      if (!uuid || uuid === '') {
        if (this.history.length === 0) {
          const uuid = uuidv4()
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.agent.push({ uuid, data: agent_data })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === t('chat.newChatTitle'))
            this.history[0].title = chat.text
          if (!this.agent[index]?.data?.understanding || agent_data?.understanding)
            this.agent[0].data = agent_data
          this.recordState()
        }
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (!this.agent[index]?.data?.understanding || agent_data?.understanding)
          this.agent[index].data = agent_data
        // if (this.history[index].title === t('chat.newChatTitle'))
        //   this.history[index].title = chat.text
        this.recordState()
      }
    },

    updateChatByUuid(uuid: string, index: number, chat: Chat.Chat, agent_data: {}) {
      if (!uuid || uuid === '') {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          if (!this.agent[0]?.data?.understanding || agent_data?.understanding)
            this.agent[0].data = agent_data
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        if (!this.agent[index]?.data?.understanding || agent_data?.understanding)
          this.agent[chatIndex].data = agent_data
        this.recordState()
      }
    },

    updateChatSomeByUuid(uuid: string, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid || uuid === '') {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    deleteChatByUuid(uuid: string, index: number) {
      if (!uuid || uuid === '') {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1)
          // this.agent[0].data.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        // this.agent[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: string) {
      if (!uuid || uuid === '') {
        if (this.chat.length) {
          this.chat[0].data = []
          this.agent[0].data = {}
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.agent[index].data = {}
        this.recordState()
      }
    },

    clearHistory() {
      this.$state = { ...defaultState() }
      this.recordState()
    },

    async reloadRoute(uuid?: string) {
      this.recordState()
      await router.push({ name: 'Chat', params: { uuid } })
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
