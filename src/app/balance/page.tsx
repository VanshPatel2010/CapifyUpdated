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
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
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
//   }, [status,session])

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
//       // Optionally reset state if errors occur
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
//     return (<div>Please sign in to access the Balance Tracker.
//        <Button onClick={() => signIn()}>Sign In</Button>
//     </div>
//                      )
//   }

//   if (loading) {
//     return <p>Loading...</p>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Balance Tracker</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <h2 className="text-2xl font-bold mb-4">Current Balance: ₹{currentBalance.toFixed(2)}</h2>
//           <div className="space-y-4">
//             <Input
//               type="number"
//               placeholder="Amount"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//             />
//             <textarea
//               className="w-full p-2 border rounded"
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//             <div className="space-x-2">
//               <Button
//                 variant={type === 'income' ? 'default' : 'outline'}
//                 onClick={() => handleTypeChange('income')}
//               >
//                 Add Gain
//               </Button>
//               <Button
//                 variant={type === 'expense' ? 'default' : 'outline'}
//                 onClick={() => handleTypeChange('expense')}
//               >
//                 Add Spend
//               </Button>
//             </div>
//             <Button onClick={handleSubmit}>Submit</Button>
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
//         </CardContent>
//       </Card>
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

export default function BalanceTracker() {
  const { data: session, status } = useSession()
  const [currentBalance, setCurrentBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [amount, setAmount] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [loading, setLoading] = useState<boolean>(true)
  

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchBalances()
    }
  }, [status, session])

  const fetchBalances = async () => {
    try {
      setLoading(true);
      
      const balanceResponse = await fetch('/api/balanceTracker');
      const currentBalanceResponse = await fetch('/api/balanceTracker/current');
  
      if (!balanceResponse.ok || !currentBalanceResponse.ok) {
        throw new Error('Failed to fetch balances');
      }
  
      const balanceData = await balanceResponse.json();
      const currentBalanceData = await currentBalanceResponse.json();
  
      setTransactions(balanceData.data || []);
      setCurrentBalance(currentBalanceData.balance || 0);
    } catch (error) {
      console.error('Error fetching balances:', error);
      setTransactions([]);
      setCurrentBalance(0);
    } finally {
      setLoading(false);
    }
  };
  

  const handleTypeChange = (selectedType: 'income' | 'expense') => {
    setType(selectedType)
  }

  const handleSubmit = async () => {
    try {
      await fetch('/api/balanceTracker', {
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
      fetchBalances()
      setAmount('')
      setDescription('')
    } catch (error) {
      console.error('Error adding balance:', error)
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
    console.log(session)
    return (
      <div>
        Please sign in to access the Balance Tracker.
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
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 bg-gray-50 border-b">
          <h2 className="text-2xl font-semibold">Balance Tracker</h2>
        </div>
        <div className="p-6">
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
              <p key={t._id}>
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