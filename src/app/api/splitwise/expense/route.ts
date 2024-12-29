// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import mongoose from 'mongoose'
// import Expense from '@/models/Expense'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// export async function GET() {
//   const session = await getServerSession(authOptions)
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI!)
//     const expenses = await Expense.find().sort({ date: -1 })
//     return NextResponse.json(expenses)
//   } catch (error) {
//     console.error('Error fetching expenses:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//    const session = await getServerSession(authOptions)
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//   try {
//     const { description, amount, paidBy, splitAmong } = await request.json()

//     await mongoose.connect(process.env.MONGODB_URI!)
//     const expense = new Expense({
//       description,
//       amount,
//       paidBy,
//       splitAmong,
//     })
//     await expense.save()

//     return NextResponse.json(expense)
//   } catch (error) {
//     console.error('Error creating expense:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import mongoose from 'mongoose'
// import Expense from '@/models/Expense'
// import User from '@/models/User' // Your existing User model
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// export async function GET() {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI!)
//     const expenses = await Expense.find().populate('paidBy splitAmong', 'email').sort({ date: -1 })
//     return NextResponse.json(expenses)
//   } catch (error) {
//     console.error('Error fetching expenses:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const { description, amount, paidBy, splitAmong } = await request.json()

//     await mongoose.connect(process.env.MONGODB_URI!)

//     // Find or create paidBy user
//     let paidByUser = await User.findOne({ email: paidBy })
//     if (!paidByUser) {
//       return NextResponse.json({ error: 'Paid by user not found' }, { status: 400 })
//     }

//     // Find or create splitAmong users
//     const splitAmongUsers = await Promise.all(
//       splitAmong.map(async (email: string) => {
//         let user = await User.findOne({ email })
//         if (!user) {
//           return null
//         }
//         return user._id
//       })
//     )

//     // Filter out any null values (users not found)
//     const validSplitAmongUsers = splitAmongUsers.filter((id) => id !== null)

//     const expense = new Expense({
//       description,
//       amount,
//       paidBy: paidByUser._id,
//       splitAmong: validSplitAmongUsers,
//     })
//     await expense.save()

//     return NextResponse.json(expense)
//   } catch (error) {
//     console.error('Error creating expense:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// 3rd not working
// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import mongoose from 'mongoose'
// import Expense from '@/models/Expense'
// import User from '@/models/User'
// import { authOptions } from'@/app/api/auth/[...nextauth]/route'

// export async function GET() {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI!)
//     const expenses = await Expense.find()
//       .populate('paidBy', 'email')
//       .populate('splitAmong', 'email')
//       .sort({ date: -1 })

//     // Filter out any expenses with invalid data
//     const validExpenses = expenses.filter(expense => 
//       expense.paidBy && 
//       expense.splitAmong && 
//       Array.isArray(expense.splitAmong) && 
//       expense.splitAmong.length > 0
//     )

//     return NextResponse.json(validExpenses)
//   } catch (error) {
//     console.error('Error fetching expenses:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const { description, amount, paidBy, splitAmong } = await request.json()

//     await mongoose.connect(process.env.MONGODB_URI!)

//     // Find paidBy user
//     const paidByUser = await User.findOne({ email: paidBy })
//     if (!paidByUser) {
//       return NextResponse.json({ error: 'Paid by user not found' }, { status: 400 })
//     }

//     // Find splitAmong users
//     const splitAmongUsers = await User.find({ email: { $in: splitAmong } })
//     if (splitAmongUsers.length !== splitAmong.length) {
//       return NextResponse.json({ error: 'One or more split among users not found' }, { status: 400 })
//     }

//     const expense = new Expense({
//       description,
//       amount,
//       paidBy: paidByUser._id,
//       splitAmong: splitAmongUsers.map(user => user._id),
//     })
//     await expense.save()

//     const populatedExpense = await Expense.findById(expense._id)
//       .populate('paidBy', 'email')
//       .populate('splitAmong', 'email')

//     return NextResponse.json(populatedExpense)
//   } catch (error) {
//     console.error('Error creating expense:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// 2nd
// import { NextResponse } from 'next/server'
// import { getServerSession } from 'next-auth/next'
// import mongoose from 'mongoose'
// import Expense from '@/models/Expense'
// import Group from '@/models/Group'
// import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// export async function GET(request: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   const { searchParams } = new URL(request.url)
//   const groupId = searchParams.get('groupId')

//   if (!groupId) {
//     return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
//   }

//   try {
//     await mongoose.connect(process.env.MONGODB_URI!)

//     // Check if the user is a member of the group
//     const group = await Group.findOne({
//       _id: groupId,
//       members: session.user.email
//     })

//     if (!group) {
//       return NextResponse.json({ error: 'Group not found or user is not a member' }, { status: 404 })
//     }

//     const expenses = await Expense.find({ groupId })
//       .sort({ date: -1 })
//       .lean()

//     return NextResponse.json(expenses)
//   } catch (error) {
//     console.error('Error fetching expenses:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

// export async function POST(request: Request) {
//   const session = await getServerSession(authOptions)
//   if (!session?.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   try {
//     const { description, amount, paidBy, splitAmong, groupId } = await request.json()

//     await mongoose.connect(process.env.MONGODB_URI!)

//     // Check if the user is a member of the group
//     const group = await Group.findOne({
//       _id: groupId,
//       members: session.user.email
//     })

//     if (!group) {
//       return NextResponse.json({ error: 'Group not found or user is not a member' }, { status: 404 })
//     }

//     const expense = new Expense({
//       description,
//       amount,
//       paidBy,
//       splitAmong,
//       groupId,
//     })

//     await expense.save()

//     return NextResponse.json(expense)
//   } catch (error) {
//     console.error('Error creating expense:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import mongoose from 'mongoose'
import Expense from '@/models/Expense'
import Group from '@/models/Group'
import { authOptions } from '../../auth/[...nextauth]/auth.config'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const groupId = searchParams.get('groupId')

  if (!groupId) {
    return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!)

    const group = await Group.findOne({
      _id: groupId,
      members: session.user.email
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found or user is not a member' }, { status: 404 })
    }

    const expenses = await Expense.find({ groupId })
      .sort({ date: -1 })
      .lean()

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { description, amount, paidBy, splitType, splits, groupId } = await request.json()

    await mongoose.connect(process.env.MONGODB_URI!)

    const group = await Group.findOne({
      _id: groupId,
      members: session.user.email
    })

    if (!group) {
      return NextResponse.json({ error: 'Group not found or user is not a member' }, { status: 404 })
    }

    const expense = new Expense({
      description,
      amount,
      paidBy,
      splitType,
      splits,
      groupId,
    })

    await expense.save()

    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

