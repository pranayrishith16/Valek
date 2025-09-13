import React, { useEffect, useRef, useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m VeritlyAI. Ask me anything about your legal docs.' }
  ])
  const [input, setInput] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    // autoscroll
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  async function onSubmit(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    // mock reply while you wire the backend
    const reply = await mockReply(text)
    setMessages(prev => [...prev, { role: 'assistant', content: reply }])
  }

  async function mockReply(text) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          `Demo reply: You said “${text}”.\n\nTo enable the real LLM, POST your chat to /api/chat (FastAPI/Next/etc.) and stream the response here.`
        )
      }, 600)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* top spacer so header doesn't overlap (header is absolute) */}
      <div className="h-20" />

      <div className="mx-auto max-w-5xl px-4 pb-28">
        <div className="rounded-2xl bg-white shadow-lg ring-1 ring-gray-900/5 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">VeritlyAI Chat</h2>
              <p className="text-sm text-gray-500">LLM assistant for faster legal research</p>
            </div>
            <div className="text-xs text-gray-400">Demo</div>
          </div>

          {/* messages */}
          <div ref={listRef} className="h-[60vh] overflow-auto bg-white">
            <ul className="space-y-4 p-5">
              {messages.map((m, i) => (
                <li key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <div
                    className={
                      'inline-block max-w-[80%] rounded-2xl px-4 py-2 text-sm ' +
                      (m.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900')
                    }
                    style={{ whiteSpace: 'pre-wrap' }}
                  >
                    {m.content}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* input */}
          <form onSubmit={onSubmit} className="border-t border-gray-100 p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask VeritlyAI..."
                className="flex-1 rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-white font-medium hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <PaperAirplaneIcon className="size-5" />
                Send
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Tip: Replace the mock with a real endpoint. For example, send {{ messages }} to your FastAPI /chat route and stream tokens back.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
