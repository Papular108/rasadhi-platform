import { Link } from "react-router-dom"
// lucide-react no longer ships a `Github` brand icon; Code2 stands in for
// the "view source" repo link (see Session 1.3 report).
import { Code2 } from "lucide-react"

const REPO_URL = "https://github.com/Papular108/rasadhi-platform"

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-background px-4">
      <Link
        to="/"
        className="text-lg font-medium tracking-tight text-foreground"
      >
        Rasadhi
      </Link>
      <a
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <Code2 className="h-5 w-5" />
      </a>
    </header>
  )
}

export default Header
