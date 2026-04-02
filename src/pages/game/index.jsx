import { useCallback, useEffect, useRef, useState } from 'react'
import usePlayers from '../../hooks/usePlayers.js'
import useMatches from '../../hooks/useMatches.js'
import { buildTeams, pickTeamNames } from './teams.js'
import { MatchListView } from './MatchListView.jsx'
import { ScoreView } from './ScoreView.jsx'
import { TeamsView } from './TeamsView.jsx'
import { PlayerSelectionView } from './PlayerSelectionView.jsx'

const Game = () => {
  const { players } = usePlayers()
  const { matches, addMatch, updateMatch, deleteMatch, updateAndAddMatch } = useMatches()

  const [currentMatchId, setCurrentMatchId] = useState(null)

  // phase: 'select' | 'hiding' | 'frisbee' | 'teams' | 'running' | 'scoring'
  const [phase, setPhase] = useState('select')
  const [active, setActive] = useState(new Set())
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
    const activeMatch = matches.find(m => m.state === 'pending' || m.state === 'running')
    if (activeMatch?.teams?.length === 2) {
      setCurrentMatchId(activeMatch.id)
      setTeams(activeMatch.teams)
      setActive(new Set(activeMatch.teams.flatMap(t => t.players.map(p => p.id))))
      setPhase(activeMatch.state === 'running' ? 'running' : 'teams')
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
    addMatch({
      id,
      state: 'created',
      teams: [],
      shuffled: false,
      time_start: new Date(),
      time_end: null,
      final_result: null,
    })
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
    addMatch({
      id,
      state: 'pending',
      teams: matchTeams,
      shuffled: false,
      time_start: new Date(),
      time_end: null,
      final_result: null,
    })
    setCurrentMatchId(id)
    setTeams(matchTeams)
    setActive(new Set(matchTeams.flatMap(t => t.players.map(p => p.id))))
    setScore({ alpha: '', beta: '' })
    setPhase('teams')
  }

  const handleSet = () => {
    if (active.size === 0) return
    setAdvantageTeamIndex(Math.random() < 0.5 ? 0 : 1)
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
    setAdvantageTeamIndex(Math.random() < 0.5 ? 0 : 1)
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
    updateMatch(currentMatchId, {
      state: 'ended',
      final_result: { teamA: Number(score.alpha), teamB: Number(score.beta) },
    })
    setCurrentMatchId(null)
  }

  const handleReplay = () => {
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
    updateAndAddMatch(
      currentMatchId,
      { state: 'ended', final_result: { teamA: Number(score.alpha), teamB: Number(score.beta) } },
      newMatch
    )
    setCurrentMatchId(id)
    setScore({ alpha: '', beta: '' })
    setPhase('teams')
  }

  // ── View routing ──

  if (currentMatchId === null) {
    return (
      <MatchListView
        matches={matches}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        openMatch={openMatch}
        replayMatch={replayMatch}
        deleteMatch={deleteMatch}
        createMatch={createMatch}
      />
    )
  }

  if (phase === 'scoring' && teams) {
    return (
      <ScoreView
        teams={teams}
        score={score}
        setScore={setScore}
        onSubmit={handleSubmitScore}
        onReplay={handleReplay}
        onBack={() => setCurrentMatchId(null)}
      />
    )
  }

  if ((phase === 'teams' || phase === 'running') && teams) {
    const alreadyShuffled = matches.find(m => m.id === currentMatchId)?.shuffled ?? false
    return (
      <TeamsView
        teams={teams}
        phase={phase}
        advantageTeamIndex={advantageTeamIndex}
        alreadyShuffled={alreadyShuffled}
        onStartMatch={handleStartMatch}
        onEndMatch={handleEndMatch}
        onShuffle={handleShuffle}
        onBack={() => setCurrentMatchId(null)}
      />
    )
  }

  const selectablePlayers = sorted.filter(p => !p.muted)
  const visiblePlayers =
    phase === 'hiding' || phase === 'frisbee' ? selectablePlayers.filter(p => active.has(p.id)) : selectablePlayers

  return (
    <PlayerSelectionView
      visiblePlayers={visiblePlayers}
      active={active}
      phase={phase}
      onToggle={toggle}
      onSet={handleSet}
      onFrisbeeDone={handleFrisbeeDone}
      onBack={() => setCurrentMatchId(null)}
    />
  )
}

export default Game
