import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'
import { Content, colors } from '../common/styles'
import diskImg from '../assets/disk.png'
import { teamnames } from '../utils/teamnames'
import usePlayers from '../hooks/usePlayers'
import useMatches from '../hooks/useMatches'

// ─── Frisbee animation config & components ────────────────────────────────────

export const FRISBEE_CONFIG = {
  count: 7, // number of disks
  minSize: 90, // px
  maxSize: 230, // px
  totalDuration: 1500, // ms before teams are revealed
  minFlightMs: 650, // individual disk animation min duration
  maxFlightMs: 800, // individual disk animation max duration
  maxDelay: 500, // max random start delay per disk (ms)
  maxYOffset: 750, // max vertical drift from entry Y to exit Y (px)
}

const cardFlicker = keyframes`
  0%   { opacity: 0; }
  90%  { opacity: 0; }
  100% { opacity: 1; }
`

const flyDisk = keyframes`
  from { transform: translate(var(--from-x), var(--from-y)) rotate(0deg); }
  to   { transform: translate(var(--to-x), var(--to-y)) rotate(var(--rotation)); }
`

const FrisbeeLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
`

const FrisbeeDisc = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  pointer-events: none;
  will-change: transform;
  animation: ${flyDisk} var(--duration) linear var(--delay) 1 both;
`

function generateDiskConfigs(cfg) {
  const w = window.innerWidth
  const h = window.innerHeight
  const { count, minSize, maxSize, minFlightMs, maxFlightMs, maxDelay, maxYOffset } = cfg

  // guaranteed ~50/50 left/right split
  const sides = Array.from({ length: count }, (_, i) => i < Math.ceil(count / 2))
  for (let i = sides.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[sides[i], sides[j]] = [sides[j], sides[i]]
  }

  return Array.from({ length: count }, (_, i) => {
    const size = Math.round(minSize + Math.random() * (maxSize - minSize))
    const fromLeft = sides[i]

    const fromY = Math.round(Math.random() * h)
    const yOffset = Math.round((Math.random() * 2 - 1) * maxYOffset)

    const fromX = fromLeft ? -size : w + size
    const toX = fromLeft ? w + size : -size
    const toY = fromY + yOffset

    const rotDeg = (180 + Math.random() * 540) * (fromLeft ? 1 : -1)

    return {
      size,
      fromX,
      fromY,
      toX,
      toY,
      rotation: `${Math.round(rotDeg)}deg`,
      duration: Math.round(minFlightMs + Math.random() * (maxFlightMs - minFlightMs)),
      delay: Math.round(Math.random() * maxDelay),
    }
  })
}

function FrisbeeOverlay({ onDone, config = FRISBEE_CONFIG }) {
  const disks = useMemo(() => generateDiskConfigs(config), [config])

  useEffect(() => {
    const t = setTimeout(onDone, config.totalDuration)
    return () => clearTimeout(t)
  }, [onDone, config.totalDuration])

  return (
    <FrisbeeLayer>
      {disks.map((d, i) => (
        <FrisbeeDisc
          key={i}
          src={diskImg}
          alt=''
          style={{
            '--size': `${d.size}px`,
            '--from-x': `${d.fromX}px`,
            '--from-y': `${d.fromY}px`,
            '--to-x': `${d.toX}px`,
            '--to-y': `${d.toY}px`,
            '--rotation': d.rotation,
            '--duration': `${d.duration}ms`,
            '--delay': `${d.delay}ms`,
          }}
        />
      ))}
    </FrisbeeLayer>
  )
}

// ─── Team formation logic (encapsulated, easily swappable) ───────────────────

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickTeamNames() {
  const pool = [...teamnames]
  const i = Math.floor(Math.random() * pool.length)
  const first = pool.splice(i, 1)[0]
  const j = Math.floor(Math.random() * pool.length)
  return [first, pool[j]]
}

function buildTeams(players, names) {
  const shuffled = shuffleArray(players)
  const mid = Math.ceil(shuffled.length / 2)
  return [
    { name: names[0], players: shuffled.slice(0, mid) },
    { name: names[1], players: shuffled.slice(mid) },
  ]
}

// ─── Shared card components ───────────────────────────────────────────────────

const BgNumber = styled.span`
  position: absolute;
  right: -0.1em;
  bottom: -0.2em;
  font-size: 6rem;
  font-weight: 900;
  line-height: 1;
  color: ${({ $active }) => ($active ? colors.green[100] : '#fff')};
  opacity: ${({ $active }) => ($active ? 0.08 : 0.04)};
  pointer-events: none;
  transition:
    opacity 0.25s ease,
    color 0.25s ease;
`

const CardName = styled.span`
  position: relative;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? colors.green[100] : '#aaa')};
  text-align: center;
  line-height: 1.3;
  transition: color 0.25s ease;
  z-index: 1;
`

// ─── Selection view styled components ────────────────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
  ${({ $phase, $dur }) =>
    $phase === 'hiding'
      ? css`
          opacity: 0;
          transition: opacity 0.2s ease;
        `
      : $phase === 'frisbee'
        ? css`
            animation: ${cardFlicker} ${$dur}ms ease both;
          `
        : ''}
`

const Card = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0.75rem;
  border-radius: 14px;
  background: ${({ $active }) => ($active ? 'rgba(0, 255, 105, 0.07)' : '#111')};
  border: 1.5px solid ${({ $active }) => ($active ? colors.green[55] : '#222')};
  box-shadow: ${({ $active }) => ($active ? '0 0 12px rgba(0, 255, 105, 0.18)' : 'none')};
  cursor: pointer;
  min-height: 88px;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

const Status = styled.p`
  font-size: 0.82rem;
  color: #444;
  margin: 0 0 1rem;
  align-self: flex-start;
`

// ─── Teams view styled components ────────────────────────────────────────────

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
`

const TeamColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const TeamHeader = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f5ab3c;
  text-align: center;
  margin-bottom: 0.25rem;
`

const TeamCard = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 0.75rem;
  border-radius: 14px;
  background: ${({ $muted }) => ($muted ? '#0d0d0d' : 'rgba(0, 255, 105, 0.07)')};
  border: 1.5px solid ${({ $muted }) => ($muted ? '#1a1a1a' : colors.green[55])};
  box-shadow: ${({ $muted }) => ($muted ? 'none' : '0 0 12px rgba(0, 255, 105, 0.18)')};
  min-height: 88px;
  transition:
    background 0.3s ease,
    border-color 0.3s ease,
    box-shadow 0.3s ease;
`

// ─── Score input styled components ───────────────────────────────────────────

const ScoreWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
  margin-top: 0.5rem;
`

const ScoreField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
`

const ScoreLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
`

const ScoreInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0.75rem;
  border-radius: 14px;
  background: #111;
  border: 1.5px solid #333;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  font-family: inherit;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    border-color: ${colors.green[55]};
  }
`

const SubmitRow = styled.div`
  width: 100%;
  margin-top: 1.25rem;
`

const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 14px;
  border: 1.5px solid ${colors.green[55]};
  background: rgba(0, 255, 105, 0.1);
  color: ${colors.green[100]};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

// ─── Match list styled components ─────────────────────────────────────────────

const MatchList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

const MatchCard = styled.div`
  border-radius: 14px;
  background: #111;
  border: 1.5px solid #222;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

const MatchCardHeader = styled.div`
  padding: 1rem 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`

const MatchHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MatchTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: #e0e0e0;
`

const MatchState = styled.span`
  font-size: 0.78rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const MatchHeaderScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const MatchTeamLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #888;
`

const MatchScoreText = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.green[100]};
  letter-spacing: 0.04em;
`

const MatchExpanded = styled.div`
  max-height: ${({ $open }) => ($open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.28s ease;
`

const MatchExpandedInner = styled.div`
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const MatchTeamCols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
`

const MatchTeamCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const MatchTeamColHeader = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.3rem;
`

const MatchPlayerItem = styled.div`
  font-size: 0.95rem;
  color: #999;
`

const MatchExpandedActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const MatchOpenBtn = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

const MatchDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
  background: #2a1010;
  color: #e05555;
  border: 1px solid #3a1515;

  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

// ─── Shared UI ────────────────────────────────────────────────────────────────

const BackLink = styled.button`
  position: absolute;
  top: 1.25rem;
  left: 1.25rem;
  align-self: flex-start;
  background: none;
  border: none;
  color: #555;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

const EmptyNote = styled.p`
  color: #555;
  font-size: 1rem;
  margin-top: 2rem;
`

const FabStack = styled.div`
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.65rem;
  z-index: 90;
`

const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
  height: 52px;
  border-radius: 26px;
  border: 1.5px solid
    ${({ $primary, $danger }) => ($danger ? 'rgba(255, 60, 60, 0.55)' : $primary ? colors.green[55] : '#333')};
  background: ${({ $primary, $danger }) =>
    $danger ? 'rgba(255, 60, 60, 0.1)' : $primary ? 'rgba(0, 255, 105, 0.1)' : '#111'};
  color: ${({ $primary, $danger }) => ($danger ? 'rgba(255, 90, 90, 1)' : $primary ? colors.green[100] : '#666')};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

// ─── Game component ───────────────────────────────────────────────────────────

const Game = () => {
  const { players } = usePlayers()
  const { matches, addMatch, updateMatch, deleteMatch } = useMatches()

  const [currentMatchId, setCurrentMatchId] = useState(null)

  // In-match state
  const [active, setActive] = useState(new Set())
  // phase: 'select' | 'hiding' | 'teams' | 'running' | 'scoring'
  const [phase, setPhase] = useState('select')
  const [teams, setTeams] = useState(null)
  const [score, setScore] = useState({ alpha: '', beta: '' })
  const [expandedId, setExpandedId] = useState(null)
  const didRestoreRef = useRef(false)

  const sorted = [...players].sort((a, b) => Number(a.playernumber) - Number(b.playernumber))

  // ── Auto-restore pending/running match on initial load ──
  useEffect(() => {
    if (didRestoreRef.current || matches.length === 0) return
    didRestoreRef.current = true
    const active = matches.find(m => m.state === 'pending' || m.state === 'running')
    if (active?.teams?.length === 2) {
      setCurrentMatchId(active.id)
      setTeams(active.teams)
      setActive(new Set(active.teams.flatMap(t => t.players.map(p => p.id))))
      setPhase(active.state === 'running' ? 'running' : 'teams')
    }
  }, [matches])

  // ── Handlers ──

  const toggle = id =>
    setActive(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const createMatch = () => {
    const id = Date.now().toString()
    const match = {
      id,
      state: 'created',
      teams: [],
      shuffled: false,
      time_start: new Date(),
      time_end: null,
      final_result: null,
    }
    addMatch(match)
    openMatch(id)
  }

  const openMatch = id => {
    const match = matches.find(m => m.id === id)
    setCurrentMatchId(id)
    setScore({ alpha: '', beta: '' })
    if (match?.teams?.length === 2 && (match.state === 'pending' || match.state === 'running')) {
      setTeams(match.teams)
      setActive(new Set(match.teams.flatMap(t => t.players.map(p => p.id))))
      setPhase(match.state === 'running' ? 'running' : 'teams')
    } else {
      setActive(new Set())
      setPhase('select')
      setTeams(null)
    }
  }

  const handleSet = () => {
    if (active.size === 0) return
    setPhase('hiding')
    setTimeout(() => {
      const activePlayers = sorted.filter(p => active.has(p.id))
      const newTeams = buildTeams(activePlayers, pickTeamNames())
      setTeams(newTeams)
      updateMatch(currentMatchId, { state: 'pending', teams: newTeams })
      setPhase('frisbee')
    }, 350)
  }

  const handleFrisbeeDone = useCallback(() => setPhase('teams'), [])

  const handleShuffle = () => {
    const activePlayers = sorted.filter(p => active.has(p.id))
    const existingNames = teams ? teams.map(t => t.name) : pickTeamNames()
    const newTeams = buildTeams(activePlayers, existingNames)
    setTeams(newTeams)
    updateMatch(currentMatchId, { teams: newTeams, shuffled: true })
  }

  const handleStartMatch = () => {
    setPhase('running')
    updateMatch(currentMatchId, { state: 'running' })
  }

  const handleEndMatch = () => {
    setScore({ alpha: '', beta: '' })
    setPhase('scoring')
    updateMatch(currentMatchId, { time_end: new Date() })
  }

  const handleSubmitScore = () => {
    const result = { teamA: Number(score.alpha), teamB: Number(score.beta) }
    updateMatch(currentMatchId, { state: 'ended', final_result: result })
    setCurrentMatchId(null)
  }

  // ── Match list view ──

  if (currentMatchId === null) {
    const formatMatchDate = ts => {
      const d = new Date(ts)
      if (isNaN(d)) return '–'
      return (
        d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
        ' ' +
        d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      )
    }

    const sortedMatches = [...matches].sort((a, b) => {
      const aEnded = a.state === 'ended'
      const bEnded = b.state === 'ended'
      if (aEnded !== bEnded) return aEnded ? 1 : -1
      if (aEnded && bEnded) return new Date(b.time_end) - new Date(a.time_end)
      return Number(b.id) - Number(a.id)
    })

    return (
      <Content>
        {matches.length === 0 ? (
          <EmptyNote>No matches.</EmptyNote>
        ) : (
          <MatchList>
            {sortedMatches.map(m => {
              const hasTeams = m.teams && m.teams.length === 2
              const isExpanded = expandedId === m.id
              const toggleExpand = () => setExpandedId(isExpanded ? null : m.id)
              return (
                <MatchCard key={m.id}>
                  <MatchCardHeader onClick={toggleExpand}>
                    <MatchHeaderTop>
                      <MatchTitle>{formatMatchDate(m.time_start)}</MatchTitle>
                      <MatchState>{m.state}</MatchState>
                    </MatchHeaderTop>
                    {hasTeams && (
                      <MatchHeaderScore>
                        <MatchTeamLabel>{m.teams[0].name}</MatchTeamLabel>
                        {m.final_result ? (
                          <MatchScoreText>
                            {m.final_result.teamA} : {m.final_result.teamB}
                          </MatchScoreText>
                        ) : (
                          <MatchScoreText style={{ color: '#333' }}>vs</MatchScoreText>
                        )}
                        <MatchTeamLabel>{m.teams[1].name}</MatchTeamLabel>
                      </MatchHeaderScore>
                    )}
                  </MatchCardHeader>
                  <MatchExpanded $open={isExpanded}>
                    <MatchExpandedInner>
                      {hasTeams && (
                        <MatchTeamCols>
                          {m.teams.map(team => (
                            <MatchTeamCol key={team.name}>
                              <MatchTeamColHeader>{team.name}</MatchTeamColHeader>
                              {team.players.map(p => (
                                <MatchPlayerItem key={p.id}>{p.playername}</MatchPlayerItem>
                              ))}
                            </MatchTeamCol>
                          ))}
                        </MatchTeamCols>
                      )}
                      <MatchExpandedActions>
                        {m.state !== 'ended' ? (
                          <MatchOpenBtn onClick={() => openMatch(m.id)}>Weiter →</MatchOpenBtn>
                        ) : (
                          <span />
                        )}
                        <MatchDeleteBtn title='Match löschen' onClick={() => deleteMatch(m.id)}>
                          <svg
                            viewBox='0 0 16 16'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          >
                            <path d='M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 9.5h8L13 4' />
                          </svg>
                        </MatchDeleteBtn>
                      </MatchExpandedActions>
                    </MatchExpandedInner>
                  </MatchExpanded>
                </MatchCard>
              )
            })}
          </MatchList>
        )}
        <Link
          to='/players'
          style={{
            position: 'fixed',
            bottom: '1.25rem',
            left: 0,
            width: '60px',
            height: '52px',
            opacity: 0,
            zIndex: 100,
            display: 'block',
          }}
          aria-label='Zu den Spielern'
        />
        <FabStack>
          <Fab $primary onClick={createMatch}>
            + Match
          </Fab>
        </FabStack>
      </Content>
    )
  }

  // ── Match detail: score entry view ──

  if (phase === 'scoring' && teams) {
    const canSubmit = score.alpha !== '' && score.beta !== ''
    return (
      <Content>
        <BackLink onClick={() => setCurrentMatchId(null)}>← Matches</BackLink>
        <ScoreWrapper>
          {teams.map((team, i) => {
            const key = i === 0 ? 'alpha' : 'beta'
            return (
              <ScoreField key={team.name}>
                <ScoreLabel>{team.name}</ScoreLabel>
                <ScoreInput
                  type='number'
                  inputMode='numeric'
                  min='0'
                  value={score[key]}
                  onChange={e => setScore(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder='0'
                />
              </ScoreField>
            )
          })}
        </ScoreWrapper>
        <SubmitRow>
          <SubmitBtn onClick={handleSubmitScore} disabled={!canSubmit}>
            Speichern
          </SubmitBtn>
        </SubmitRow>
      </Content>
    )
  }

  // ── Match detail: teams view (teams + running) ──

  if ((phase === 'teams' || phase === 'running') && teams) {
    const isRunning = phase === 'running'
    const currentMatch = matches.find(m => m.id === currentMatchId)
    const alreadyShuffled = currentMatch?.shuffled ?? false
    return (
      <Content>
        <BackLink onClick={() => setCurrentMatchId(null)}>← Matches</BackLink>
        <TeamsGrid>
          {teams.map(team => (
            <TeamColumn key={team.name}>
              <TeamHeader>{team.name}</TeamHeader>
              {team.players.map(p => (
                <TeamCard key={p.id} $muted={isRunning}>
                  <BgNumber $active={!isRunning}>{p.playernumber}</BgNumber>
                  <CardName $active={!isRunning}>{p.playername}</CardName>
                </TeamCard>
              ))}
            </TeamColumn>
          ))}
        </TeamsGrid>
        <FabStack>
          {isRunning ? (
            <Fab $danger onClick={handleEndMatch}>
              End Match
            </Fab>
          ) : (
            <>
              <Fab $primary onClick={handleStartMatch}>
                Start Match
              </Fab>
              {!alreadyShuffled && <Fab onClick={handleShuffle}>Shuffle</Fab>}
            </>
          )}
        </FabStack>
      </Content>
    )
  }

  // ── Match detail: selection view ──

  const visiblePlayers = phase === 'hiding' || phase === 'frisbee' ? sorted.filter(p => active.has(p.id)) : sorted

  return (
    <Content>
      {phase === 'frisbee' && <FrisbeeOverlay onDone={handleFrisbeeDone} />}
      <BackLink onClick={() => setCurrentMatchId(null)}>← Matches</BackLink>
      <Status>
        {active.size} / {sorted.length} aktiv
      </Status>
      <Grid $phase={phase} $dur={FRISBEE_CONFIG.totalDuration}>
        {visiblePlayers.map(p => {
          const isActive = active.has(p.id)
          return (
            <Card key={p.id} $active={isActive} onClick={() => phase === 'select' && toggle(p.id)}>
              <BgNumber $active={isActive}>{p.playernumber}</BgNumber>
              <CardName $active={isActive}>{p.playername}</CardName>
            </Card>
          )
        })}
      </Grid>
      <FabStack>
        <Fab $primary onClick={handleSet} disabled={active.size === 0}>
          Set
        </Fab>
      </FabStack>
    </Content>
  )
}

export default Game
