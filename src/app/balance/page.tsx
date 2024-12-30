'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { signIn } from 'next-auth/react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Transaction {
  _id: string
  date: string
  amount: number
  type: 'income' | 'expense'
  description: string
}

interface BalanceResponse {
  data: Transaction[]
}

interface CurrentBalanceResponse {
  balance: number
}

export default function BalanceTracker() {
  const { data: session, status } = useSession()
  const [currentBalance, setCurrentBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchBalances().catch((err) => {
        console.error('Error in useEffect:', err)
      })
    }
  }, [status, session])

  const fetchBalances = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const balanceResponse = await fetch('/api/balanceTracker')
      const currentBalanceResponse = await fetch('/api/balanceTracker/current')
  
      if (!balanceResponse.ok || !currentBalanceResponse.ok) {
        const errorMsg = `Failed to fetch balances: ${balanceResponse.statusText || currentBalanceResponse.statusText}`
        setError(errorMsg)
        setTransactions([])
        setCurrentBalance(0)
        return
      }
  
      const balanceData = await balanceResponse.json() as BalanceResponse
      const currentBalanceData = await currentBalanceResponse.json() as CurrentBalanceResponse
  
      setTransactions(balanceData.data || [])
      setCurrentBalance(currentBalanceData.balance || 0)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      setTransactions([])
      setCurrentBalance(0)
      console.error('Error fetching balances:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeChange = (selectedType: 'income' | 'expense') => {
    setType(selectedType)
  }

  const handleSubmit = async () => {
    try {
      setError(null)
      if (!amount || isNaN(parseFloat(amount))) {
        setError('Please enter a valid amount')
        return
      }

      const response = await fetch('/api/balanceTracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description,
          date: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add transaction')
      }

      await fetchBalances()
      setAmount('')
      setDescription('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction'
      setError(errorMessage)
      console.error('Error adding balance:', err)
    }
  }

  const chartData = {
    labels: transactions.map((t) => new Date(t.date).toLocaleString()),
    datasets: [
      {
        label: 'Transaction Amounts',
        data: transactions.map((t) => t.amount),
        backgroundColor: transactions.map((t) =>
          t.type === 'income' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
        ),
      },
    ],
  }

  const chartOptions = {
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
    maintainAspectRatio: false,
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#1a202c',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  }

  const cardHeaderStyle: React.CSSProperties = {
    padding: '1.5rem',
    backgroundColor: '#2d3748',
    borderBottom: '1px solid #4a5568',
  }

  const cardBodyStyle: React.CSSProperties = {
    padding: '1.5rem',
  }

  const headingStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#e2e8f0',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    backgroundColor: '#2d3748',
    border: '1px solid #4a5568',
    borderRadius: '0.25rem',
    color: '#e2e8f0',
  }

  const buttonStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#4299e1',
    color: '#ffffff',
  }

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#4a5568',
    color: '#e2e8f0',
  }

  const errorStyle: React.CSSProperties = {
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(254, 215, 215, 0.1)',
    border: '1px solid #fc8181',
    color: '#fc8181',
    borderRadius: '0.25rem',
  }

  if (status === 'unauthenticated') {
    return (
      <div style={containerStyle}>
        <p style={{ marginBottom: '1rem', color: '#e2e8f0' }}>Please sign in to access the Balance Tracker.</p>
        <button
          onClick={() => signIn()}
          style={primaryButtonStyle}
        >
          Sign In
        </button>
      </div>
    )
  }

  if (loading) {
    return <p style={{ ...containerStyle, color: '#e2e8f0' }}>Loading...</p>
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={headingStyle}>Balance Tracker</h2>
        </div>
        <div style={cardBodyStyle}>
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          <h2 style={{ ...headingStyle, marginBottom: '1rem' }}>Current Balance: ₹{currentBalance.toFixed(2)}</h2>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={inputStyle}
            />
            <textarea
              style={inputStyle}
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                style={type === 'income' ? primaryButtonStyle : secondaryButtonStyle}
                onClick={() => handleTypeChange('income')}
              >
                Add Gain
              </button>
              <button
                style={type === 'expense' ? primaryButtonStyle : secondaryButtonStyle}
                onClick={() => handleTypeChange('expense')}
              >
                Add Spend
              </button>
            </div>
            <button
              onClick={handleSubmit}
              style={{ ...primaryButtonStyle, backgroundColor: '#48bb78' }}
            >
              Submit
            </button>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ ...headingStyle, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transaction History:</h3>
            {transactions.map((t) => (
              <p key={t._id} style={{ padding: '0.25rem 0', color: '#e2e8f0' }}>
                {new Date(t.date).toLocaleString()} - {t.type === 'income' ? 'gain' : 'loss'} of ₹
                {t.amount} - {t.description}
              </p>
            ))}
          </div>
          <div style={{ marginTop: '2rem', height: '400px', width: '100%' }}>
            <h3 style={{ ...headingStyle, fontSize: '1.25rem', marginBottom: '0.5rem' }}>Transaction Chart:</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

