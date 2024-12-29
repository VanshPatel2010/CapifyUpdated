'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export function NavBar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">Budget App</Link>
        <div className="space-x-4">
          <Link href="/budget-tracker">Budget Tracker</Link>
          <Link href="/resources">Resources</Link>
          {status === 'authenticated' ? (
            <>
              <span>Signed in as {session.user?.email}</span>
              <button 
                onClick={() => signOut()} 
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-medium transition-colors"
              >
                Sign Out
              </button>
              <span>Balance {session.user?.balance}</span>
            </>
          ) : (
            <button 
              onClick={() => signIn()} 
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-medium transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}