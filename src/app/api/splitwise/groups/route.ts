import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import mongoose from 'mongoose'
import Group from '@/models/Group'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    const groups = await Group.find({
      members: session.user.email
    }).sort({ createdAt: -1 })
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, members } = await request.json()
    
    await mongoose.connect(process.env.MONGODB_URI!)
    
    const group = new Group({
      name,
      members: [...new Set([...members, session.user.email])], // Ensure unique members
      createdBy: session.user.email,
    })
    
    await group.save()
    return NextResponse.json(group)
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

