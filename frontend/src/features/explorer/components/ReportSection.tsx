import type { ReactNode } from "react"

interface ReportSectionProps {
  title: string
  description?: string
  children: ReactNode
}

/**
 * One banded section of the Explorer report. Replaces the per-card header:
 * a tinted full-width banner (title + optional description) with the section's
 * rows below it.
 *
 * The outer bordered/rounded container lives in ExplorerPage; ReportSection
 * provides only the internal banding. Sections separate with a top border,
 * suppressed on the first via `first:border-t-0`, so no doubled line against
 * the container's own top edge.
 */
export function ReportSection({
  title,
  description,
  children,
}: ReportSectionProps) {
  return (
    <section className="border-t border-border first:border-t-0">
      <div className="border-b border-border bg-muted px-3 py-1.5">
        <h3 className="text-[13px] font-medium leading-tight">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="px-3 py-1.5">{children}</div>
    </section>
  )
}

export default ReportSection
