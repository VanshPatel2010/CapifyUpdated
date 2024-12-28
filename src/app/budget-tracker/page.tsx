
// 'use client'

// import { useState, useEffect } from 'react'
// import { useSession } from 'next-auth/react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Budget, Category, Expense } from '@/types/budget'
// import { NavBar } from '../components/NavBar'
// import { signIn } from 'next-auth/react'
// import styles from '@/styles/BudgetTracker.module.css'
// import { Trash2 } from 'lucide-react'

// export default function BudgetTracker() {
//   const { data: session, status } = useSession()
//   const [budget, setBudget] = useState<Budget | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [newCategory, setNewCategory] = useState<Omit<Category, 'expenses'>>({ name: '', allocation: 0 })
//   const [newExpense, setNewExpense] = useState<Omit<Expense, 'date'> & { categoryIndex: number }>({ categoryIndex: 0, description: '', amount: 0 })
//   const [newBudgetAmount, setNewBudgetAmount] = useState<number>(0)

//   useEffect(() => {
//     if (status === 'authenticated' && session?.user?.id) {
//       fetchBudget()
//     }
//   }, [status, session])

//   const fetchBudget = async () => {
//     try {
//       setLoading(true)
//       const res = await fetch('/api/budget')
//       if (!res.ok) {
//         if (res.status === 404) {
//           setBudget({ userId: session!.user!.id, totalBudget: 0, categories: [] })
//         } else {
//           throw new Error('Failed to fetch budget')
//         }
//       } else {
//         const data = await res.json()
//         setBudget(data)
//       }
//     } catch (error) {
//       console.error('Error fetching budget:', error)
//       setBudget({ userId: session!.user!.id, totalBudget: 0, categories: [] })
//     } finally {
//       setLoading(false)
//     }
//   }

//   //chart
  
//   const createOrUpdateBudget = async (updatedBudget: Budget) => {
//     if (!budget) return
//     try {
//       setLoading(true)
//       const method = budget._id ? 'PUT' : 'POST'
//       const res = await fetch('/api/budget', {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedBudget)
//       })
//       if (!res.ok) {
//         throw new Error('Failed to update budget')
//       }
//       const data = await res.json()
//       setBudget(data)
//     } catch (error) {
//       console.error('Error updating budget:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const addCategory = () => {
//     if (!budget) return
//     const updatedBudget: Budget = {
//       ...budget,
//       categories: [...budget.categories, { ...newCategory, expenses: [] }]
//     }
//     setBudget(updatedBudget)
//     setNewCategory({ name: '', allocation: 0 })
//     createOrUpdateBudget(updatedBudget)
//   }

//   const addExpense = () => {
//     if (!budget) return
//     const updatedBudget: Budget = {
//       ...budget,
//       categories: budget.categories.map((category, index) => {
//         if (index === newExpense.categoryIndex) {
//           return {
//             ...category,
//             expenses: [
//               ...category.expenses,
//               {
//                 description: newExpense.description,
//                 amount: newExpense.amount,
//                 date: new Date()
//               }
//             ]
//           }
//         }
//         return category
//       })
//     }
//     setBudget(updatedBudget)
//     setNewExpense({ categoryIndex: 0, description: '', amount: 0 })
//     createOrUpdateBudget(updatedBudget)
//   }

//   const deleteCategory = (indexToDelete: number) => {
//     if (!budget) return
//     const updatedBudget: Budget = {
//       ...budget,
//       categories: budget.categories.filter((_, index) => index !== indexToDelete)
//     }
//     setBudget(updatedBudget)
//     createOrUpdateBudget(updatedBudget)
//   }

//   const addBudget = () => {
//     if (!budget) return
//     const updatedBudget: Budget = {
//       ...budget,
//       totalBudget: budget.totalBudget + newBudgetAmount
//     }
//     setBudget(updatedBudget)
//     setNewBudgetAmount(0)
//     createOrUpdateBudget(updatedBudget)
//   }

//   if (status === 'unauthenticated') {
//     return (
//       <div>
//         Please sign in to access the Budget Tracker.
//         <Button onClick={() => signIn()}>Sign In</Button>
//       </div>
//     )
//   }
  
//   return (
//     <>
//       <NavBar />
//       <div className="container mx-auto p-4">
//         <h1 className="text-2xl font-bold mb-4">Budget Tracker</h1>
//         {budget && (
//           <>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Total Budget</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-xl font-semibold mb-2">Current Budget: ${budget.totalBudget}</p>
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     value={newBudgetAmount}
//                     onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
//                     placeholder="Enter amount to add"
//                     className="flex-grow"
//                   />
//                   <Button onClick={addBudget}>Add to Budget</Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="mt-4">
//               <CardHeader>
//                 <CardTitle>Add Category</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Input
//                   placeholder="Category Name"
//                   value={newCategory.name}
//                   onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
//                   className="mb-2"
//                 />
//                 <Input
//                   type="number"
//                   placeholder="Allocation"
//                   value={newCategory.allocation}
//                   onChange={(e) => setNewCategory(prev => ({ ...prev, allocation: Number(e.target.value) }))}
//                   className="mb-2"
//                 />
//                 <Button onClick={addCategory}>Add Category</Button>
//               </CardContent>
//             </Card>

//             {budget.categories.length > 0 && (
//               <Card className="mt-4">
//                 <CardHeader>
//                   <CardTitle>Add Expense</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <select
//                     value={newExpense.categoryIndex}
//                     onChange={(e) => setNewExpense(prev => ({ ...prev, categoryIndex: Number(e.target.value) }))}
//                     className="mb-2 w-full p-2 border rounded"
//                   >
//                     {budget.categories.map((category, index) => (
//                       <option key={index} value={index}>{category.name}</option>
//                     ))}
//                   </select>
//                   <Input
//                     placeholder="Description"
//                     value={newExpense.description}
//                     onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
//                     className="mb-2"
//                   />
//                   <Input
//                     type="number"
//                     placeholder="Amount"
//                     value={newExpense.amount}
//                     onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
//                     className="mb-2"
//                   />
//                   <Button onClick={addExpense}>Add Expense</Button>
//                 </CardContent>
//               </Card>
//             )}

//             {budget.categories.map((category, index) => (
//               <Card key={index} className="mt-4">
//                 <CardHeader className="flex flex-row items-center justify-between">
//                   <CardTitle>{category.name}</CardTitle>
//                   <Button
//                     variant="destructive"
//                     size="icon"
//                     onClick={() => deleteCategory(index)}
//                     className="h-8 w-8"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </CardHeader>
//                 <CardContent>
//                   <p>Allocation: ${category.allocation}</p>
//                   <p>Expenses:</p>
//                   <ul>
//                     {category.expenses.map((expense, expIndex) => (
//                       <li key={expIndex}>{expense.description}: ${expense.amount}</li>
//                     ))}
//                   </ul>
//                 </CardContent>
//               </Card>
//             ))}
//           </>
//         )}
//       </div>
//     </>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Budget, Category, Expense } from '@/types/budget'
import { NavBar } from '../components/NavBar'
import { signIn } from 'next-auth/react'
import { Trash2, Plus, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BudgetTracker() {
  const { data: session, status } = useSession()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState<Omit<Category, 'expenses'>>({ name: '', allocation: 0 })
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'date'> & { categoryIndex: number }>({ categoryIndex: 0, description: '', amount: 0 })
  const [newBudgetAmount, setNewBudgetAmount] = useState<number>(0)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchBudget()
    }
  }, [status, session])

  const fetchBudget = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/budget')
      if (!res.ok) {
        if (res.status === 404) {
          setBudget({ userId: session!.user!.id, totalBudget: 0, categories: [] })
        } else {
          throw new Error('Failed to fetch budget')
        }
      } else {
        const data = await res.json()
        setBudget(data)
      }
    } catch (error) {
      console.error('Error fetching budget:', error)
      setBudget({ userId: session!.user!.id, totalBudget: 0, categories: [] })
    } finally {
      setLoading(false)
    }
  }

  const createOrUpdateBudget = async (updatedBudget: Budget) => {
    if (!budget) return
    try {
      setLoading(true)
      const method = budget._id ? 'PUT' : 'POST'
      const res = await fetch('/api/budget', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBudget)
      })
      if (!res.ok) {
        throw new Error('Failed to update budget')
      }
      const data = await res.json()
      setBudget(data)
    } catch (error) {
      console.error('Error updating budget:', error)
    } finally {
      setLoading(false)
    }
  }

  // const addCategory = () => {
  //   if (!budget) return
  //   const updatedBudget: Budget = {
  //     ...budget,
  //     categories: [...budget.categories, { ...newCategory, expenses: [] }]
  //   }
  //   setBudget(updatedBudget)
  //   setNewCategory({ name: '', allocation: 0 })
  //   createOrUpdateBudget(updatedBudget)
  // }

  const addCategory = () => {
    if (!budget) return;
  
    // Calculate total allocated budget
    const totalAllocatedBudget = budget.categories.reduce((sum, category) => sum + category.allocation, 0) + newCategory.allocation;
  
    if (totalAllocatedBudget > budget.totalBudget) {
      alert("Total allocation exceeds the total budget. Adjust allocations.");
      return;
    }
  
    const updatedBudget: Budget = {
      ...budget,
      categories: [...budget.categories, { ...newCategory, expenses: [] }],
    };
    setBudget(updatedBudget);
    setNewCategory({ name: '', allocation: 0 });
    createOrUpdateBudget(updatedBudget);
  };

  // const addExpense = () => {
  //   if (!budget) return
  //   const updatedBudget: Budget = {
  //     ...budget,
  //     categories: budget.categories.map((category, index) => {
  //       if (index === newExpense.categoryIndex) {
  //         return {
  //           ...category,
  //           expenses: [
  //             ...category.expenses,
  //             {
  //               description: newExpense.description,
  //               amount: newExpense.amount,
  //               date: new Date()
  //             }
  //           ]
  //         }
  //       }
  //       return category
  //     })
  //   }
  //   setBudget(updatedBudget)
  //   setNewExpense({ categoryIndex: 0, description: '', amount: 0 })
  //   createOrUpdateBudget(updatedBudget)
  // }

  const addExpense = () => {
    if (!budget) return;
  
    const targetCategory = budget.categories[newExpense.categoryIndex];
    const totalExpenses = targetCategory.expenses.reduce((sum, expense) => sum + expense.amount, 0) + newExpense.amount;
  
    if (totalExpenses > targetCategory.allocation) {
      alert(`Expenses exceed the allocated budget for category "${targetCategory.name}".`);
      return;
    }
  
    const updatedBudget: Budget = {
      ...budget,
      categories: budget.categories.map((category, index) => {
        if (index === newExpense.categoryIndex) {
          return {
            ...category,
            expenses: [
              ...category.expenses,
              {
                description: newExpense.description,
                amount: newExpense.amount,
                date: new Date(),
              },
            ],
          };
        }
        return category;
      }),
    };
    setBudget(updatedBudget);
    setNewExpense({ categoryIndex: 0, description: '', amount: 0 });
    createOrUpdateBudget(updatedBudget);
  };

  const deleteCategory = (indexToDelete: number) => {
    if (!budget) return
    const updatedBudget: Budget = {
      ...budget,
      categories: budget.categories.filter((_, index) => index !== indexToDelete)
    }
    setBudget(updatedBudget)
    createOrUpdateBudget(updatedBudget)
  }

  const addBudget = () => {
    if (!budget) return
    const updatedBudget: Budget = {
      ...budget,
      totalBudget: budget.totalBudget + newBudgetAmount
    }
    setBudget(updatedBudget)
    setNewBudgetAmount(0)
    createOrUpdateBudget(updatedBudget)
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Card className="w-96 p-6 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to access the Budget Tracker.</p>
            <Button onClick={() => signIn()} className="w-full">Sign In</Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <NavBar />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center text-blue-600">Budget Tracker</h1>
        {budget && (
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-500 text-white">
                <CardTitle className="text-2xl">Total Budget</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-semibold mb-4">Current Budget: ${budget.totalBudget.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                    placeholder="Enter amount to add"
                    className="flex-grow"
                  />
                  <Button onClick={addBudget} className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add to Budget
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-purple-500 text-white">
                  <CardTitle>Add Category</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Input
                    placeholder="Category Name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                    className="mb-2"
                  />
                  <Input
                    type="number"
                    placeholder="Allocation"
                    value={newCategory.allocation}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, allocation: Number(e.target.value) }))}
                    className="mb-2"
                  />
                  <Button onClick={addCategory} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                  </Button>
                </CardContent>
              </Card>

              {budget.categories.length > 0 && (
                <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="bg-orange-500 text-white">
                    <CardTitle>Add Expense</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <select
                      value={newExpense.categoryIndex}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, categoryIndex: Number(e.target.value) }))}
                      className="mb-2 w-full p-2 border rounded"
                    >
                      {budget.categories.map((category, index) => (
                        <option key={index} value={index}>{category.name}</option>
                      ))}
                    </select>
                    <Input
                      placeholder="Description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                      className="mb-2"
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      className="mb-2"
                    />
                    <Button onClick={addExpense} className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      <DollarSign className="mr-2 h-4 w-4" /> Add Expense
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {budget.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="bg-indigo-500 text-white flex flex-row items-center justify-between">
                      <CardTitle>{category.name}</CardTitle>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteCategory(index)}
                        className="h-8 w-8 bg-red-500 hover:bg-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="text-lg font-semibold mb-2">Allocation: ${category.allocation.toFixed(2)}</p>
                      <p className="font-medium mb-2">Expenses:</p>
                      <ul className="space-y-1">
                        {category.expenses.map((expense, expIndex) => (
                          <li key={expIndex} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                            <span>{expense.description}</span>
                            <span className="font-semibold">${expense.amount.toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

