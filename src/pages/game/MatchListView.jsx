import { Link } from 'react-router-dom'
import { Content } from '../../common/styles.js'
import {
  EmptyNote,
  Fab,
  FabStack,
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
} from './styles.js'

function formatMatchDate(ts) {
  const d = new Date(ts)
  if (isNaN(d)) return '–'
  return (
    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' }) +
    ' ' +
    d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  )
}

function sortMatches(matches) {
  return [...matches].sort((a, b) => {
    const aEnded = a.state === 'ended'
    const bEnded = b.state === 'ended'
    if (aEnded !== bEnded) return aEnded ? 1 : -1
    if (aEnded && bEnded) return new Date(b.time_end) - new Date(a.time_end)
    return Number(b.id) - Number(a.id)
  })
}

export function MatchListView({ matches, expandedId, setExpandedId, openMatch, replayMatch, deleteMatch, createMatch }) {
  const sortedMatches = sortMatches(matches)

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
