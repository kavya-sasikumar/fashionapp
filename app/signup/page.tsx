'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-12 flex flex-col min-h-[80vh] justify-center">

      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-[#6B2737] flex items-center justify-center mb-4 shadow-md">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#6B2737]" style={{ fontFamily: "var(--font-playfair)" }}>FashionApp</h1>
        <p className="text-sm text-gray-400 mt-1">Your personal AI style assistant</p>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-playfair)" }}>Create an account</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-[#6B2737] mb-1.5 block">Full name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Doe"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#6B2737] transition-colors shadow-sm" />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#6B2737] mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#6B2737] transition-colors shadow-sm" />
        </div>

        <div>
          <label className="text-xs font-semibold text-[#6B2737] mb-1.5 block">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:border-[#6B2737] transition-colors shadow-sm pr-12" />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-[#6B2737] text-white py-4 rounded-2xl font-semibold text-sm hover:bg-[#8B3A4A] transition-colors shadow-sm">
          Create account
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#6B2737] font-semibold hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
