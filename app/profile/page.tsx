import type { Metadata } from "next"

import ProfileForm from "@/components/profile/profile-form"
import { getCurrentUser } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile",
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Profile</h1>
        <ProfileForm user={user} />
      </div>
    </div>
  )
}

