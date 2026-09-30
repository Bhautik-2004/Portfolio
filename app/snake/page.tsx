import SnakeGame from '../games/snake/snake-game'

export const metadata = { title: 'Snake' }

export default function Page() {
  return (
    <section>
      <SnakeGame />
    </section>
  )
}
