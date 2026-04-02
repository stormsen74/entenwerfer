import styled from 'styled-components'
import { colors } from '../../common/styles.js'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 2rem;
  width: 100%;
`

export const Input = styled.input`
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
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${colors.green[55]};
  }

  &::placeholder {
    color: #444;
  }
`

export const DisabledInput = styled(Input)`
  opacity: 0.5;
  cursor: not-allowed;
`

export const Btn = styled.button`
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

export const AddBtn = styled(Btn)`
  width: 100%;
  min-height: 52px;
  font-size: 1rem;
`

export const PlayerList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
`

export const PlayerRow = styled.li`
  padding: 0.8rem 0;
  //border-bottom: 1px solid #1a1a1a;

  &:last-child {
    //border-bottom: none;
  }
`

export const PlayerItem = styled.div`
  border: 1px solid ${({ muted }) => (muted ? '#f53c3c' : '#f5ab3c')};
  border-radius: 10px;
  overflow: hidden;
  background: rgba(75, 95, 75, 0.45);
  opacity: ${({ muted }) => (muted ? 0.65 : 1)};
  transition: all 0.2s ease-in-out;
`

export const PlayerHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.3rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  -webkit-tap-highlight-color: transparent;
  color: inherit;
  font-family: inherit;
`

export const PlayerMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  //width: 100%;
  //align-items: center;
`

export const PlayerName = styled.span`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ccc;
`

export const PlayerNumber = styled.span`
  font-size: 0.9rem;
  color: #888;
`

export const Chevron = styled.span`
  color: #555;
  font-size: 0.75rem;
  transition: transform 0.2s ease;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
`

export const Actions = styled.div`
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  justify-content: flex-end;
`

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
  background: ${({ $v }) => ($v === 'danger' ? '#2a1010' : $v === 'active' ? colors.green[25] : '#181818')};
  color: ${({ $v }) => ($v === 'danger' ? '#e05555' : $v === 'active' ? colors.green[100] : '#555')};
  border: 1px solid ${({ $v }) => ($v === 'danger' ? '#3a1515' : $v === 'active' ? colors.green[55] : '#252525')};

  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

export const FabStack = styled.div`
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.65rem;
  z-index: 90;
`

export const Fab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.25rem;
  height: 52px;
  border-radius: 26px;
  border: 1.5px solid ${colors.green[55]};
  background: rgba(0, 255, 105, 0.1);
  color: ${colors.green[100]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;
`
