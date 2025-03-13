"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connectToDatabase } from "./mongodb"
import type { User } from "./types"

export async function signUp(data: { name: string; email: string; password: string }) {
  const { db } = await connectToDatabase()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: data.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // In a real app, you would hash the password here
  // const hashedPassword = await bcrypt.hash(data.password, 10)

  const result = await db.collection("users").insertOne({
    name: data.name,
    email: data.email,
    password: data.password, // In a real app, use hashedPassword
    createdAt: new Date().toISOString(),
  })

  return result
}

export async function logIn(data: { email: string; password: string }) {
  const { db } = await connectToDatabase()

  // Find user
  const user = await db.collection("users").findOne({ email: data.email })
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // In a real app, you would verify the password here
  // const passwordMatch = await bcrypt.compare(data.password, user.password)
  // if (!passwordMatch) {
  //   throw new Error("Invalid credentials")
  // }

  // For simplicity, we're just checking if passwords match directly
  if (user.password !== data.password) {
    throw new Error("Invalid credentials")
  }

  // Set session cookie
  const session = {
    userId: user._id.toString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
  }

  cookies().set("session", JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return { success: true }
}

export async function logOut() {
  cookies().delete("session")
  redirect("/login")
}

export async function getCurrentUser(): Promise<User | null> {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)

    if (new Date(session.expires) < new Date()) {
      cookies().delete("session")
      return null
    }

    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ _id: session.userId })

    if (!user) {
      return null
    }

    // Don't return the password
    const { password, ...userWithoutPassword } = user

    return userWithoutPassword as User
  } catch (error) {
    return null
  }
}

export async function updateProfile(userId: string, data: { name: string; bio?: string; image?: string }) {
  const { db } = await connectToDatabase()

  const result = await db.collection("users").updateOne(
    { _id: userId },
    {
      $set: {
        name: data.name,
        bio: data.bio,
        image: data.image,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  return result
}

