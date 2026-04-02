import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Content } from '../../common/styles.js'
import usePlayers from '../../hooks/usePlayers.js'
import {
  Actions,
  AddBtn,
  Btn,
  Chevron,
  Fab,
  FabStack,
  Form,
  IconBtn,
  Input,
  PlayerHeader,
  PlayerItem,
  PlayerList,
  PlayerMeta,
  PlayerName,
  PlayerRow,
} from './styles.js'

const EMPTY_FORM = { name: '', playername: '', playernumber: '', birthyear: '', size: '' }

const Players = () => {
  const { players, addPlayer, updatePlayer, deletePlayer } = usePlayers()
  const [form, setForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = id => setExpandedId(prev => (prev === id ? null : id))

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
      birthyear: player.birthyear ?? '',
      size: player.size ?? '',
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
      {!adding && (
        <>
          <Link
            to='/game'
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
            aria-label='Zum Spiel'
          />
          <FabStack>
            <Fab onClick={() => setAdding(true)}>+ Player</Fab>
          </FabStack>
        </>
      )}

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
          <Input
            placeholder='birthyear'
            value={form.birthyear}
            onChange={e => setForm(prev => ({ ...prev, birthyear: e.target.value }))}
          />
          <Input
            placeholder='size in cm'
            value={form.size}
            onChange={e => setForm(prev => ({ ...prev, size: e.target.value }))}
          />
          <Actions>
            <AddBtn type='submit' disabled={!form.playername.trim()}>
              ADD PLAYER
            </AddBtn>
            <Btn
              type='button'
              onClick={() => {
                setAdding(false)
                setForm(EMPTY_FORM)
              }}
            >
              EXIT
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
                  placeholder='name'
                  value={editData.name}
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  placeholder='playername'
                  value={editData.playername}
                  onChange={e => setEditData(prev => ({ ...prev, playername: e.target.value }))}
                />
                <Input
                  placeholder='playernumber'
                  value={editData.playernumber}
                  onChange={e => setEditData(prev => ({ ...prev, playernumber: e.target.value }))}
                />
                <Input
                  placeholder='birthyear'
                  value={editData.birthyear}
                  onChange={e => setEditData(prev => ({ ...prev, birthyear: e.target.value }))}
                />
                <Input
                  placeholder='size in cm'
                  value={editData.size}
                  onChange={e => setEditData(prev => ({ ...prev, size: e.target.value }))}
                />
                <Actions style={{ paddingLeft: 0, marginTop: '1rem' }}>
                  <Btn type='button' onClick={() => saveEdit(p.id)}>
                    SAVE
                  </Btn>
                  <Btn type='button' onClick={() => setEditingId(null)}>
                    EXIT
                  </Btn>
                </Actions>
              </>
            ) : (
              <PlayerItem muted={p.muted}>
                <PlayerHeader onClick={() => toggleExpand(p.id)}>
                  <PlayerMeta>
                    <PlayerName>{p.playername + ' ' + p.playernumber}</PlayerName>
                  </PlayerMeta>
                  <Chevron $open={expandedId === p.id}>▼</Chevron>
                </PlayerHeader>
                {expandedId === p.id && (
                  <Actions>
                    <IconBtn
                      type='button'
                      $v={p.muted ? 'danger' : 'active'}
                      title={p.muted ? 'Gesperrt' : 'Aktiv'}
                      onClick={() => updatePlayer(p.id, { muted: !p.muted })}
                    >
                      <svg
                        viewBox='0 0 16 16'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        {p.muted ? (
                          <path d='M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM5 8h6' />
                        ) : (
                          <path d='M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM5.5 8l2 2 3-3' />
                        )}
                      </svg>
                    </IconBtn>
                    <IconBtn type='button' title='Bearbeiten' onClick={() => startEdit(p)}>
                      <svg
                        viewBox='0 0 16 16'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      >
                        <path d='M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z' />
                      </svg>
                    </IconBtn>
                    <IconBtn type='button' $v='danger' title='Löschen' onClick={() => deletePlayer(p.id)}>
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
                    </IconBtn>
                  </Actions>
                )}
              </PlayerItem>
            )}
          </PlayerRow>
        ))}
      </PlayerList>
    </Content>
  )
}

export default Players
