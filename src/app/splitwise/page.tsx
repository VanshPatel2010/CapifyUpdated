// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { IExpense } from '@/models/Expense';

// interface Expense extends IExpense {
//   _id: string;
// }

// export default function SplitwisePage() {
//   const [expenses, setExpenses] = useState<IExpense[]>([])
//   const [description, setDescription] = useState('')
//   const [amount, setAmount] = useState('')
//   const [paidBy, setPaidBy] = useState('')
//   const [splitAmong, setSplitAmong] = useState('')

//   useEffect(() => {
//     fetchExpenses()
//   }, [])

//   const fetchExpenses = async () => {
//     const response = await fetch('/api/splitwise/expense')
//     const data = await response.json()
//     setExpenses(data)
//   }

//   const addExpense = async () => {
//     if (description && amount && paidBy && splitAmong) {
//       const response = await fetch('/api/splitwise/expense', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           description,
//           amount: parseFloat(amount),
//           paidBy,
//           splitAmong: splitAmong.split(',').map(name => name.trim()),
//         }),
//       })

//       if (response.ok) {
//         setDescription('')
//         setAmount('')
//         setPaidBy('')
//         setSplitAmong('')
//         fetchExpenses()
//       }
//     }
//   }

//   const calculateSplits = () => {
//     const balances: { [key: string]: number } = {}

//     expenses.forEach(expense => {
//       const splitAmount = expense.amount / expense.splitAmong.length

//       if (!balances[expense.paidBy]) {
//         balances[expense.paidBy] = 0
//       }
//       balances[expense.paidBy] += expense.amount

//       expense.splitAmong.forEach(person => {
//         if (!balances[person]) {
//           balances[person] = 0
//         }
//         balances[person] -= splitAmount
//       })
//     })

//     return balances
//   }

//   const balances = calculateSplits()

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Splitwise</h1>
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Split Expense</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Enter description"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="paidBy">Paid By</Label>
//                 <Input
//                   id="paidBy"
//                   value={paidBy}
//                   onChange={(e) => setPaidBy(e.target.value)}
//                   placeholder="Enter name of person who paid"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="splitAmong">Split Among (comma-separated)</Label>
//                 <Input
//                   id="splitAmong"
//                   value={splitAmong}
//                   onChange={(e) => setSplitAmong(e.target.value)}
//                   placeholder="Enter names, separated by commas"
//                 />
//               </div>
//               <Button onClick={addExpense}>Add Split Expense</Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Split Expenses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {expenses.map((expense) => (
//                 <li key={expense._id} className="flex justify-between items-center">
//                   <span>{expense.description}</span>
//                   <span>${expense.amount.toFixed(2)} (Paid by {expense.paidBy})</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Balances</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {Object.entries(balances).map(([person, balance]) => (
//                 <li key={person} className="flex justify-between items-center">
//                   <span>{person}</span>
//                   <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
//                     {balance >= 0 ? 'Owed ' : 'Owes '}${Math.abs(balance).toFixed(2)}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// 'use client'

// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'

// interface User {
//   _id: string;
//   email: string;
// }

// interface Expense {
//   _id: string;
//   description: string;
//   amount: number;
//   paidBy: User;
//   splitAmong: User[];
//   date: string;
// }

// export default function SplitwisePage() {
//   const { data: session, status } = useSession()
//   const [expenses, setExpenses] = useState<Expense[]>([])
//   const [description, setDescription] = useState('')
//   const [amount, setAmount] = useState('')
//   const [paidBy, setPaidBy] = useState('')
//   const [splitAmong, setSplitAmong] = useState('')
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (status === 'authenticated') {
//       fetchExpenses()
//     }
//   }, [status])

//   const fetchExpenses = async () => {
//     try {
//       const response = await fetch('/api/splitwise/expense')
//       if (!response.ok) {
//         throw new Error('Failed to fetch expenses')
//       }
//       const data = await response.json()
//       setExpenses(data)
//     } catch (error) {
//       console.error('Error fetching expenses:', error)
//       setError('Failed to fetch expenses. Please try again.')
//     }
//   }

//   const addExpense = async () => {
//     if (description && amount && paidBy && splitAmong) {
//       try {
//         const response = await fetch('/api/splitwise/expense', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             description,
//             amount: parseFloat(amount),
//             paidBy,
//             splitAmong: splitAmong.split(',').map(email => email.trim()),
//           }),
//         })

//         if (!response.ok) {
//           const errorData = await response.json()
//           throw new Error(errorData.error || 'An error occurred while adding the expense')
//         }

//         setDescription('')
//         setAmount('')
//         setPaidBy('')
//         setSplitAmong('')
//         setError(null)
//         fetchExpenses()
//       } catch (error) {
//         console.error('Error adding expense:', error)
//         setError(error instanceof Error ? error.message : 'An error occurred while adding the expense')
//       }
//     }
//   }

//   const calculateSplits = () => {
//     const balances: { [key: string]: number } = {}

//     expenses.forEach(expense => {
//       if (!expense.splitAmong || !Array.isArray(expense.splitAmong) || expense.splitAmong.length === 0) {
//         console.error('Invalid splitAmong data for expense:', expense)
//         return
//       }

//       const splitAmount = expense.amount / expense.splitAmong.length

//       if (!expense.paidBy || !expense.paidBy.email) {
//         console.error('Invalid paidBy data for expense:', expense)
//         return
//       }

//       if (!balances[expense.paidBy.email]) {
//         balances[expense.paidBy.email] = 0
//       }
//       balances[expense.paidBy.email] += expense.amount

//       expense.splitAmong.forEach(person => {
//         if (!person || !person.email) {
//           console.error('Invalid person data in splitAmong:', person)
//           return
//         }

//         if (!balances[person.email]) {
//           balances[person.email] = 0
//         }
//         balances[person.email] -= splitAmount
//       })
//     })

//     return balances
//   }

//   const balances = calculateSplits()

//   if (status === 'loading') {
//     return <div>Loading...</div>
//   }

//   if (status === 'unauthenticated') {
//     return <div>Please sign in to access Splitwise</div>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Splitwise</h1>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Split Expense</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Enter description"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="paidBy">Paid By (email)</Label>
//                 <Input
//                   id="paidBy"
//                   type="email"
//                   value={paidBy}
//                   onChange={(e) => setPaidBy(e.target.value)}
//                   placeholder="Enter email of person who paid"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="splitAmong">Split Among (comma-separated emails)</Label>
//                 <Input
//                   id="splitAmong"
//                   value={splitAmong}
//                   onChange={(e) => setSplitAmong(e.target.value)}
//                   placeholder="Enter emails, separated by commas"
//                 />
//               </div>
//               <Button onClick={addExpense}>Add Split Expense</Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Split Expenses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {expenses.map((expense) => (
//                 <li key={expense._id} className="flex justify-between items-center">
//                   <span>{expense.description}</span>
//                   <span>${expense.amount.toFixed(2)} (Paid by {expense.paidBy?.email || 'Unknown'})</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Balances</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {Object.entries(balances).map(([person, balance]) => (
//                 <li key={person} className="flex justify-between items-center">
//                   <span>{person}</span>
//                   <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
//                     {balance >= 0 ? 'Owed ' : 'Owes '}${Math.abs(balance).toFixed(2)}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

// 2nd
// 'use client'

// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'

// interface User {
//   _id: string;
//   email: string;
// }

// interface Expense {
//   _id: string;
//   description: string;
//   amount: number;
//   paidBy: User;
//   splitAmong: User[];
//   date: string;
// }

// export default function SplitwisePage() {
//   const { data: session, status } = useSession()
//   const [expenses, setExpenses] = useState<Expense[]>([])
//   const [description, setDescription] = useState('')
//   const [amount, setAmount] = useState('')
//   const [paidBy, setPaidBy] = useState('')
//   const [splitAmong, setSplitAmong] = useState('')
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (status === 'authenticated') {
//       fetchExpenses()
//     }
//   }, [status])

//   const fetchExpenses = async () => {
//     try {
//       const response = await fetch('/api/splitwise/expense')
//       if (!response.ok) {
//         throw new Error('Failed to fetch expenses')
//       }
//       const data = await response.json()
//       setExpenses(data)
//     } catch (error) {
//       console.error('Error fetching expenses:', error)
//       setError('Failed to fetch expenses. Please try again.')
//     }
//   }

//   const addExpense = async () => {
//     if (description && amount && paidBy && splitAmong) {
//       try {
//         const response = await fetch('/api/splitwise/expense', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             description,
//             amount: parseFloat(amount),
//             paidBy,
//             splitAmong: splitAmong.split(',').map(email => email.trim()),
//           }),
//         })

//         if (!response.ok) {
//           const errorData = await response.json()
//           throw new Error(errorData.error || 'An error occurred while adding the expense')
//         }

//         setDescription('')
//         setAmount('')
//         setPaidBy('')
//         setSplitAmong('')
//         setError(null)
//         fetchExpenses()
//       } catch (error) {
//         console.error('Error adding expense:', error)
//         setError(error instanceof Error ? error.message : 'An error occurred while adding the expense')
//       }
//     }
//   }

//   const calculateSplits = () => {
//     const balances: { [key: string]: number } = {}

//     expenses.forEach(expense => {
//       if (!expense.paidBy || !expense.paidBy.email || !expense.splitAmong || !Array.isArray(expense.splitAmong) || expense.splitAmong.length === 0) {
//         console.error('Invalid expense data:', expense)
//         return
//       }

//       const splitAmount = expense.amount / expense.splitAmong.length

//       if (!balances[expense.paidBy.email]) {
//         balances[expense.paidBy.email] = 0
//       }
//       balances[expense.paidBy.email] += expense.amount

//       expense.splitAmong.forEach(person => {
//         if (!person || !person.email) {
//           console.error('Invalid person data in splitAmong:', person)
//           return
//         }

//         if (!balances[person.email]) {
//           balances[person.email] = 0
//         }
//         balances[person.email] -= splitAmount
//       })
//     })

//     return balances
//   }

//   const balances = calculateSplits()

//   if (status === 'loading') {
//     return <div>Loading...</div>
//   }

//   if (status === 'unauthenticated') {
//     return <div>Please sign in to access Splitwise</div>
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Splitwise</h1>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
//           <strong className="font-bold">Error: </strong>
//           <span className="block sm:inline">{error}</span>
//         </div>
//       )}
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Add Split Expense</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div>
//                 <Label htmlFor="description">Description</Label>
//                 <Input
//                   id="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   placeholder="Enter description"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="Enter amount"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="paidBy">Paid By (email)</Label>
//                 <Input
//                   id="paidBy"
//                   type="email"
//                   value={paidBy}
//                   onChange={(e) => setPaidBy(e.target.value)}
//                   placeholder="Enter email of person who paid"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="splitAmong">Split Among (comma-separated emails)</Label>
//                 <Input
//                   id="splitAmong"
//                   value={splitAmong}
//                   onChange={(e) => setSplitAmong(e.target.value)}
//                   placeholder="Enter emails, separated by commas"
//                 />
//               </div>
//               <Button onClick={addExpense}>Add Split Expense</Button>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Split Expenses</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {expenses.map((expense) => (
//                 <li key={expense._id} className="flex justify-between items-center">
//                   <span>{expense.description}</span>
//                   <span>${expense.amount.toFixed(2)} (Paid by {expense.paidBy?.email || 'Unknown'})</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Balances</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {Object.entries(balances).map(([person, balance]) => (
//                 <li key={person} className="flex justify-between items-center">
//                   <span>{person}</span>
//                   <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
//                     {balance >= 0 ? 'Owed ' : 'Owes '}${Math.abs(balance).toFixed(2)}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

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
  }, [status])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/splitwise/groups')
      if (!response.ok) throw new Error('Failed to fetch groups')
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      setError('Failed to fetch groups')
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

