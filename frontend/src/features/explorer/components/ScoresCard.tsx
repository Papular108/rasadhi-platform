import { ReportSection } from "@/features/explorer/components/ReportSection"

interface ScoresCardProps {
  qed: number | null
  saScore: number | null
  saScoreNote: string | null
}

function qedInterpretation(qed: number): string {
  if (qed >= 0.67) return "drug-like"
  if (qed >= 0.34) return "moderate"
  return "poor"
}

function saInterpretation(sa: number): string {
  if (sa <= 3) return "easy to synthesize"
  if (sa <= 6) return "moderate"
  return "difficult"
}

interface ScoreRowProps {
  label: string
  name: string
  direction: string
  children: React.ReactNode
}

function ScoreRow({ label, name, direction, children }: ScoreRowProps) {
  return (
    <div className="border-b border-border py-1.5 text-[13px] last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <span className="font-medium">{label}</span>
          <div className="text-xs text-muted-foreground">{name}</div>
        </div>
        <div className="text-right font-mono tabular-nums">{children}</div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{direction}</p>
    </div>
  )
}

export function ScoresCard({ qed, saScore, saScoreNote }: ScoresCardProps) {
  return (
    <ReportSection title="Druglikeness scores">
      <ScoreRow
        label="QED"
        name="Quantitative estimate of druglikeness"
        direction="Scale 0 to 1 — higher is more drug-like."
      >
          {qed === null ? (
            <span className="text-muted-foreground">Not available</span>
          ) : (
            <span>
              {qed.toFixed(2)}
              <span className="text-muted-foreground"> / 1.00</span>{" "}
              <span className="font-sans text-muted-foreground">
                ({qedInterpretation(qed)})
              </span>
            </span>
          )}
        </ScoreRow>

        <ScoreRow
          label="SA score"
          name="Synthetic accessibility"
          direction="Scale 1 to 10 — lower is easier to synthesize."
        >
          {saScore === null ? (
            <span className="text-muted-foreground">
              {saScoreNote ?? "Not available"}
            </span>
          ) : (
            <span>
              {saScore.toFixed(2)}
              <span className="text-muted-foreground"> / 10</span>{" "}
              <span className="font-sans text-muted-foreground">
                ({saInterpretation(saScore)})
              </span>
            </span>
          )}
      </ScoreRow>
    </ReportSection>
  )
}

export default ScoresCard
