import type { Difficulty, DifficultyModifier } from "./types";

export const DIFFICULTIES = {
  easy: {
    type: "easy",
    label: "Easy",
    blurPercentage: 0.3,
  },
  medium: {
    type: "medium",
    label: "Medium",
    blurPercentage: 0.5,
  },
  hard: {
    type: "hard",
    label: "Hard",
    blurPercentage: 0.75,
  },
  blind: {
    type: "blind",
    label: "Blind",
    blurPercentage: 1,
  },
} satisfies Record<Difficulty, DifficultyModifier>;

export const DIFFICULTY_TO_COLOR_CLASS = {
  easy: "success",
  medium: "warning",
  hard: "error",
  blind: "accent",
}

export const DEFAULT_LYRICS = `
Is this the real life? Is this just fantasy?
Caught in a landslide, no escape from reality
Open your eyes, look up to the skies and see
I'm just a poor boy, I need no sympathy
Because I'm easy come, easy go, little high, little low
Any way the wind blows doesn't really matter to me, to me

Mama, just killed a man
Put a gun against his head, pulled my trigger, now he's dead
Mama, life had just begun
But now I've gone and thrown it all away
Mama, ooh, didn't mean to make you cry
If I'm not back again this time tomorrow
Carry on, carry on as if nothing really matters

Too late, my time has come
Sends shivers down my spine, body's aching all the time
Goodbye, everybody, I've got to go
Gotta leave you all behind and face the truth
Mama, ooh (Any way the wind blows)
I don't wanna die
I sometimes wish I'd never been born at all

I see a little silhouetto of a man
Scaramouche, Scaramouche, will you do the Fandango?
Thunderbolt and lightning, very, very frightening me
(Galileo) Galileo, (Galileo) Galileo, Galileo Figaro magnifico (Oh-oh-oh-oh)
But I'm just a poor boy, nobody loves me
He's just a poor boy from a poor family
Spare him his life from this monstrosity
Easy come, easy go, will you let me go?
Bismillah, no, we will not let you go
(Let him go) Bismillah, we will not let you go
(Let him go) Bismillah, we will not let you go
(Let me go) Will not let you go
(Let me go) Will not let you go
(Never, never, never, never let me go) Ah
No, no, no, no, no, no, no
(Oh, mamma mia, mamma mia) Mamma mia, let me go
Beelzebub has a devil put aside for me, for me, for me

So you think you can stone me and spit in my eye?
So you think you can love me and leave me to die?
Oh, baby, can't do this to me, baby
Just gotta get out, just gotta get right outta here
[Outro]
(Ooh)
(Ooh, yeah, ooh, yeah)
Nothing really matters, anyone can see
Nothing really matters
Nothing really matters to me
Any way the wind blows
`
