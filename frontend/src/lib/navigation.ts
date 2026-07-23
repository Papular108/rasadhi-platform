import {
  ArrowLeftRight,
  FlaskConical,
  GitCompare,
  Microscope,
  Network,
  Search,
  Split,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  path: string
  icon: LucideIcon
  description: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Data",
    items: [
      {
        label: "Preprocessing",
        path: "/preprocessing",
        icon: FlaskConical,
        description: "Clean, filter, and label your dataset",
      },
      {
        label: "Converter",
        path: "/converter",
        icon: ArrowLeftRight,
        description: "Convert between SMILES, InChI, and formula",
      },
    ],
  },
  {
    label: "Analyze",
    items: [
      {
        label: "Explorer",
        path: "/explorer",
        icon: Microscope,
        description: "Analyze a single molecule in depth",
      },
      {
        label: "Similarity",
        path: "/similarity",
        icon: Search,
        description: "Screen a dataset against reference molecules",
      },
      {
        label: "Clustering",
        path: "/clustering",
        icon: Network,
        description: "Group molecules by structural similarity",
      },
      {
        label: "Filter comparison",
        path: "/filter-comparison",
        icon: GitCompare,
        description: "Compare two filter configurations",
      },
    ],
  },
  {
    label: "Model",
    items: [
      {
        label: "Train/test split",
        path: "/splitting",
        icon: Split,
        description: "Prepare train and test sets for QSAR modeling",
      },
    ],
  },
]
