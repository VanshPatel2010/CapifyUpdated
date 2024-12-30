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

  const handleAddMember = () => {
    setMembers([...members, ''])
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
  }

  const handleCreateGroup = async () => {
    setError(null)

    if (!groupName.trim()) {
      setError('Group name cannot be empty')
      return
    }

    try {
      const validMembers = members.filter(member => member.trim() !== '')
      const response = await fetch('/api/splitwise/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: groupName.trim(),
          members: validMembers,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create group')
      }
      
      await fetchGroups()
      setIsCreateGroupOpen(false)
      setGroupName('')
      setMembers([''])
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: 'white',
    padding: '2rem'
  }

  const contentStyle = {
    maxWidth: '64rem',
    margin: '0 auto'
  }

  const headerStyle = {
    background: 'linear-gradient(145deg, rgba(135, 206, 235, 0.2), rgba(26, 29, 36, 0.6))',
    padding: '2rem',
    borderRadius: '0.5rem',
    marginBottom: '2rem'
  }

  const titleStyle = {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '1rem'
  }

  const errorStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.5)',
    color: 'rgb(252, 165, 165)',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  }

  const createButtonStyle = {
    color: 'rgb(135, 206, 235)',
    display: 'block',
    margin: '0 auto',
    fontSize: '1.125rem',
    marginBottom: '2rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0.5rem 1rem'
  }

  const groupsHeaderStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem'
  }

  const emptyMessageStyle = {
    textAlign: 'center' as const,
    color: 'rgb(156, 163, 175)'
  }

  const groupGridStyle = {
    display: 'grid',
    gap: '1rem'
  }

  const groupCardStyle = {
    padding: '1rem',
    borderRadius: '0.5rem',
    backgroundColor: 'rgba(31, 41, 55, 0.5)',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }

  const groupNameStyle = {
    fontSize: '1.25rem',
    fontWeight: '600'
  }

  const memberCountStyle = {
    fontSize: '0.875rem',
    color: 'rgb(156, 163, 175)'
  }

  const modalOverlayStyle = {
    position: 'fixed' as const,
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  }

  const modalContentStyle = {
    backgroundColor: '#1E1E1E',
    color: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    width: '100%',
    maxWidth: '28rem',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }

  const modalTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '1rem'
  }

  const inputStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    backgroundColor: '#2D2D2D',
    border: '1px solid rgb(75, 85, 99)',
    color: 'white',
    borderRadius: '0.375rem'
  }

  const gradientButtonStyle = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '0.5rem',
    background: 'linear-gradient(to right, #1E3B8B, #87CEEB)',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer'
  }

  const cancelButtonStyle = {
    width: '100%',
    padding: '0.5rem',
    backgroundColor: '#4A5568',
    color: 'white',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer'
  }

  if (status === 'loading') {
    return <div style={containerStyle}>Loading...</div>
  }

  if (status === 'unauthenticated') {
    return <div style={containerStyle}>Please sign in to access Splitwise</div>
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Dashboard</h1>
        </div>

        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        <button
          onClick={() => setIsCreateGroupOpen(true)}
          style={createButtonStyle}
        >
          Create New Group
        </button>

        <h2 style={groupsHeaderStyle}>Your Groups</h2>
        
        {groups.length === 0 ? (
          <p style={emptyMessageStyle}>No groups available. Create a new group!</p>
        ) : (
          <div style={groupGridStyle}>
            {groups.map(group => (
              <a
                key={group._id}
                href={`/splitwise/group/${group._id}`}
                style={groupCardStyle}
              >
                <h3 style={groupNameStyle}>{group.name}</h3>
                <p style={memberCountStyle}>{group.members.length} members</p>
              </a>
            ))}
          </div>
        )}

        {isCreateGroupOpen && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2 style={modalTitleStyle}>Create New Group</h2>
              {error && <p style={{ ...errorStyle, marginBottom: '0.5rem' }}>{error}</p>}
              <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                style={inputStyle}
              />
              {members.map((member, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Member ${index + 1}`}
                  value={member}
                  onChange={(e) => handleMemberChange(index, e.target.value)}
                  style={inputStyle}
                />
              ))}
              <button
                onClick={handleAddMember}
                style={gradientButtonStyle}
              >
                ADD MEMBER
              </button>
              <button
                onClick={handleCreateGroup}
                style={gradientButtonStyle}
              >
                CREATE GROUP
              </button>
              <button
                onClick={() => setIsCreateGroupOpen(false)}
                style={cancelButtonStyle}
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

