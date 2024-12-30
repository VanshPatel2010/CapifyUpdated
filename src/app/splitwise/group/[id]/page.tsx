'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'

interface Group {
  _id: string
  name: string
  members: string[]
}

interface Split {
  user: string
  amount: number
}

interface Expense {
  _id: string
  description: string
  amount: number
  paidBy: string
  splitType: 'equal' | 'unequal'
  splits: Split[]
  date: string
}

export default function GroupPage() {
  const params = useParams()
  const { status } = useSession()
  const [group, setGroup] = useState<Group | null>(null)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [newMember, setNewMember] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal')
  const [splits, setSplits] = useState<Split[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [splitError, setSplitError] = useState<string | null>(null)

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#121212',
    color: 'white',
    padding: '2rem',
  }

  const errorMessageStyle: React.CSSProperties = {
    color: '#EF4444',
    fontSize: '0.875rem',
    marginTop: '0.5rem',
  }
  
  const contentStyle: React.CSSProperties = {
    maxWidth: '64rem',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: '1.875rem',
    fontWeight: 'bold',
    textAlign: 'center',
  }

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  }

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#87CEEB',
  }

  const inputStyle: React.CSSProperties = {
    backgroundColor: '#2D2D2D',
    borderColor: '#4A5568',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    width: '100%',
  }

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    border: 'none',
  }

  const memberStyle: React.CSSProperties = {
    padding: '0.5rem',
    backgroundColor: '#2D2D2D',
    borderRadius: '0.25rem',
  }

  const expenseCardStyle: React.CSSProperties = {
    padding: '1rem',
    backgroundColor: '#2D2D2D',
    borderRadius: '0.25rem',
  }

  const validateSplits = (splits: Split[], totalAmount: number): boolean => {
    const sum = splits.reduce((acc, split) => acc + split.amount, 0)
    return Math.abs(sum - totalAmount) < 0.01
  }

  const handleSplitChange = (user: string, newAmount: string) => {
    const newAmount_num = parseFloat(newAmount) || 0
    const newSplits = splits.map(split =>
      split.user === user ? { ...split, amount: newAmount_num } : split
    )
    setSplits(newSplits)
    
    setSplitError(null)
    
    if (splitType === 'unequal') {
      const totalAmount = parseFloat(amount)
      const currentTotal = newSplits.reduce((acc, split) => acc + split.amount, 0)
      if (Math.abs(currentTotal - totalAmount) >= 0.01) {
        setSplitError(`Current total (₹${currentTotal.toFixed(2)}) doesn't match expense amount (₹${totalAmount.toFixed(2)})`)
      }
    }
  }

  const fetchGroupDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/splitwise/groups/${params.id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch group details')
      }
      const data = await response.json()
      setGroup(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch group details')
    } finally {
      setIsLoading(false)
    }
  }, [params.id])
  
  const fetchExpenses = useCallback(async () => {
    try {
      const response = await fetch(`/api/splitwise/expense?groupId=${params.id}`)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch expenses')
      }
      const data = await response.json()
      setExpenses(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch expenses')
    }
  }, [params.id])

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchGroupDetails()
      fetchExpenses()
    }
  }, [status, params.id, fetchGroupDetails, fetchExpenses])

  useEffect(() => {
    if (group && group.members.length > 0) {
      const equalSplit = parseFloat(amount) / group.members.length
      setSplits(group.members.map(member => ({ user: member, amount: equalSplit })))
    }
  }, [group, amount])

  const handleAddMember = async () => {
    if (!newMember.trim()) return

    try {
      const response = await fetch(`/api/splitwise/groups/${params.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newMember }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add member')
      }

      setNewMember('')
      fetchGroupDetails()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add member')
    }
  }

  const handleAddExpense = async () => {
    if (!description || !amount || !paidBy) {
      setError('Please fill in all required fields')
      return
    }

    const totalAmount = parseFloat(amount)
    
    if (splitType === 'unequal') {
      if (!validateSplits(splits, totalAmount)) {
        setSplitError(`Split amounts must sum up to the total expense (₹${totalAmount.toFixed(2)})`)
        alert(`Split amounts must sum up to the total expense (₹${totalAmount.toFixed(2)})`)
        return
      }
    }

    setIsAddingExpense(true)
    try {
      const response = await fetch('/api/splitwise/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: totalAmount,
          paidBy,
          splitType,
          splits,
          groupId: params.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add expense')
      }

      setDescription('')
      setAmount('')
      setPaidBy('')
      setSplitType('equal')
      setSplitError(null)
      fetchExpenses()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add expense')
    } finally {
      setIsAddingExpense(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: '2rem', height: '2rem', border: '4px solid #3B82F6', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p style={{fontSize: '1.5rem'}}>Please sign in to access this page.</p>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{backgroundColor: '#EF4444', color: 'white', padding: '1rem', borderRadius: '0.25rem'}}>
          <h2 style={{fontWeight: 'bold'}}>Error</h2>
          <p>{error || 'Failed to load group data'}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={headingStyle}>{group.name}</h1>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Members</h2>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            {group.members.map((member) => (
              <div key={member} style={memberStyle}>
                {member}
              </div>
            ))}
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <input
              placeholder="Add new member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              style={inputStyle}
            />
            <button
              onClick={handleAddMember}
              style={buttonStyle}
            >
              ADD MEMBER
            </button>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Add New Expense</h2>
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={inputStyle}
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            style={inputStyle}
          >
            <option value="" disabled>
              Select Payer
            </option>
            {group.members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value as 'equal' | 'unequal')}
            style={inputStyle}
          >
            <option value="equal">
              Split Equally
            </option>
            <option value="unequal">
              Split Unequally
            </option>
          </select>
          {splitType === 'unequal' && (
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
              {splits.map((split, index) => (
                <div key={index} style={{display: 'flex', gap: '0.5rem'}}>
                  <input
                    value={split.user}
                    disabled
                    style={{...inputStyle, flexGrow: 1}}
                  />
                  <input
                    type="number"
                    value={split.amount}
                    onChange={(e) => handleSplitChange(split.user, e.target.value)}
                    style={{...inputStyle, width: '6rem'}}
                  />
                </div>
              ))}
              {splitError && (
                <div style={errorMessageStyle}>
                  {splitError}
                </div>
              )}
            </div>
          )}
          {error && (
            <div style={errorMessageStyle}>
              {error}
            </div>
          )}
          <button
            onClick={handleAddExpense}
            disabled={isAddingExpense}
            style={{...buttonStyle, width: '100%'}}
          >
            {isAddingExpense ? 'Adding Expense...' : 'ADD EXPENSE'}
          </button>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Expenses</h2>
          {expenses.length === 0 ? (
            <p style={{textAlign: 'center', color: '#9CA3AF'}}>No expenses yet. Add your first expense!</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} style={expenseCardStyle}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3 style={{fontWeight: '600'}}>{expense.description}</h3>
                    <p style={{fontSize: '0.875rem', color: '#9CA3AF'}}>Paid by {expense.paidBy}</p>
                    <p style={{fontSize: '0.75rem', color: '#6B7280'}}>Split: {expense.splitType}</p>
                  </div>
                  <p style={{fontSize: '1.125rem'}}>₹{expense.amount.toFixed(2)}</p>
                </div>
                <div style={{marginTop: '0.5rem', fontSize: '0.875rem'}}>
                  <p style={{fontWeight: '600'}}>Split details:</p>
                  {expense.splits && expense.splits.length > 0 ? (
                    expense.splits.map((split, index) => (
                      <p key={index}>{split.user}: ₹{split.amount.toFixed(2)}</p>
                    ))
                  ) : (
                    <p>No split details available.</p>
                  )}
                </div>  
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

