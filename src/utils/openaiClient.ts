import { OpenAI } from 'openai'

export const openai = new OpenAI({
  baseURL: 'https://aihubmix.com/v1',
  apiKey: 'sk-sauBOee0xEUC3LHd03Ce33Ea26Ea44Ea9cBf5278Ee58D1F6',
  dangerouslyAllowBrowser: true,
})
