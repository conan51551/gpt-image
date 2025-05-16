import { useState } from 'react'
import { openai } from '../utils/openaiClient'
import { toBase64 } from '../utils/images'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Progress } from './ui/progress'
import { useRequest } from 'ahooks'
import { Icon } from '@iconify/react'

interface ChatProps {}

const ProgressRegex = /(\d+)\.\./
const ImageRegex = /\[.*\]\((.*)\)/

const Chat = (props: ChatProps) => {
  const [input, setInput] = useState<string>(`以赛博朋克风格重绘这张照片`)
  const [progress, setProgress] = useState<number>(0)
  const [image, setImage] = useState<string>('')
  const [imageBase64, setImageBase64] = useState<string>('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const base64 = await toBase64(e.target.files[0])
      setImageBase64(base64)
    }
  }

  const { run, loading } = useRequest(
    async () => {
      const stream = await openai.chat.completions.create({
        model: 'gpt-4o-image',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: input,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        stream: true,
      })

      for await (const event of stream) {
        const content = event.choices[0].delta.content
        console.log('content', content)
        const progress = content?.match(ProgressRegex)
        const image = content?.match(ImageRegex)
        if (progress) {
          setProgress(Number(progress[1]))
        } else if (image) {
          setImage(image[1])
        }
      }

      return
    },
    {
      manual: true,
    }
  )

  function handleGenerate() {
    setImage('')
    setProgress(0)
    run()
  }

  return (
    <div className="grid gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Select a reference image and customize the prompt to generate a new image.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div>
            <Label className="text-lg">Reference Image</Label>
            {!imageBase64 && <Input type="file" onChange={handleFileChange} />}
          </div>
          {imageBase64 && (
            <div className="w-full flex justify-center ">
              <div className="relative">
                <button
                  onClick={() => {
                    setImageBase64('')
                  }}
                  className="cursor-pointer -top-2 -right-2 rounded-full bg-black flex p-1 items-center  z-99 absolute"
                >
                  <span className=" text-white icon-[ph--x]" />
                </button>
                <img
                  style={{
                    height: 100,
                  }}
                  src={imageBase64}
                />
              </div>
            </div>
          )}
          <div>
            <Label className="text-lg">Customize (Optional)</Label>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter>
          <Button  className="w-full" onClick={handleGenerate}>
            Generate
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Output</CardTitle>
          <CardDescription>Powered by Gpt4o-image</CardDescription>
        </CardHeader>
        <CardContent className="min-h-80">
          {image && (
            <div className="w-full flex justify-center ">
              <div className="relative">
                <button
                  onClick={() => {
                    setImage('')
                  }}
                  className="cursor-pointer -top-2 -right-2 rounded-full bg-black flex p-1 items-center  z-99 absolute"
                >
                  <span className=" text-white icon-[ph--x]" />
                </button>
                <img
                  style={{
                    height: 300,
                  }}
                  src={image}
                />
              </div>
            </div>
          )}

          {loading && <Progress value={progress} />}
        </CardContent>
      </Card>
    </div>
  )
}

export default Chat
