import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/auth.config'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const transactions = await db.collection('transactions')
    .find({ userId: new ObjectId(session.user.id) })
    .sort({ date: -1 })
    .toArray()

  return NextResponse.json({ data: transactions })
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, amount, description, date } = await request.json()

  const client = await clientPromise
  const db = client.db()

  const result = await db.collection('transactions').insertOne({
    userId: new ObjectId(session.user.id),
    type,
    amount,
    description,
    date: new Date(date),
  })

  // Update user's balance
  await db.collection('users').updateOne(
    { _id: new ObjectId(session.user.id) },
    { $inc: { balance: type === 'income' ? amount : -amount } }
  )

  return NextResponse.json({ success: true, id: result.insertedId })
}

