"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "./mongodb"
import { getCurrentUser } from "./auth"
import type { Post } from "./types"

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

export async function getLatestPosts(limit = 6): Promise<Post[]> {
  const { db } = await connectToDatabase()

  const posts = await db.collection("posts").find({ published: true }).sort({ createdAt: -1 }).limit(limit).toArray()

  return posts as Post[]
}

export async function getUserPosts(userId?: string): Promise<Post[]> {
  if (!userId) return []

  const { db } = await connectToDatabase()

  const posts = await db.collection("posts").find({ "author._id": userId }).sort({ createdAt: -1 }).toArray()

  return posts as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { db } = await connectToDatabase()

  const post = await db.collection("posts").findOne({ slug })

  return post as Post | null
}

export async function createPost(data: {
  title: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  const slug = slugify(data.title)

  const result = await db.collection("posts").insertOne({
    title: data.title,
    slug,
    excerpt: data.excerpt,
    content: data.content,
    coverImage: data.coverImage || "",
    published: data.published,
    author: {
      _id: user._id,
      name: user.name,
      image: user.image || "",
    },
    createdAt: new Date().toISOString(),
  })

  revalidatePath("/dashboard")
  revalidatePath("/posts")

  return result
}

export async function updatePost(
  postId: string,
  data: {
    title: string
    excerpt: string
    content: string
    coverImage?: string
    published: boolean
  },
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  // Check if post exists and belongs to user
  const post = await db.collection("posts").findOne({ _id: postId, "author._id": user._id })

  if (!post) {
    throw new Error("Post not found or unauthorized")
  }

  const slug = slugify(data.title)

  const result = await db.collection("posts").updateOne(
    { _id: postId },
    {
      $set: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || "",
        published: data.published,
        updatedAt: new Date().toISOString(),
      },
    },
  )

  revalidatePath("/dashboard")
  revalidatePath(`/posts/${slug}`)

  return result
}

export async function deletePost(postId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { db } = await connectToDatabase()

  // Check if post exists and belongs to user
  const post = await db.collection("posts").findOne({ _id: postId, "author._id": user._id })

  if (!post) {
    throw new Error("Post not found or unauthorized")
  }

  const result = await db.collection("posts").deleteOne({ _id: postId })

  revalidatePath("/dashboard")
  revalidatePath("/posts")

  return result
}

