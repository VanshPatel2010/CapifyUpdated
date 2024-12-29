'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Group {
  _id: string
  name: string
  members: string[]
  createdBy: string
}

export default function SplitwisePage() {
  const { data: session, status } = useSession()
  const [groups, setGroups] = useState<Group[]>([])
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [members, setMembers] = useState<string[]>([''])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchGroups()
    }
  }, [status, session])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/splitwise/groups')
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
      setGroups(data)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Failed to fetch groups')
      }
    }
  }

  // Rest of your component code remains the same

  // Rest of your component code remains the same
  const handleAddMember = () => {
    setMembers([...members, ''])
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
  }

  const handleCreateGroup = async () => {
    setError(null); // Reset any previous errors
  
    if (!groupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }
  
    try {
      const validMembers = members.filter(member => member.trim() !== '');
      const response = await fetch('/api/splitwise/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          members: validMembers,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create group');
      }
      
      await fetchGroups(); // Refresh the groups list
      setIsCreateGroupOpen(false);
      setGroupName('');
      setMembers(['']);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  }
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div>Please sign in to access Splitwise</div>
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#87CEEB] bg-opacity-20 p-8 rounded-lg mb-8">
          <h1 className="text-4xl font-bold text-center mb-4">Dashboard</h1>
        </div>

       {/* Add error message display here */}
       {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <button
          onClick={() => setIsCreateGroupOpen(true)}
          className="text-[#87CEEB] hover:text-[#5F9EA0] mb-8 block mx-auto text-lg"
        >
          Create New Group
        </button>

        <h2 className="text-2xl font-semibold mb-4">Your Groups</h2>
        
        {groups.length === 0 ? (
          <p className="text-center text-gray-400">No groups available. Create a new group!</p>
        ) : (
          <div className="grid gap-4">
            {groups.map(group => (
              <a
                key={group._id}
                href={`/splitwise/group/${group._id}`}
                className="block p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-xl font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-400">{group.members.length} members</p>
              </a>
            ))}
          </div>
        )}

        {isCreateGroupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1E1E1E] text-white p-6 rounded shadow-lg w-full max-w-md">
              <h2 className="text-2xl font-bold text-center mb-4">Create New Group</h2>
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 mb-4 bg-[#2D2D2D] border border-gray-700 text-white rounded"
              />
              {members.map((member, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  className="w-full p-2 mb-2 bg-[#2D2D2D] border border-gray-700 text-white rounded"
                />
              ))}
              <button
                onClick={handleAddMember}
                className="w-full py-2 mb-2 bg-gradient-to-r from-[#1E3B8B] to-[#87CEEB] hover:opacity-90 text-white rounded"
              >
                ADD MEMBER
              </button>
              <button
                onClick={handleCreateGroup}
                className="w-full py-2 mb-2 bg-gradient-to-r from-[#1E3B8B] to-[#87CEEB] hover:opacity-90 text-white rounded"
              >
                CREATE GROUP
              </button>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

