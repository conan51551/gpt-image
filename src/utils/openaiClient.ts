/*
 * @Author: Cross
 * @Date: 2025-05-13 15:04:04
 * @LastEditTime: 2025-05-16 09:49:06
 * @FilePath: /gpt-image/src/utils/openaiClient.ts
 * @Description: 
 */
import { OpenAI } from 'openai'

export const openai = new OpenAI({
  baseURL: 'https://aihubmix.com/v1',
  apiKey: 'sk-BlpFCIhU1ySUGwLF48B99a4413Ab4b8b86E7FbBc3e8aD447',
  dangerouslyAllowBrowser: true,
})
