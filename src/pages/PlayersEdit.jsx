import { useState } from 'react'
import styled from 'styled-components'
import { Content, Header, colors } from '../common/styles'
import usePlayers from '../hooks/usePlayers'

const Form = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 600px;
`

const Input = styled.input`
  flex: 1;
  min-width: 140px;
  padding: 0.5rem 0.75rem;
  background: ${colors.grey.dark};
  border: 1px solid ${colors.grey.medium};
  border-radius: 4px;
  color: #fff;
  font-size: 0.95rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${colors.green[55]};
  }
`

const Btn = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: inherit;
  background: ${props => (props.$variant === 'danger' ? '#c0392b' : colors.green[55])};
  color: #fff;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`

const PlayerTable = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  max-width: 600px;
`

const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${colors.grey.medium};

  &:last-child {
    border-bottom: none;
  }
`

const RowName = styled.span`
  flex: 1;
  color: #ccc;
`

const RowPos = styled.span`
  color: ${colors.green[55]};
  font-size: 0.85rem;
  min-width: 80px;
`

const POSITIONS = ['Handler', 'Cutter', 'Hybrid']

const EMPTY_FORM = { name: '', position: 'Handler' }

const PlayersEdit = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const handleAdd = e => {
    e.preventDefault()
    if (!form.name.trim()) return
    addPlayer(form)
    setForm(EMPTY_FORM)
  }

  const startEdit = player => {
    setEditingId(player.id)
    setEditData({ name: player.name, position: player.position })
  }

  const saveEdit = id => {
    if (!editData.name.trim()) return
    updatePlayer(id, editData)
    setEditingId(null)
  }

  const cancelEdit = () => setEditingId(null)

  const sorted = [...players].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Content>
      <Header>Spieler verwalten</Header>

      <Form onSubmit={handleAdd}>
        <Input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
        />
        <select
          value={form.position}
          onChange={e => setForm(prev => ({ ...prev, position: e.target.value }))}
          style={{
            padding: '0.5rem',
            background: colors.grey.dark,
            border: `1px solid ${colors.grey.medium}`,
            borderRadius: '4px',
            color: '#fff',
            fontFamily: 'inherit',
          }}
        >
          {POSITIONS.map(pos => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <Btn type="submit" disabled={!form.name.trim()}>
          Hinzufügen
        </Btn>
      </Form>

      <PlayerTable>
        {sorted.map(p => (
          <Row key={p.id}>
            {editingId === p.id ? (
              <>
                <Input
                  value={editData.name}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  style={{ flex: 1 }}
                />
                <select
                  value={editData.position}
                  onChange={e => setEditData(prev => ({ ...prev, position: e.target.value }))}
                  style={{
                    padding: '0.4rem',
                    background: colors.grey.dark,
                    border: `1px solid ${colors.grey.medium}`,
                    borderRadius: '4px',
                    color: '#fff',
                    fontFamily: 'inherit',
                  }}
                >
                  {POSITIONS.map(pos => (
                    <option key={pos} value={pos}>
                      {pos}
                    </option>
                  ))}
                </select>
                <Btn type="button" onClick={() => saveEdit(p.id)}>
                  Speichern
                </Btn>
                <Btn type="button" $variant="danger" onClick={cancelEdit}>
                  Abbrechen
                </Btn>
              </>
            ) : (
              <>
                <RowName>{p.name}</RowName>
                <RowPos>{p.position}</RowPos>
                <Btn type="button" onClick={() => startEdit(p)}>
                  Bearbeiten
                </Btn>
                <Btn type="button" $variant="danger" onClick={() => deletePlayer(p.id)}>
                  Löschen
                </Btn>
              </>
            )}
          </Row>
        ))}
      </PlayerTable>
    </Content>
  )
}

export default PlayersEdit
