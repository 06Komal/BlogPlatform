"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { updateProfile } from "@/lib/auth"
import type { User } from "@/lib/types"

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
})

type ProfileValues = z.infer<typeof profileSchema>

interface ProfileFormProps {
  user: User | null
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      image: user?.image || "",
    },
  })

  async function onSubmit(data: ProfileValues) {
    if (!user) return

    setIsLoading(true)

    try {
      await updateProfile(user._id, data)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
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
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="grid gap-2">
          <Label htmlFor="image">Profile Picture URL</Label>
          <Input id="image" placeholder="https://example.com/avatar.jpg" {...register("image")} />
          {errors?.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
        </div>
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="John Doe" {...register("name")} />
          {errors?.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="john@example.com" type="email" disabled {...register("email")} />
          <p className="text-sm text-muted-foreground">Email cannot be changed</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" {...register("bio")} rows={4} />
        </div>
      </div>

      <Button disabled={isLoading} type="submit">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Profile
      </Button>
    </form>
  )
}

