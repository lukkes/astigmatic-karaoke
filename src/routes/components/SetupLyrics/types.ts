export type Difficulty = "easy" | "medium" | "hard" | "blind";

export type DifficultyModifier = {
  type: Difficulty,
  label: string,
  blurPercentage: number,
}
