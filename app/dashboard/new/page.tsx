import type { Metadata } from "next"

import PostEditor from "@/components/dashboard/post-editor"

export const metadata: Metadata = {
  title: "Create Post",
  description: "Create a new blog post",
}

export default function NewPostPage() {
  return (
    <div className="container py-10">
      <PostEditor />
    </div>
  )
}

