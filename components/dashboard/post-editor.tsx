"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { createPost, updatePost } from "@/lib/posts"
import RichTextEditor from "./rich-text-editor"
import type { Post } from "@/lib/types"

const postSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
  excerpt: z.string().min(1, {
    message: "Excerpt is required.",
  }),
  content: z.string().min(1, {
    message: "Content is required.",
  }),
  coverImage: z.string().optional(),
  published: z.boolean().default(false),
})

type PostValues = z.infer<typeof postSchema>

interface PostEditorProps {
  post?: Post
}

export default function PostEditor({ post }: PostEditorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      coverImage: post?.coverImage || "",
      published: post?.published || false,
    },
  })

  const watchContent = watch("content")

  function handleEditorChange(value: string) {
    setValue("content", value, { shouldValidate: true })
  }

  async function onSubmit(data: PostValues) {
    setIsLoading(true)

    try {
      if (post) {
        await updatePost(post._id, data)
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully.",
        })
      } else {
        await createPost(data)
        toast({
          title: "Post created",
          description: "Your post has been created successfully.",
        })
      }
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{post ? "Edit Post" : "Create Post"}</h1>
        <Button disabled={isLoading} type="submit">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="My Awesome Blog Post" {...register("title")} />
          {errors?.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" placeholder="Brief summary of your post" {...register("excerpt")} />
          {errors?.excerpt && <p className="text-sm text-red-500">{errors.excerpt.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="coverImage">Cover Image URL</Label>
          <Input id="coverImage" placeholder="https://example.com/image.jpg" {...register("coverImage")} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor value={watchContent} onChange={handleEditorChange} />
          {errors?.content && <p className="text-sm text-red-500">{errors.content.message}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="published" {...register("published")} defaultChecked={post?.published || false} />
          <Label htmlFor="published">Publish post</Label>
        </div>
      </div>
    </form>
  )
}

