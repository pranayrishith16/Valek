import React, { useState } from 'react'
import loginIllustration from '../assets/login-illustration.jpg'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  function onSubmit(e) {
    e.preventDefault()
    // TODO: wire up your auth here
    alert(`Logged in as ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Illustration / left pane */}
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-white" />
            {loginIllustration && (
              <img
                src={loginIllustration}
                alt="Decorative"
                className="absolute inset-0 h-full w-full object-contain p-8"
              />
            )}
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="space-y-2">
                <h3 className="text-gray-900 text-xl font-semibold">VeritlyAI</h3>
                <p className="text-gray-600 text-sm">
                  Secure login for clients and teams. Your data stays private.
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">in</a>
                <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">X</a>
                <a href="#" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">f</a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">Log in</h2>
              <p className="mt-2 text-sm text-gray-600">Welcome back to <span className="font-medium">VeritlyAI</span></p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@firm.com"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
                  />
                  <EnvelopeIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setShowPwd(s => !s)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {showPwd ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="mt-1 relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-500"
                  />
                  <LockClosedIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  Remember me
                </label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>

              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Create one</a>
              </p>
              <p className="text-xs text-gray-500">By continuing you agree to our Terms and Privacy Policy.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
