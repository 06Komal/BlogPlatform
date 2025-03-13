import type { Metadata } from "next"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import PostsList from "@/components/dashboard/posts-list"
import { getUserPosts } from "@/lib/posts"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your blog posts",
}

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const posts = await getUserPosts(user?._id)

  return (
    <div className="container py-10">
      <DashboardHeader heading="Dashboard" text="Create and manage your blog posts.">
        <Link href="/dashboard/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </DashboardHeader>
      <div className="grid gap-10">
        <PostsList posts={posts} />
      </div>
    </div>
  )
}

