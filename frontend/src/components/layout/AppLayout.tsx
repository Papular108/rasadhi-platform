import type { ReactNode } from "react"

import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        {/*
          No width clamp here: pages set their own max width. The Explorer
          report needs max-w-6xl for its two-column layout, wider than the
          prose pages want. Each page centers its own content (Explorer via
          mx-auto max-w-6xl, others via `container mx-auto`).
        */}
        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
