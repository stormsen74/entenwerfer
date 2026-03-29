import { useState } from 'react'
import styled from 'styled-components'
import { Content, Header, colors } from '../common/styles'
import usePlayers from '../hooks/usePlayers'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
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

const Status = styled.p`
  font-size: 0.82rem;
  color: #444;
  margin: 0 0 1rem;
  align-self: flex-start;
`

const EmptyNote = styled.p`
  color: #555;
  font-size: 1rem;
  margin-top: 2rem;
`

const Game = () => {
  const { players } = usePlayers()
  const [active, setActive] = useState(new Set())

  const toggle = id =>
    setActive(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const sorted = [...players].sort((a, b) => Number(a.playernumber) - Number(b.playernumber))

  return (
    <Content>
      {/*<Header>Spiel</Header>*/}
      {sorted.length === 0 ? (
        <EmptyNote>Keine Spieler vorhanden.</EmptyNote>
      ) : (
        <>
          <Status>
            {active.size} / {sorted.length} aktiv
          </Status>
          <Grid>
            {sorted.map(p => {
              const isActive = active.has(p.id)
              return (
                <Card key={p.id} $active={isActive} onClick={() => toggle(p.id)}>
                  <BgNumber $active={isActive}>{p.playernumber}</BgNumber>
                  <CardName $active={isActive}>{p.playername}</CardName>
                </Card>
              )
            })}
          </Grid>
        </>
      )}
    </Content>
  )
}

export default Game
