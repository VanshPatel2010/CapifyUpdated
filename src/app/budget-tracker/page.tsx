
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { signIn } from 'next-auth/react'
import { Trash2, Plus} from 'lucide-react'
import { motion } from 'framer-motion'
import { Budget, Category, Expense } from '@/types/budget';
import { useCallback } from 'react';


export default function BudgetTracker() {
  const { data: session, status } = useSession()
  const [budget, setBudget] = useState<Budget | null>(null)
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState<Omit<Category, 'expenses'>>({ name: '', allocation: 0 })
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'date'> & { categoryIndex: number }>({ categoryIndex: 0, description: '', amount: 0 })
  const [newBudgetAmount, setNewBudgetAmount] = useState<number>(0)

  const fetchBudget = useCallback(async () => {
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
  }, [session])

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchBudget()
    }
  }, [status, session, fetchBudget])

  

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

  const addCategory = () => {
  if (!budget) return;

  // Validate if category name is empty
  if (!newCategory.name.trim()) {
    alert("Category name cannot be empty");
    return;
  }

  // Check if category already exists (case-insensitive)
  const categoryExists = budget.categories.some(
    category => category.name.toLowerCase() === newCategory.name.trim().toLowerCase()
  );

  if (categoryExists) {
    alert("This category already exists. Please use a different name.");
    return;
  }

  // Calculate total allocated budget
  const totalAllocatedBudget = budget.categories.reduce(
    (sum, category) => sum + category.allocation, 
    0
  ) + newCategory.allocation;

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
        <div className="w-96 p-6 text-center bg-white rounded-lg shadow-lg">
          <div className="bg-gray-800 text-white p-4">
            <h2 className="text-2xl font-bold">Access Denied</h2>
          </div>
          <div className="p-4">
            <p className="mb-4">Please sign in to access the Budget Tracker.</p>
            <button onClick={() => signIn()} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In</button>
          </div>
        </div>
      </div>
    )
  }
  
  if (loading) return <div>Loading...</div>;


  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000000', color: 'white' }}>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3.75rem', fontWeight: 'bold', marginBottom: '1rem' }}>Budget Bliss</h1>
          <p style={{ fontSize: '1.125rem', color: '#a0aec0' }}>
            Track your expenses seamlessly with our{" "}
            <span style={{ color: 'white' }}>Budget Tracker</span>.
          </p>
        </div>
  
        {budget && (
          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            {/* Set Budget Section */}
            <div style={{ backgroundColor: '#1a202c', borderRadius: '0.5rem', border: '1px solid #2d3748', padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Set Your Budget</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#a0aec0', marginBottom: '0.5rem' }}>Total Budget:</label>
                <input
                  type="number"
                  value={budget.totalBudget}
                  onChange={(e) => setBudget({ ...budget, totalBudget: Number(e.target.value) })}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                />
                <button
                  onClick={() => createOrUpdateBudget(budget)}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
                >
                  Set Budget
                </button>
              </div>
            </div>
  
            {/* Increase Budget Section */}
            <div style={{ backgroundColor: '#1a202c', borderRadius: '0.5rem', border: '1px solid #2d3748', padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Increase Your Budget</h2>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', color: '#a0aec0', marginBottom: '0.5rem' }}>Additional Amount:</label>
                <input
                  type="number"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                />
                <button
                  onClick={addBudget}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} />
                  Increase Budget
                </button>
              </div>
            </div>
  
            {/* Add Category Section */}
            <div style={{ backgroundColor: '#1a202c', borderRadius: '0.5rem', border: '1px solid #2d3748', padding: '1.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Category</h2>
              <div>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                />
                <input
                  type="number"
                  placeholder="Allocation"
                  value={newCategory.allocation}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, allocation: Number(e.target.value) }))}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                />
                <button
                  onClick={addCategory}
                  style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} />
                  Add Category
                </button>
              </div>
            </div>
  
            {/* Add Expense Section */}
            {budget.categories.length > 0 && (
              <div style={{ backgroundColor: '#1a202c', borderRadius: '0.5rem', border: '1px solid #2d3748', padding: '1.5rem', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Expense</h2>
                <div>
                  <select
                    value={newExpense.categoryIndex}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, categoryIndex: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                  >
                    {budget.categories.map((category, index) => (
                      <option key={index} value={index}>{category.name}</option>
                    ))}
                  </select>
                  <input
                    placeholder="Description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', border: '1px solid #4a5568', borderRadius: '0.375rem', color: 'white', marginBottom: '0.5rem' }}
                  />
                  <button
                    onClick={addExpense}
                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2d3748', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {/* <DollarSign style={{ marginRight: '0.5rem', height: '1rem', width: '1rem' }} /> */}
                    Add Expense
                  </button>
                </div>
              </div>
            )}
  
            {/* Categories Grid */}
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
              {budget.categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div style={{ backgroundColor: '#1a202c', borderRadius: '0.5rem', border: '1px solid #2d3748', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2d3748' }}>
                      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{category.name}</h2>
                      <button
                        onClick={() => deleteCategory(index)}
                        style={{ padding: '0.25rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 style={{ height: '1rem', width: '1rem' }} />
                      </button>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Allocation: ₹{category.allocation.toFixed(2)}
                      </p>
                      {category.expenses.length > 0 && (
                        <>
                          <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Expenses:</p>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {category.expenses.map((expense, expIndex) => (
                              <li
                                key={expIndex}
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  backgroundColor: '#2d3748',
                                  padding: '0.75rem',
                                  borderRadius: '0.375rem',
                                  marginBottom: '0.5rem'
                                }}
                              >
                                <span>{expense.description}</span>
                                <span style={{ fontWeight: '600' }}>₹{expense.amount.toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
  
  
}

