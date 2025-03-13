import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post } from "@/lib/types"

interface FeaturedPostsProps {
  posts: Post[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Link key={post._id} href={`/posts/${post.slug}`} className="group">
          <Card className="overflow-hidden h-full transition-all hover:shadow-md">
            <div className="aspect-video relative overflow-hidden">
              <Image
                src={post.coverImage || "/placeholder.svg?height=400&width=600"}
                alt={post.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <CardHeader className="p-4">
              <div className="space-y-2">
                <h3 className="font-bold text-xl transition-colors group-hover:text-primary">{post.title}</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="p-4 flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={post.author.image} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{post.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

