import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]/auth.config'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const client = await clientPromise
  const db = client.db()

  const balances = await db.collection('splitwise_balances')
    .find({ $or: [{ user1: session.user.email }, { user2: session.user.email }] })
    .toArray()

  const formattedBalances = balances.map(balance => {
    if (balance.user1 === session.user.email) {
      return { user: balance.user2, amount: balance.amount }
    } else {
      return { user: balance.user1, amount: -balance.amount }
    }
  })

  return NextResponse.json({ balances: formattedBalances })
}

