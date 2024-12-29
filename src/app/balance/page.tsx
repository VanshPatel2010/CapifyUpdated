
// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useSession } from 'next-auth/react'
// import { Bar } from 'react-chartjs-2'
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js'
// import { signIn } from 'next-auth/react'
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// interface Transaction {
//   _id: string
//   date: string
//   amount: number
//   type: 'income' | 'expense'
//   description: string
// }

// export default function BalanceTracker() {
//   const { data: session, status } = useSession()
//   const [currentBalance, setCurrentBalance] = useState<number>(0)
//   const [transactions, setTransactions] = useState<Transaction[]>([])
//   const [amount, setAmount] = useState<string>('')
//   const [description, setDescription] = useState<string>('')
//   const [type, setType] = useState<'income' | 'expense'>('income')
//   const [loading, setLoading] = useState<boolean>(true)
  

//   useEffect(() => {
//     if (status === 'authenticated' && session?.user?.id) {
//       fetchBalances()
//     }
//   }, [status, session])

//   const fetchBalances = async () => {
//     try {
//       setLoading(true);
      
//       const balanceResponse = await fetch('/api/balanceTracker');
//       const currentBalanceResponse = await fetch('/api/balanceTracker/current');
  
//       if (!balanceResponse.ok || !currentBalanceResponse.ok) {
//         throw new Error('Failed to fetch balances');
//       }
  
//       const balanceData = await balanceResponse.json();
//       const currentBalanceData = await currentBalanceResponse.json();
  
//       setTransactions(balanceData.data || []);
//       setCurrentBalance(currentBalanceData.balance || 0);
//     } catch (error) {
//       console.error('Error fetching balances:', error);
//       setTransactions([]);
//       setCurrentBalance(0);
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const handleTypeChange = (selectedType: 'income' | 'expense') => {
//     setType(selectedType)
//   }

//   const handleSubmit = async () => {
//     try {
//       await fetch('/api/balanceTracker', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           type,
//           amount: parseFloat(amount),
//           description,
//           date: new Date().toISOString(),
//         }),
//       })
//       fetchBalances()
//       setAmount('')
//       setDescription('')
//     } catch (error) {
//       console.error('Error adding balance:', error)
//     }
//   }

//   const chartData = {
//     labels: transactions.map((t) => new Date(t.date).toLocaleString()),
//     datasets: [
//       {
//         label: 'Transaction Amounts',
//         data: transactions.map((t) => t.amount),
//         backgroundColor: transactions.map((t) =>
//           t.type === 'income' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'
//         ),
//       },
//     ],
//   }

//   if (status === 'unauthenticated') {
//     console.log(session)
//     return (
//       <div>
//         Please sign in to access the Balance Tracker.
//         <button
//           onClick={() => signIn()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//         >
//           Sign In
//         </button>
//       </div>
//     )
//   }

//   if (loading) {
//     return <p>Loading...</p>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <div className="p-6 bg-gray-50 border-b">
//           <h2 className="text-2xl font-semibold">Balance Tracker</h2>
//         </div>
//         <div className="p-6">
//           <h2 className="text-2xl font-bold mb-4">Current Balance: ₹{currentBalance.toFixed(2)}</h2>
//           <div className="space-y-4">
//             <input
//               type="number"
//               placeholder="Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <textarea
//               className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <div className="space-x-2">
//               <button
//                 className={`px-4 py-2 rounded transition-colors ${
//                   type === 'income'
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleTypeChange('income')}
//               >
//                 Add Gain
//               </button>
//               <button
//                 className={`px-4 py-2 rounded transition-colors ${
//                   type === 'expense'
//                     ? 'bg-blue-500 text-white'
//                     : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
//                 }`}
//                 onClick={() => handleTypeChange('expense')}
//               >
//                 Add Spend
//               </button>
//             </div>
//             <button
//               onClick={handleSubmit}
//               className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
//             >
//               Submit
//             </button>
//           </div>
//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-2">Transaction History:</h3>
//             {transactions.map((t) => (
//               <p key={t._id}>
//                 {new Date(t.date).toLocaleString()} - {t.type === 'income' ? 'gain' : 'loss'} of ₹
//                 {t.amount} - {t.description}
//               </p>
//             ))}
//           </div>
//           <div className="mt-8">
//             <h3 className="text-xl font-semibold mb-2">Transaction Chart:</h3>
//             <Bar data={chartData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

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
        return // Return early instead of throwing
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

  if (status === 'unauthenticated') {
    return (
      <div className="p-4">
        <p className="mb-4">Please sign in to access the Balance Tracker.</p>
        <button
          onClick={() => signIn()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  if (loading) {
    return <p className="p-4">Loading...</p>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-semibold">Balance Tracker</h2>
        </div>
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <h2 className="text-2xl font-bold mb-4">Current Balance: ₹{currentBalance.toFixed(2)}</h2>
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="space-x-2">
              <button
                className={`px-4 py-2 rounded transition-colors ${
                  type === 'income'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeChange('income')}
              >
                Add Gain
              </button>
              <button
                className={`px-4 py-2 rounded transition-colors ${
                  type === 'expense'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => handleTypeChange('expense')}
              >
                Add Spend
              </button>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Submit
            </button>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Transaction History:</h3>
            {transactions.map((t) => (
              <p key={t._id} className="py-1">
                {new Date(t.date).toLocaleString()} - {t.type === 'income' ? 'gain' : 'loss'} of ₹
                {t.amount} - {t.description}
              </p>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">Transaction Chart:</h3>
            <Bar data={chartData} />
          </div>
        </div>
      </div>
    </div>
  )
}