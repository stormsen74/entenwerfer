import styled from 'styled-components'
import { Content, Header, colors } from '../common/styles'
import usePlayers from '../hooks/usePlayers'

const PlayerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px;
`

const PlayerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${colors.grey.medium};
  color: #ccc;
  font-size: 1rem;

  &:last-child {
    border-bottom: none;
  }
`

const Position = styled.span`
  color: ${colors.green[55]};
  font-size: 0.85rem;
`

const EmptyNote = styled.p`
  color: ${colors.grey.light};
  font-size: 1rem;
`

const Players = () => {
  const { players } = usePlayers()
  const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Content>
      <Header>Spieler</Header>
      {sorted.length === 0 ? (
        <EmptyNote>Noch keine Spieler vorhanden.</EmptyNote>
      ) : (
        <PlayerList>
          {sorted.map(p => (
            <PlayerItem key={p.id}>
              <span>{p.name}</span>
              <Position>{p.position}</Position>
            </PlayerItem>
          ))}
        </PlayerList>
      )}
    </Content>
  )
}

export default Players
