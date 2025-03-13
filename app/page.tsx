import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "components/ui/button";
import FeaturedPosts from "components/featured-posts";
import { getLatestPosts } from "lib/posts";

export default async function Home() {
  const posts = await getLatestPosts(3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Share Your Ideas With The World
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Create, publish, and grow your audience with our modern blogging platform. Start writing today and let
                your voice be heard.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/posts">
                <Button variant="outline" size="lg">
                  Explore Posts
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="w-full py-12 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Posts</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground">
                Discover the latest and most engaging content from our community of writers.
              </p>
            </div>
          </div>
          <FeaturedPosts posts={posts} />
          <div className="flex justify-center mt-8">
            <Link href="/posts">
              <Button variant="outline">View All Posts</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary p-3 text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Secure Authentication</h3>
              <p className="text-muted-foreground">
                Create your account with our secure authentication system. Sign up, log in, and manage your profile with
                ease.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary p-3 text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Rich Text Editor</h3>
              <p className="text-muted-foreground">
                Write and format your posts with our powerful rich text editor. Create, edit, and delete your content
                with full control.
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary p-3 text-primary-foreground">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="10" r="3" />
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Customizable Profiles</h3>
              <p className="text-muted-foreground">
                Personalize your author profile with a bio and profile picture. Let readers know who you are and what
                you write about.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
