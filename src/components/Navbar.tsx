'use client'


import { useSession, signIn, signOut } from 'next-auth/react'

export function NavBar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        
        <div className="space-x-4 pr-4">
          {status === 'authenticated' ? (
            <>
             
              <button 
                onClick={() => signOut()} 
                className="absolute top-0 right-0 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white font-medium transition-colors mr-1"
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