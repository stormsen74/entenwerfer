import { teamnames } from '../../utils/teamnames.js'

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function pickTeamNames() {
  const pool = [...teamnames]
  const i = Math.floor(Math.random() * pool.length)
  const first = pool.splice(i, 1)[0]
  const j = Math.floor(Math.random() * pool.length)
  return [first, pool[j]]
}

export function buildTeams(players, names) {
  const shuffled = shuffleArray(players)

  const baseSize = Math.floor(shuffled.length / 2)
  const hasExtraPlayer = shuffled.length % 2 === 1
  const extraGoesToFirstTeam = Math.random() < 0.5

  const firstTeamSize = hasExtraPlayer ? baseSize + (extraGoesToFirstTeam ? 1 : 0) : baseSize

  return [
    { name: names[0], players: shuffled.slice(0, firstTeamSize) },
    { name: names[1], players: shuffled.slice(firstTeamSize) },
  ]
}
