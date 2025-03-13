export interface User {
  _id: string
  name: string
  email: string
  bio?: string
  image?: string
  createdAt: string
  updatedAt?: string
}

export interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage?: string
  published: boolean
  author: {
    _id: string
    name: string
    image?: string
  }
  createdAt: string
  updatedAt?: string
}

