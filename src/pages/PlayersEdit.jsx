import { useState } from 'react'
import styled from 'styled-components'
import { Content, Header, colors } from '../common/styles'
import usePlayers from '../hooks/usePlayers'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
  width: 100%;
`

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1rem;
  background: #141414;
  border: 1px solid #252525;
  border-radius: 10px;
  color: #fff;
  font-size: 1rem;
  font-family: inherit;
  min-height: 48px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors.green[55]};
  }

  &::placeholder {
    color: #444;
  }
`

const DisabledInput = styled(Input)`
  opacity: 0.5;
  cursor: not-allowed;
`

const Btn = styled.button`
  padding: 0 1.1rem;
  min-height: 48px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9rem;
  font-family: inherit;
  font-weight: 500;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;

  background: ${({ $v }) => ($v === 'danger' ? '#2a1010' : $v === 'ghost' ? '#181818' : colors.green[25])};
  color: ${({ $v }) => ($v === 'danger' ? '#e05555' : $v === 'ghost' ? '#666' : colors.green[100])};
  border: 1px solid ${({ $v }) => ($v === 'danger' ? '#3a1515' : $v === 'ghost' ? '#252525' : colors.green[55])};

  &:hover {
    opacity: 0.75;
  }

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

const AddBtn = styled(Btn)`
  width: 100%;
  min-height: 52px;
  font-size: 1rem;
`

const PlayerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

const PlayerRow = styled.li`
  padding: 0.8rem 0;
  border-bottom: 1px solid #1a1a1a;

  &:last-child {
    border-bottom: none;
  }
`

const PlayerInfo = styled.div`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #426135;
  border-radius: 10px;
`

const PlayerName = styled.span`
  flex: 1;
  font-size: 1.25rem;
  color: #ccc;
`

const Actions = styled.div`
  display: flex;
  gap: 0.4rem;
  margin-top: 0.4rem;
`

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
  background: ${({ $v }) => ($v === 'danger' ? '#2a1010' : '#181818')};
  color: ${({ $v }) => ($v === 'danger' ? '#e05555' : '#555')};
  border: 1px solid ${({ $v }) => ($v === 'danger' ? '#3a1515' : '#252525')};

  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 1rem;
`

const PlusBtn = styled.button`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid ${colors.green[55]};
  background: ${colors.green[25]};
  color: ${colors.green[100]};
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.75;
  }
`

const EMPTY_FORM = { name: '', playername: '', playernumber: '', level: '', position: '' }

const PlayersEdit = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const [form, setForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const handleAdd = e => {
    e.preventDefault()
    if (!form.playername.trim()) return
    addPlayer(form)
    setForm(EMPTY_FORM)
    setAdding(false)
  }

  const startEdit = player => {
    setEditingId(player.id)
    setEditData({
      name: player.name ?? '',
      playername: player.playername ?? '',
      playernumber: player.playernumber ?? '',
      level: player.level ?? '',
      position: player.position ?? '',
    })
  }

  const saveEdit = id => {
    if (!editData.playername.trim()) return
    updatePlayer(id, editData)
    setEditingId(null)
  }

  const sorted = [...players].sort((a, b) => Number(a.playernumber) - Number(b.playernumber))

  return (
    <Content>
      <TopBar>{!adding && <PlusBtn onClick={() => setAdding(true)}>+</PlusBtn>}</TopBar>

      {adding && (
        <Form onSubmit={handleAdd}>
          <Input
            placeholder='name'
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <Input
            placeholder='playername'
            value={form.playername}
            onChange={e => setForm(prev => ({ ...prev, playername: e.target.value }))}
          />
          <Input
            placeholder='playernumber'
            value={form.playernumber}
            onChange={e => setForm(prev => ({ ...prev, playernumber: e.target.value }))}
          />
          <DisabledInput placeholder='level' value={form.level} disabled />
          <DisabledInput placeholder='position' value={form.position} disabled />
          <Actions>
            <AddBtn type='submit' disabled={!form.playername.trim()}>
              Hinzufügen
            </AddBtn>
            <Btn
              type='button'
              $v='ghost'
              onClick={() => {
                setAdding(false)
                setForm(EMPTY_FORM)
              }}
            >
              Abbrechen
            </Btn>
          </Actions>
        </Form>
      )}

      <PlayerList>
        {sorted.map(p => (
          <PlayerRow key={p.id}>
            {editingId === p.id ? (
              <>
                <Input
                  placeholder='Max Schnattermann'
                  value={editData.name}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder='Entenwerfer'
                  value={editData.playername}
                  onChange={e => setEditData(prev => ({ ...prev, playername: e.target.value }))}
                />
                <Input
                  placeholder='9'
                  value={editData.playernumber}
                  onChange={e => setEditData(prev => ({ ...prev, playernumber: e.target.value }))}
                />
                <DisabledInput placeholder='Level' value={editData.level} disabled />
                <DisabledInput placeholder='Position' value={editData.position} disabled />
                <Actions style={{ paddingLeft: 0, marginTop: '0.5rem' }}>
                  <Btn type='button' onClick={() => saveEdit(p.id)}>
                    Speichern
                  </Btn>
                  <Btn type='button' $v='ghost' onClick={() => setEditingId(null)}>
                    Abbrechen
                  </Btn>
                </Actions>
              </>
            ) : (
              <>
                <PlayerInfo>
                  <PlayerName>
                    {p.playername} {p.playernumber}
                  </PlayerName>
                </PlayerInfo>
                <Actions>
                  <IconBtn type='button' title='Bearbeiten' onClick={() => startEdit(p)}>
                    <svg viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z'/>
                    </svg>
                  </IconBtn>
                  <IconBtn type='button' $v='danger' title='Löschen' onClick={() => deletePlayer(p.id)}>
                    <svg viewBox='0 0 16 16' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M2 4h12M5 4V2.5h6V4M6 7v5M10 7v5M3 4l1 9.5h8L13 4'/>
                    </svg>
                  </IconBtn>
                </Actions>
              </>
            )}
          </PlayerRow>
        ))}
      </PlayerList>
    </Content>
  )
}

export default PlayersEdit
