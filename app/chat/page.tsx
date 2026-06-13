'use client'

import { useState, useRef, useEffect } from 'react'

type Message =
  | { from: 'bot'; text: string; time: string }
  | { from: 'user'; text: string; time: string }
  | { from: 'files'; images: string[]; time: string }

const INITIAL: Message[] = [
  { from: 'bot', text: 'Hello!', time: '02:10 PM' },
  { from: 'bot', text: "Welcome! Your AI style companion. Let's find your perfect look!", time: '02:10 PM' },
]

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [input, setInput] = useState('')
  const [showAttach, setShowAttach] = useState(false)
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, pendingImages, isTyping])

  function sendText() {
    const text = input.trim()
    if (!text) return
    setInput('')
    setMessages(m => [...m, { from: 'user', text, time: now() }])
    simulateReply()
  }

  function simulateReply() {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(m => [...m, {
        from: 'bot',
        text: "Love your style! That outfit looks great — want me to suggest some matching accessories?",
        time: now(),
      }])
    }, 1500)
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    const urls = Array.from(files).map(f => URL.createObjectURL(f))
    setPendingImages(urls)
    setShowAttach(false)
  }

  function sendFiles() {
    if (!pendingImages.length) return
    setMessages(m => [...m, { from: 'files', images: pendingImages, time: now() }])
    setPendingImages([])
    simulateReply()
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">

      {/* Page title */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: "var(--font-playfair)" }}>Chat with Stylist</h1>
        <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
          <span className="w-2 h-2 bg-green-500 rounded-full inline-block" /> Online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => {
          if (msg.from === 'bot') {
            const prevBot = i > 0 && messages[i - 1].from === 'bot'
            return (
              <div key={i} className="flex flex-col items-start">
                {!prevBot && (
                  <span className="text-xs text-gray-400 mb-1.5 ml-1">{msg.time}</span>
                )}
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[75%] text-sm text-gray-700">
                  {msg.text}
                </div>
              </div>
            )
          }

          if (msg.from === 'user') {
            return (
              <div key={i} className="flex flex-col items-end">
                <span className="text-xs text-gray-400 mb-1.5 mr-1">{msg.time}</span>
                <div className="bg-[#6B2737] text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[75%] text-sm">
                  {msg.text}
                </div>
              </div>
            )
          }

          if (msg.from === 'files') {
            return (
              <div key={i} className="flex flex-col items-end gap-2">
                <span className="text-xs text-gray-400 mr-1">{msg.time}</span>
                <div className="flex gap-2">
                  {msg.images.map((src, j) => (
                    <img key={j} src={src} alt="upload"
                      className="w-28 h-28 object-cover rounded-xl shadow-sm" />
                  ))}
                </div>
              </div>
            )
          }
        })}

        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {pendingImages.length > 0 && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <span className="text-sm text-gray-600 flex-1">1 of 1 uploaded</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
              </svg>
            </div>
            <div className="flex gap-2 mb-3">
              {pendingImages.map((src, i) => (
                <img key={i} src={src} alt="preview" className="w-28 h-28 object-cover rounded-xl" />
              ))}
            </div>
            <button onClick={sendFiles}
              className="w-full bg-[#6B2737] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#8B3A4A] transition-colors">
              Send files
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Attach menu */}
      {showAttach && (
        <div className="bg-white border border-gray-100 shadow-lg rounded-t-2xl overflow-hidden mx-6">
          <button onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 px-5 py-4 bg-[#6B2737] text-white text-sm font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Send File
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 px-5 py-4 text-gray-600 text-sm hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Attach a screenshot
          </button>
        </div>
      )}

      {/* Input bar */}
      <div className="border-t border-gray-100 px-6 py-4 flex items-center gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendText()}
          placeholder="Write a message..."
          className="flex-1 text-sm text-gray-600 outline-none placeholder-gray-300 bg-transparent" />
        <button className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </button>
        <button onClick={() => setShowAttach(v => !v)} className="text-gray-300 hover:text-gray-500 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
          </svg>
        </button>
        <button onClick={sendText}
          className="w-9 h-9 bg-[#6B2737] rounded-full flex items-center justify-center hover:bg-[#8B3A4A] transition-colors flex-shrink-0">
          <svg className="w-4 h-4 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>

      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
        onChange={e => handleFiles(e.target.files)} />
    </div>
  )
}
