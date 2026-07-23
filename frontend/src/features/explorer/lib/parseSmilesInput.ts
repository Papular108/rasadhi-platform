/**
 * Parse the batch textarea into molecule entries.
 *
 * One molecule per line. Each line is split on its FIRST whitespace run: the
 * text before is the SMILES, the text after (trimmed) is an optional name.
 * Splitting on only the first gap means names may themselves contain spaces
 * (e.g. "acetylsalicylic acid").
 */

export interface ParsedEntry {
  smiles: string
  name?: string
}

export function parseSmilesInput(raw: string): ParsedEntry[] {
  const entries: ParsedEntry[] = []

  for (const rawLine of raw.split("\n")) {
    const line = rawLine.trim()
    if (!line) continue // skip blank lines entirely

    const match = /^(\S+)(?:\s+(.*))?$/.exec(line)
    if (!match) continue

    const smiles = match[1]
    const name = match[2]?.trim()

    // Undefined (not "") when there is no name, so the request omits it.
    entries.push(name ? { smiles, name } : { smiles })
  }

  return entries
}
