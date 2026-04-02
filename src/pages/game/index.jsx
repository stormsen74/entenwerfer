import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Content } from '../../common/styles.js'
import diskImg from '../../assets/disk.png'
import { teamnames } from '../../utils/teamnames.js'
import usePlayers from '../../hooks/usePlayers.js'
import useMatches from '../../hooks/useMatches.js'
import {
  BackLink,
  BgNumber,
  Card,
  CardName,
  EmptyNote,
  Ente2,
  Fab,
  FabStack,
  FrisbeeDisc,
  FrisbeeLayer,
  Grid,
  MatchCard,
  MatchCardHeader,
  MatchDeleteBtn,
  MatchExpanded,
  MatchExpandedActions,
  MatchExpandedInner,
  MatchHeaderScore,
  MatchHeaderTop,
  MatchList,
  MatchOpenBtn,
  MatchPlayerItem,
  MatchReplayBtn,
  MatchScoreText,
  MatchState,
  MatchTeamCol,
  MatchTeamColHeader,
  MatchTeamCols,
  MatchTeamLabel,
  MatchTitle,
  ReplayBtn,
  ScoreField,
  ScoreInput,
  ScoreLabel,
  ScoreWrapper,
  SubmitBtn,
  SubmitRow,
  TeamCard,
  TeamColumn,
  TeamHeader,
  TeamsGrid,
} from './styles.js'

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

  // const mid = Math.ceil(shuffled.length / 2)
  // return [
  //   { name: names[0], players: shuffled.slice(0, mid) },
  //   { name: names[1], players: shuffled.slice(mid) },
  // ]

  const baseSize = Math.floor(shuffled.length / 2)
  const hasExtraPlayer = shuffled.length % 2 === 1
  const extraGoesToFirstTeam = Math.random() < 0.5

  const firstTeamSize = hasExtraPlayer ? baseSize + (extraGoesToFirstTeam ? 1 : 0) : baseSize

  return [
    { name: names[0], players: shuffled.slice(0, firstTeamSize) },
    { name: names[1], players: shuffled.slice(firstTeamSize) },
  ]
}

// ─── Game component ───────────────────────────────────────────────────────────

const Game = () => {
  const { players } = usePlayers()
  const { matches, addMatch, updateMatch, deleteMatch, updateAndAddMatch } = useMatches()

  const [currentMatchId, setCurrentMatchId] = useState(null)

  // In-match state
  const [active, setActive] = useState(new Set())
  // phase: 'select' | 'hiding' | 'teams' | 'running' | 'scoring'
  const [phase, setPhase] = useState('select')
  const [teams, setTeams] = useState(null)
  const [advantageTeamIndex, setAdvantageTeamIndex] = useState(null)
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

  const replayMatch = matchTeams => {
    const id = Date.now().toString()
    const newMatch = {
      id,
      state: 'pending',
      teams: matchTeams,
      shuffled: false,
      time_start: new Date(),
      time_end: null,
      final_result: null,
    }
    addMatch(newMatch)
    setCurrentMatchId(id)
    setTeams(matchTeams)
    setActive(new Set(matchTeams.flatMap(t => t.players.map(p => p.id))))
    setScore({ alpha: '', beta: '' })
    setPhase('teams')
  }

  const handleSet = () => {
    if (active.size === 0) return
    const newAdvantage = Math.random() < 0.5 ? 0 : 1
    setAdvantageTeamIndex(newAdvantage)
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
    const newAdvantage = Math.random() < 0.5 ? 0 : 1
    setAdvantageTeamIndex(newAdvantage)
    const activePlayers = sorted.filter(p => active.has(p.id))
    const existingNames = teams ? teams.map(t => t.name) : pickTeamNames()
    const newTeams = buildTeams(activePlayers, existingNames)
    setTeams(newTeams)
    updateMatch(currentMatchId, { teams: newTeams, shuffled: true })
  }

  const handleStartMatch = () => {
    setPhase('running')
    setAdvantageTeamIndex(null)
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

  const handleReplay = () => {
    const result = { teamA: Number(score.alpha), teamB: Number(score.beta) }
    const id = Date.now().toString()
    const newMatch = {
      id,
      state: 'pending',
      teams,
      shuffled: false,
      time_start: new Date(),
      time_end: null,
      final_result: null,
    }
    updateAndAddMatch(currentMatchId, { state: 'ended', final_result: result }, newMatch)
    setCurrentMatchId(id)
    setScore({ alpha: '', beta: '' })
    setPhase('teams')
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
                        ) : m.teams?.length === 2 ? (
                          <MatchReplayBtn title='Rematch' onClick={() => replayMatch(m.teams)}>
                            <svg
                              viewBox='0 0 16 16'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='1.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            >
                              <path d='M2 8a6 6 0 1 0 1.5-3.9' />
                              <path d='M2 3.5V8h4.5' />
                            </svg>
                          </MatchReplayBtn>
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
            SAVE
          </SubmitBtn>
          <ReplayBtn onClick={handleReplay} disabled={!canSubmit}>
            <svg
              viewBox='0 0 16 16'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              width='16'
              height='16'
            >
              <path d='M2 8a6 6 0 1 0 1.5-3.9' />
              <path d='M2 3.5V8h4.5' />
            </svg>
            REPLAY
          </ReplayBtn>
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
          {teams.map((team, i) => (
            <TeamColumn key={team.name}>
              <TeamHeader>
                <>{team.name}</>
                {phase === 'teams' && advantageTeamIndex === i && <Ente2>{'🦆'}</Ente2>}
              </TeamHeader>
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
              END MATCH
            </Fab>
          ) : (
            <>
              <Fab $primary onClick={handleStartMatch}>
                START MATCH
              </Fab>
              {!alreadyShuffled && (
                <Fab $primary onClick={handleShuffle}>
                  SHUFFLE
                </Fab>
              )}
            </>
          )}
        </FabStack>
      </Content>
    )
  }

  // ── Match detail: selection view ──

  const selectablePlayers = sorted.filter(p => !p.muted)
  const visiblePlayers =
    phase === 'hiding' || phase === 'frisbee' ? selectablePlayers.filter(p => active.has(p.id)) : selectablePlayers

  return (
    <Content>
      {phase === 'frisbee' && <FrisbeeOverlay onDone={handleFrisbeeDone} />}
      <BackLink onClick={() => setCurrentMatchId(null)}>← Matches</BackLink>
      {/*<Status>*/}
      {/*  {active.size} / {selectablePlayers.length} aktiv*/}
      {/*</Status>*/}
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
          SET
        </Fab>
      </FabStack>
    </Content>
  )
}

export default Game
