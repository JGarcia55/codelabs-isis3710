export interface Step {
  title: string
  content: string
  duration?: number
}

export interface Codelab {
  title: string
  slug: string
  description: string
  author?: string
  duration?: number
  tags?: string[]
  steps: Step[]
  createdAt: string
  updatedAt: string
}
