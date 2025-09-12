import React, { useEffect, useRef, useState } from 'react'
import './zai-chat.css'

// Minimal history (ChatGPT-like)
const SAMPLE_HISTORY = [
  { id: 1, title: 'New chat' },
  { id: 2, title: 'Research: privilege log' },
  { id: 3, title: 'Draft: NDA tweaks' },
  { id: 4, title: 'Summaries: case bundle' },
]

// Starter assistant messages with VeritlyAI examples
const INITIAL_MESSAGES = [
  { type: 'bot', text: "Welcome to VeritlyAI. I can summarize case law, extract key facts, draft clauses, and answer questions with citations.", timestamp: '10:30 AM' },
  { type: 'bot', text: `Try a sample:
• Summarize: "Summarize Roe v. Wade in 3 bullet points."
• Compare: "Compare consideration in contracts vs. promissory estoppel."
• Draft: "Draft an NDA clause for jurisdiction in Texas."
• Extract: "From this paragraph, list parties and dates."
• Cite: "Explain Rule 56 with citations."`, timestamp: '10:31 AM' }
]

export default function ZAIChat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [text, setText] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  function addMessage(type, content) {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { type, text: content, timestamp }])
  }

  function send() {
    const t = text.trim()
    if (!t) return
    addMessage('user', t)
    setText('')
    // Simulated assistant reply
    setTimeout(() => {
      const replies = [
        "I understand your question. Let me provide a comprehensive answer...",
        "That's an interesting point. Here's my perspective on it...",
        "Based on my knowledge, I can tell you that...",
        "Great question! Here's what I think about this topic...",
        "I'd be happy to help with that. Let me break it down for you...",
      ]
      const r = replies[Math.floor(Math.random()*replies.length)]
      addMessage('bot', r)
    }, 900)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="zai-chat">
      <div className="app-container">
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)}>
          <i className="fas fa-bars" />
        </button>

        {/* Sidebar */}
        <aside className={"sidebar" + (sidebarOpen ? ' open' : '')}>
          <div className="sidebar-header">
            <button
              className="new-chat-btn"
              onClick={() => setMessages([{ type: 'bot', text: 'Welcome to VeritlyAI. How can I help?', timestamp: 'Just now' }])}
            >
              <i className="fas fa-plus" /> New Chat
            </button>
          </div>
          <div className="chat-history">
            {SAMPLE_HISTORY.map(h => (
              <div key={h.id} className="chat-item">
                <div className="chat-title">{h.title}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Chat */}
        <main className="main-chat" onClick={() => setSidebarOpen(false)}>
          <div className="chat-header">
            <h1 className="chat-title-main">VeritlyAI</h1>
            <div className="chat-actions">
              <button className="action-btn" title="Clear conversation" onClick={() => setMessages([])}>
                <i className="fas fa-trash" />
              </button>
              <button className="action-btn" title="Settings">
                <i className="fas fa-cog" />
              </button>
            </div>
          </div>

          <div className="messages-container" ref={listRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={"message " + (m.type === 'user' ? 'user' : 'bot')}>
                <div className={"message-avatar " + (m.type === 'user' ? 'user-avatar' : 'bot-avatar')}>
                  <i className={"fas " + (m.type === 'user' ? 'fa-user' : 'fa-robot')} />
                </div>
                <div className="message-content">
                  <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }} />
                  <div className="message-timestamp">{m.timestamp}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                className="message-input"
                placeholder="Message VeritlyAI..."
                rows={1}
                value={text}
                onChange={(e) => {
                  const val = e.target.value
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                  setText(val)
                }}
                onKeyDown={handleKey}
              />
              <button className="send-btn" onClick={send} disabled={!text.trim()}>
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
