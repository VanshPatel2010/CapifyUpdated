'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { useCallback } from 'react';

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
  }, [status, params.id, fetchGroupDetails, fetchExpenses] )

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

  const handleSplitChange = (user: string, newAmount: string) => {
    const newSplits = splits.map(split =>
      split.user === user ? { ...split, amount: parseFloat(newAmount) || 0 } : split
    )
    setSplits(newSplits)
  }

  const handleAddExpense = async () => {
    if (!description || !amount || !paidBy) return

    setIsAddingExpense(true)
    try {
      const response = await fetch('/api/splitwise/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          amount: parseFloat(amount),
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
      fetchExpenses()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add expense')
    } finally {
      setIsAddingExpense(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <p className="text-2xl">Please sign in to access this page.</p>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">
        <div className="bg-red-500 text-white p-4 rounded">
          <h2 className="font-bold">Error</h2>
          <p>{error || 'Failed to load group data'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">{group.name}</h1>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#87CEEB]">Members</h2>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member} className="p-2 bg-[#2D2D2D] rounded">
                {member}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              placeholder="Add new member"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-full"
            />
            <button
              onClick={handleAddMember}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              ADD MEMBER
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#87CEEB]">Add New Expense</h2>
          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-full"
          />
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-full"
          >
            <option value="" disabled>
              Select Payer
            </option>
            {group.members.map((member) => (
              <option key={member} value={member} className="bg-[#2D2D2D]">
                {member}
              </option>
            ))}
          </select>
          <select
            value={splitType}
            onChange={(e) => setSplitType(e.target.value as 'equal' | 'unequal')}
            className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-full"
          >
            <option value="equal" className="bg-[#2D2D2D]">
              Split Equally
            </option>
            <option value="unequal" className="bg-[#2D2D2D]">
              Split Unequally
            </option>
          </select>
          {splitType === 'unequal' && (
            <div className="space-y-2">
              {splits.map((split, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    value={split.user}
                    disabled
                    className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded flex-grow"
                  />
                  <input
                    type="number"
                    value={split.amount}
                    onChange={(e) => handleSplitChange(split.user, e.target.value)}
                    className="bg-[#2D2D2D] border-gray-700 text-white px-4 py-2 rounded w-24"
                  />
                </div>
              ))}
            </div>
          )}
          <button
            onClick={handleAddExpense}
            disabled={isAddingExpense}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            {isAddingExpense ? 'Adding Expense...' : 'ADD EXPENSE'}
          </button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#87CEEB]">Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-center text-gray-400">No expenses yet. Add your first expense!</p>
          ) : (
            expenses.map((expense) => (
              <div key={expense._id} className="p-4 bg-[#2D2D2D] rounded">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{expense.description}</h3>
                    <p className="text-sm text-gray-400">Paid by {expense.paidBy}</p>
                    <p className="text-xs text-gray-500">Split: {expense.splitType}</p>
                  </div>
                  <p className="text-lg">₹{expense.amount.toFixed(2)}</p>
                </div>
                <div className="mt-2 text-sm">
  <p className="font-semibold">Split details:</p>
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