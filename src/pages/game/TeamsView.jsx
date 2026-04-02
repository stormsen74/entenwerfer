import { Content } from '../../common/styles.js'
import { BackLink, BgNumber, CardName, Ente2, Fab, FabStack, TeamCard, TeamColumn, TeamHeader, TeamsGrid } from './styles.js'

export function TeamsView({ teams, phase, advantageTeamIndex, alreadyShuffled, onStartMatch, onEndMatch, onShuffle, onBack }) {
  const isRunning = phase === 'running'

  return (
    <Content>
      <BackLink onClick={onBack}>← Matches</BackLink>
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
          <Fab $danger onClick={onEndMatch}>
            END MATCH
          </Fab>
        ) : (
          <>
            <Fab $primary onClick={onStartMatch}>
              START MATCH
            </Fab>
            {!alreadyShuffled && (
              <Fab $primary onClick={onShuffle}>
                SHUFFLE
              </Fab>
            )}
          </>
        )}
      </FabStack>
    </Content>
  )
}
