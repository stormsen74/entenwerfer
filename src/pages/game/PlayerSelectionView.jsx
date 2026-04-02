import { Content } from '../../common/styles.js'
import { BackLink, BgNumber, Card, CardName, Fab, FabStack, Grid } from './styles.js'
import { FrisbeeOverlay, FRISBEE_CONFIG } from './FrisbeeOverlay.jsx'

export function PlayerSelectionView({ visiblePlayers, active, phase, onToggle, onSet, onFrisbeeDone, onBack }) {
  return (
    <Content>
      {phase === 'frisbee' && <FrisbeeOverlay onDone={onFrisbeeDone} />}
      <BackLink onClick={onBack}>← Matches</BackLink>
      <Grid $phase={phase} $dur={FRISBEE_CONFIG.totalDuration}>
        {visiblePlayers.map(p => {
          const isActive = active.has(p.id)
          return (
            <Card key={p.id} $active={isActive} onClick={() => phase === 'select' && onToggle(p.id)}>
              <BgNumber $active={isActive}>{p.playernumber}</BgNumber>
              <CardName $active={isActive}>{p.playername}</CardName>
            </Card>
          )
        })}
      </Grid>
      <FabStack>
        <Fab $primary onClick={onSet} disabled={active.size === 0}>
          SET
        </Fab>
      </FabStack>
    </Content>
  )
}
