import * as dotenv from 'dotenv'
import 'isomorphic-fetch'
import type { ChatMessage, SendMessageOptions } from 'chatgpt'
import { sendResponse } from '../utils'
import type { ApiModel, ChatContext, ChatGPTAPIOptions, ModelConfig } from '../types'
import { ChatGPTAPI } from './fetch'
import type { ChatGPTUnofficialProxyAPI } from './fetch'

dotenv.config()

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000

let apiModel: ApiModel
process.env.OPENAI_API_KEY = 'sk-H92Pr4Z'
if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
  throw new Error('Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable')

let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI

// To use ESM in CommonJS, you can use a dynamic import
(async () => {
  // More Info: https://github.com/transitive-bullshit/chatgpt-api
  const options: ChatGPTAPIOptions = {
    apiKey: process.env.OPENAI_API_KEY,
    apiBaseUrl: 'http://localhost:8281/',
    debug: true,
  }

  api = new ChatGPTAPI({ ...options })
  apiModel = 'ChatGPTAPI'
  // if (process.env.OPENAI_API_KEY) {
  //   const options: ChatGPTAPIOptions = {
  //     // apiKey: process.env.OPENAI_API_KEY,
  //     apiBaseUrl: "http://localhost:8280"
  //     debug: false,
  //   }

  //   api = new ChatGPTAPI({ ...options })
  //   apiModel = 'ChatGPTAPI'
  // }
  // else {
  //   const options: ChatGPTUnofficialProxyAPIOptions = {
  //     accessToken: process.env.OPENAI_ACCESS_TOKEN,
  //     debug: false,
  //   }

  //   if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
  //     const agent = new SocksProxyAgent({
  //       hostname: process.env.SOCKS_PROXY_HOST,
  //       port: process.env.SOCKS_PROXY_PORT,
  //     })
  //     options.fetch = (url, options) => {
  //       return fetch(url, { agent, ...options })
  //     }
  //   }

  //   if (process.env.API_REVERSE_PROXY)
  //     options.apiReverseProxyUrl = process.env.API_REVERSE_PROXY

  //   api = new ChatGPTUnofficialProxyAPI({
  //     accessToken: process.env.OPENAI_ACCESS_TOKEN,
  //     ...options,
  //   })
  //   apiModel = 'ChatGPTUnofficialProxyAPI'
  // }
})()

async function chatReply(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    let options: SendMessageOptions = { timeoutMs }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, { ...options })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatReplyProcess(
  message: string,
  lastContext?: { conversationId?: string; parentMessageId?: string },
  process?: (chat: ChatMessage) => void,
) {
  if (!message)
    return sendResponse({ type: 'Fail', message: 'Message is empty' })

  try {
    // let options: SendMessageOptions = { timeoutMs }
    let options: SendMessageOptions = { }

    if (lastContext)
      options = { ...lastContext }

    const response = await api.sendMessage(message, {
      ...options,
      onProgress: (partialResponse) => {
        process?.(partialResponse)
      },
    })

    return sendResponse({ type: 'Success', data: response })
  }
  catch (error: any) {
    return sendResponse({ type: 'Fail', message: error.message })
  }
}

async function chatConfig() {
  return sendResponse({
    type: 'Success',
    data: {
      apiModel,
      reverseProxy: process.env.API_REVERSE_PROXY,
      timeoutMs,
      socksProxy: (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) ? (`${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`) : '-',
    } as ModelConfig,
  })
}

export type { ChatContext, ChatMessage }

export { chatReply, chatReplyProcess, chatConfig }
