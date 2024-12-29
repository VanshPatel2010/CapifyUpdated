import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import Budget from '@/models/Budget'
import mongoose from 'mongoose'
import { authOptions } from '../auth/[...nextauth]/auth.config'
import { Budget as BudgetType } from '@/types/budget'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    const budget = await Budget.findOne({ userId: session.user.id })
    
    if (!budget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 })
    }
    
    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error fetching budget:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const budgetData: BudgetType = await request.json()

    await mongoose.connect(process.env.MONGODB_URI!)
    const existingBudget = await Budget.findOne({ userId: session.user.id })

    if (existingBudget) {
      return NextResponse.json({ error: 'Budget already exists' }, { status: 400 })
    }

    const budget = new Budget({
      userId: session.user.id,
      totalBudget: budgetData.totalBudget,
      categories: budgetData.categories
    })
    await budget.save()

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error creating budget:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const budgetData: BudgetType = await request.json()

    await mongoose.connect(process.env.MONGODB_URI!)
    const budget = await Budget.findOneAndUpdate(
      { userId: session.user.id },
      { totalBudget: budgetData.totalBudget, categories: budgetData.categories },
      { new: true, upsert: true }
    )

    if (!budget) {
      return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
    }

    return NextResponse.json(budget)
  } catch (error) {
    console.error('Error updating budget:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

