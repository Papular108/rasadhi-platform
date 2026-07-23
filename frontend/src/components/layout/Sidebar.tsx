import { NavLink } from "react-router-dom"

import { NAV_GROUPS } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export function Sidebar() {
  return (
    <nav className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex">
      <div className="flex flex-col gap-6 p-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <h2 className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </h2>
            {group.items.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.description}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* Phase 2: active dataset banner and workflow stepper mount here */}
    </nav>
  )
}

export default Sidebar
