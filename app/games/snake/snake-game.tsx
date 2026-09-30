'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const MIN = 8
const MAX = 25
const TICK_MS = 140
const BONUS_EVERY = 5 // small apples needed to summon the big apple
const BONUS_SLACK = 5 // extra ticks on top of the travel distance
const BONUS_POINTS = 5

type Pos = { x: number; y: number }
type Dir = Pos
type Bonus = Pos & { left: number; total: number } // 2x2 block with top-left at x,y
type Game = {
  snake: Pos[]
  food: Pos | null
  bonus: Bonus | null
  score: number
  eaten: number
  over: boolean
}

const DIRS: Record<string, Dir> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
}

const pick = <T,>(list: T[]): T | null =>
  list.length ? list[Math.floor(Math.random() * list.length)] : null

const bonusCells = (b: Pos): Pos[] => [
  { x: b.x, y: b.y },
  { x: b.x + 1, y: b.y },
  { x: b.x, y: b.y + 1 },
  { x: b.x + 1, y: b.y + 1 },
]

const same = (a: Pos, b: Pos) => a.x === b.x && a.y === b.y

function randomFood(size: number, taken: Pos[]): Pos | null {
  const free: Pos[] = []
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++)
      if (!taken.some((p) => same(p, { x, y }))) free.push({ x, y })
  return pick(free)
}

// shortest steps from `from` to the nearest cell of the block, with wrap-around
function distance(size: number, from: Pos, b: Pos) {
  const d = (a: number, c: number) => Math.min(Math.abs(a - c), size - Math.abs(a - c))
  return Math.min(...bonusCells(b).map((c) => d(from.x, c.x) + d(from.y, c.y)))
}

function randomBonus(size: number, taken: Pos[], head: Pos): Bonus | null {
  const spots: Pos[] = []
  for (let y = 0; y < size - 1; y++)
    for (let x = 0; x < size - 1; x++)
      if (!bonusCells({ x, y }).some((c) => taken.some((p) => same(p, c))))
        spots.push({ x, y })
  const s = pick(spots)
  if (!s) return null
  const total = distance(size, head, s) + BONUS_SLACK
  return { ...s, left: total, total }
}

function initial(size: number): Game {
  const mid = Math.floor(size / 2)
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
  return {
    snake,
    food: randomFood(size, snake),
    bonus: null,
    score: 0,
    eaten: 0,
    over: false,
  }
}

function step(g: Game, size: number, d: Dir): Game {
  const head = {
    x: (g.snake[0].x + d.x + size) % size,
    y: (g.snake[0].y + d.y + size) % size,
  }
  const ateFood = !!g.food && same(head, g.food)
  const ateBonus = !!g.bonus && bonusCells(g.bonus).some((c) => same(c, head))
  const body = ateFood || ateBonus ? g.snake : g.snake.slice(0, -1)
  if (body.some((p) => same(p, head))) return { ...g, over: true }

  const snake = [head, ...body]
  let { food, bonus, score, eaten } = g

  if (ateBonus) {
    score += BONUS_POINTS
    bonus = null
  } else if (bonus) {
    bonus = bonus.left > 1 ? { ...bonus, left: bonus.left - 1 } : null
  }

  if (ateFood) {
    score += 1
    eaten += 1
    const taken = [...snake, ...(bonus ? bonusCells(bonus) : [])]
    if (eaten % BONUS_EVERY === 0 && !bonus) {
      bonus = randomBonus(size, [...snake, ...(food ? [food] : [])], head)
    }
    food = randomFood(size, [...taken, ...(bonus ? bonusCells(bonus) : [])])
  }

  return { snake, food, bonus, score, eaten, over: !food }
}

export default function SnakeGame() {
  const [input, setInput] = useState('12')
  const [size, setSize] = useState<number | null>(null)
  const [game, setGame] = useState<Game>(() => initial(MIN))
  const [paused, setPaused] = useState(false)

  const dir = useRef<Dir>({ x: 1, y: 0 })
  const nextDir = useRef<Dir>({ x: 1, y: 0 })

  const n = Number(input)
  const valid = Number.isInteger(n) && n >= MIN && n <= MAX
  const { snake, food, bonus, score, over } = game

  const start = useCallback((s: number) => {
    dir.current = { x: 1, y: 0 }
    nextDir.current = { x: 1, y: 0 }
    setSize(s)
    setGame(initial(s))
    setPaused(false)
  }, [])

  const turn = useCallback((d: Dir) => {
    // ignore reversing into itself
    if (d.x === -dir.current.x && d.y === -dir.current.y) return
    nextDir.current = d
  }, [])

  useEffect(() => {
    if (size === null) return
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      } else if (DIRS[key]) {
        e.preventDefault()
        turn(DIRS[key])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [size, turn])

  useEffect(() => {
    if (size === null || over || paused) return
    const id = setInterval(() => {
      dir.current = nextDir.current
      setGame((g) => (g.over ? g : step(g, size, dir.current)))
    }, TICK_MS)
    return () => clearInterval(id)
  }, [size, over, paused])

  const wrap =
    'flex min-h-[70vh] flex-col items-center justify-center font-mono text-black dark:text-white'
  const btn =
    'border border-current px-4 py-2 text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'

  if (size === null) {
    return (
      <div className={wrap}>
        <h1 className="mb-6 text-2xl font-semibold tracking-tighter">Snake</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (valid) start(n)
          }}
          className="flex flex-col items-center gap-3"
        >
          <label className="text-sm">
            Grid size ({MIN}–{MAX})
          </label>
          <input
            type="number"
            min={MIN}
            max={MAX}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-24 border border-current bg-transparent px-2 py-1 text-center"
          />
          {!valid && (
            <p className="text-xs text-red-500">
              Enter a whole number from {MIN} to {MAX}.
            </p>
          )}
          <button type="submit" disabled={!valid} className={btn + ' disabled:opacity-40'}>
            Play
          </button>
        </form>
      </div>
    )
  }

  const cell = `min(${Math.floor(560 / size)}px, ${(90 / size).toFixed(2)}vw)`
  const isSnake = new Set(snake.map((p) => p.y * size + p.x))
  const isBonus = new Set(
    bonus ? bonusCells(bonus).map((p) => p.y * size + p.x) : [],
  )

  return (
    <div className={wrap}>
      <div className="flex w-fit flex-col gap-2">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span>Score: {score}</span>
          <span className="text-xs opacity-60">
            {over ? 'Game over' : paused ? 'Paused' : 'Arrows / WASD · Space pauses'}
          </span>
        </div>

        <div
          className="inline-grid border-2 border-current p-px"
          style={{
            gridTemplateColumns: `repeat(${size}, ${cell})`,
            gridAutoRows: cell,
            gap: 1,
          }}
        >
          {Array.from({ length: size * size }, (_, i) => (
            <div
              key={i}
              className={
                isSnake.has(i)
                  ? 'bg-current'
                  : isBonus.has(i)
                    ? 'bg-red-600'
                    : food && food.y * size + food.x === i
                      ? 'border-2 border-current'
                      : ''
              }
            />
          ))}
        </div>

        {/* time left for the big apple; empty track keeps layout stable */}
        <div className="h-1.5 w-full border border-current">
          {bonus && (
            <div
              className="h-full bg-red-600"
              style={{ width: `${(bonus.left / bonus.total) * 100}%` }}
            />
          )}
        </div>
      </div>

      <div className="mt-4 grid w-40 grid-cols-3 gap-1 sm:hidden">
        <span />
        <button className={btn} onClick={() => turn(DIRS.ArrowUp)}>↑</button>
        <span />
        <button className={btn} onClick={() => turn(DIRS.ArrowLeft)}>←</button>
        <button className={btn} onClick={() => turn(DIRS.ArrowDown)}>↓</button>
        <button className={btn} onClick={() => turn(DIRS.ArrowRight)}>→</button>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          className={btn + ' disabled:opacity-40'}
          disabled={over}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button className={btn} onClick={() => start(size)}>Restart</button>
        <button className={btn} onClick={() => setSize(null)}>Change size</button>
      </div>
    </div>
  )
}
