import React, { useEffect, useRef, useState } from 'react'
import './mainChat.css'

// storage key
const STORAGE_KEY_TOKEN = 'veritlyai_free_token'

// Minimal history (ChatGPT-like)
const SAMPLE_HISTORY = [
  { id: 1, title: 'New chat' },
  { id: 2, title: 'Research: privilege log' },
  { id: 3, title: 'Draft: NDA tweaks' },
  { id: 4, title: 'Summaries: case bundle' },
]

// Starter assistant messages with VeritlyAI examples
const INITIAL_MESSAGES = [
  { 
    type: 'bot', 
    text: "Welcome to VeritlyAI. I can summarize case law, extract key facts, draft clauses, and answer questions with citations.",
    id: Date.now() + 1
  },
  { 
    type: 'bot', 
    text: `Try a sample:
• Summarize: "Summarize Roe v. Wade in 3 bullet points."
• Compare: "Compare consideration in contracts vs. promissory estoppel."
• Draft: "Draft an NDA clause for jurisdiction in Texas."
• Extract: "From this paragraph, list parties and dates."
• Cite: "Explain Rule 56 with citations."`,
    id: Date.now() + 2
  }
]

export default function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [text, setText] = useState('')
  const [activeChat, setActiveChat] = useState(null)
  const [error, setError] = useState(null)
  const listRef = useRef(null)
  
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])
  
  useEffect(() => {
    // checking if free token in localstorage
    const existingToken = localStorage.getItem(STORAGE_KEY_TOKEN)
    if (!existingToken){
      // requesting a free token
      fetch('http://localhost:8082/auth/free_token/',{
        method:'GET',
      })
        .then(res => res.json())
        .then(data => {
          const token = data.access_token
          if(token){
            localStorage.setItem(STORAGE_KEY_TOKEN,token)
            console.log("Free token saved to local storage")
          }
        })
        .catch(err => {
          console.error('Failed to fetch free token',err)
          setError('Failed to connect to server. Please check your connection.')
          setTimeout(() => setError(null), 5000)
        })
    } else {
      console.log('Free token already in the local_storage')
    }
  }, [])
  
  function addMessage(type, content) {
    const newMessage = {
      type,
      text: content,
      id: Date.now() + Math.random()
    }
    setMessages(prev => [...prev, newMessage])
  }
  
  function send() {
    const t = text.trim()
    if (!t) return
    
    // Clear any previous errors
    setError(null)
    
    addMessage('user', t)
    setText('')
    const token = localStorage.getItem(STORAGE_KEY_TOKEN)
    
    fetch('http://localhost:8082/rag/query/', {
      method:'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ question: t }),
    })
    .then(res => {
      if(!res.ok) throw new Error(`API Error: ${res.status}`)
      return res.json()
    })
    .then(data => {
      // extract answers and API response
      if(data.status == 'success' && data.response){
        const {answer, sources, metadata} = data.response
        // format source into clickable HTML list
        let sourcesHtml = ''
        if (sources && sources.length > 0){
          sourcesHtml =
              '<br><br><strong>Sources (' +
              sources.length + 
              '):</strong><ul>' +
              sources
              .map(src => {
                const excerpt = src.excerpt || 'Excerpt unavailable'
                const rank = src.rank || '?'
                const filename = src.filename || 'Unknown'
                return `<li><strong>Rank ${rank} - ${filename}:</strong> ${excerpt}</li>`
              })
              .join('') +
            '</ul>'
        }
        addMessage('bot', answer + sourcesHtml)
      } else {
        addMessage('bot', 'No valid response received from API')
      }
    })
    .catch(err => {
      console.log(err)
      setError('Sorry, something went wrong. Please try again.')
      setTimeout(() => setError(null), 5000)
    })
  }
  
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }
  
  function startNewChat() {
    setMessages(INITIAL_MESSAGES)
    setActiveChat(null)
  }
  
  return (
    <div className="chat-app">
      <div className="app-container">
        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(v => !v)}>
          <i className="fas fa-bars" />
        </button>
        
        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError(null)}>
              <i className="fas fa-times" />
            </button>
          </div>
        )}
        
        {/* Sidebar */}
        <aside className={"sidebar" + (sidebarOpen ? ' open' : '') + (sidebarCollapsed ? ' collapsed' : '')}>
          <div className="sidebar-header">
            <div className="brand">
              <div className="logo">V</div>
              {!sidebarCollapsed && <span className="brand-name">VeritlyAI</span>}
            </div>
            <button
              className="new-chat-btn"
              onClick={startNewChat}
              title="Start a new chat"
            >
              <i className="fas fa-plus" /> {!sidebarCollapsed && 'New Chat'}
            </button>
            <button 
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <i className={sidebarCollapsed ? "fas fa-chevron-right" : "fas fa-chevron-left"} />
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="sidebar-section">
              <h3 className="section-title">Recent chats</h3>
              <div className="chat-history">
                {SAMPLE_HISTORY.map(h => (
                  <div 
                    key={h.id} 
                    className={"chat-item" + (activeChat === h.id ? ' active' : '')}
                    onClick={() => setActiveChat(h.id)}
                  >
                    <i className="chat-icon fas fa-comment" />
                    <div className="chat-title">{h.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
        
        {/* Main Chat */}
        <main className={"main-chat" + (sidebarCollapsed ? ' sidebar-collapsed' : '')} onClick={() => setSidebarOpen(false)}>
          <div className="chat-header">
            <h1 className="chat-title-main">
              <i className="logo-small">V</i> VeritlyAI
            </h1>
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
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💬</div>
                <h2>Start a conversation with VeritlyAI</h2>
                <p>Ask questions about case law, request document drafting, or get case summaries.</p>
              </div>
            ) : (
              messages.map((m) => (
                <React.Fragment key={m.id}>
                  <div className={`message ${m.type}`}>
                    <div className="message-avatar">
                      {m.type === 'bot' ? (
                        <div className="avatar-bot">V</div>
                      ) : (
                        <div className="avatar-user">
                          <i className="fas fa-user" />
                        </div>
                      )}
                    </div>
                    <div className="message-content">
                      <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>') }} />
                    </div>
                  </div>
                  {m.type === 'user' && <div className="message-divider" />}
                </React.Fragment>
              ))
            )}
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
              <button 
                className={"send-btn" + (text.trim() ? '' : ' disabled')} 
                onClick={send} 
                disabled={!text.trim()}
                title="Send message"
              >
                <i className="fas fa-paper-plane" />
              </button>
            </div>
            <div className="input-hint">
              VeritlyAI can help with legal research, drafting, and case analysis
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}