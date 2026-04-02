import styled, { css, keyframes } from 'styled-components'
import { colors } from '../../common/styles.js'

export const cardFlicker = keyframes`
  0%   { opacity: 0; }
  90%  { opacity: 0; }
  100% { opacity: 1; }
`

export const flyDisk = keyframes`
  from { transform: translate(var(--from-x), var(--from-y)) rotate(0deg); }
  to   { transform: translate(var(--to-x), var(--to-y)) rotate(var(--rotation)); }
`

export const FrisbeeLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
`

export const FrisbeeDisc = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  pointer-events: none;
  will-change: transform;
  animation: ${flyDisk} var(--duration) linear var(--delay) 1 both;
`

export const Ente = styled.img`
  position: absolute;
  transform: translate3d(0, -50%, 0);
  width: 50px;
  height: 50px;
  pointer-events: none;
`

export const Ente2 = styled.div`
  position: absolute;
  transform: translate3d(0, -35px, 0);
  pointer-events: none;
  font-size: 26px;
`

export const BgNumber = styled.span`
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

export const CardName = styled.span`
  position: relative;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? colors.green[100] : '#aaa')};
  text-align: center;
  line-height: 1.3;
  transition: color 0.25s ease;
  z-index: 1;
`

// ─── Selection view styled components ────────────────────────────────────────

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
  ${({ $phase, $dur }) =>
    $phase === 'hiding'
      ? css`
          opacity: 0;
          transition: opacity 0.2s ease;
        `
      : $phase === 'frisbee'
        ? css`
            animation: ${cardFlicker} ${$dur}ms ease both;
          `
        : ''}
`

export const Card = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 14px;
  background: ${({ $active }) => ($active ? 'rgba(0, 255, 105, 0.07)' : '#111')};
  border: 1.5px solid ${({ $active }) => ($active ? colors.green[55] : '#222')};
  box-shadow: ${({ $active }) => ($active ? '0 0 12px rgba(0, 255, 105, 0.18)' : 'none')};
  cursor: pointer;
  min-height: 88px;
  transition: all 0.3s ease-in;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

export const Status = styled.p`
  font-size: 0.82rem;
  color: #444;
  margin: 0 0 1rem;
  align-self: flex-start;
`

// ─── Teams view styled components ────────────────────────────────────────────

export const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
  padding: 3.5rem;
`

export const TeamColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

export const TeamHeader = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #f5ab3c;
  text-align: center;
  margin-bottom: 0.25rem;
  min-height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
`

export const TeamCard = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  border-radius: 14px;
  background: ${({ $muted }) => ($muted ? '#0d0d0d' : 'rgba(0, 255, 105, 0.07)')};
  border: 1.5px solid ${({ $muted }) => ($muted ? '#1a1a1a' : colors.green[55])};
  box-shadow: ${({ $muted }) => ($muted ? 'none' : '0 0 12px rgba(0, 255, 105, 0.18)')};
  min-height: 88px;
  transition: all 0.3s ease-in;
`

// ─── Score input styled components ───────────────────────────────────────────

export const ScoreWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
  width: 100%;
  margin-top: 0.5rem;
`

export const ScoreField = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
`

export const ScoreLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #555;
  min-height: 40px;
`

export const ScoreInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 0.75rem;
  border-radius: 14px;
  background: #111;
  border: 1.5px solid #333;
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  font-family: inherit;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    border-color: ${colors.green[55]};
  }
`

export const SubmitRow = styled.div`
  width: 100%;
  margin-top: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

export const ReplayBtn = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 14px;
  border: 1.5px solid ${colors.green[55]};
  background: rgba(0, 255, 105, 0.1);
  color: ${colors.green[100]};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.25s ease 0.1s;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

export const SubmitBtn = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 14px;
  border: 1.5px solid ${colors.green[55]};
  background: rgba(0, 255, 105, 0.1);
  color: ${colors.green[100]};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition: all 0.25s ease;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`

// ─── Match list styled components ─────────────────────────────────────────────

export const MatchList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`

export const MatchCard = styled.div`
  border-radius: 14px;
  background: #111;
  border: 1.5px solid #222;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

export const MatchCardHeader = styled.div`
  padding: 1rem 1.25rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`

export const MatchHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MatchTitle = styled.span`
  font-size: 1.05rem;
  font-weight: 600;
  color: #e0e0e0;
`

export const MatchState = styled.span`
  font-size: 0.78rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

export const MatchHeaderScore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

export const MatchTeamLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #888;
`

export const MatchScoreText = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: ${colors.green[100]};
  letter-spacing: 0.04em;
`

export const MatchExpanded = styled.div`
  max-height: ${({ $open }) => ($open ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.28s ease;
`

export const MatchExpandedInner = styled.div`
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid #1a1a1a;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

export const MatchTeamCols = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.65rem;
`

export const MatchTeamCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

export const MatchTeamColHeader = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.3rem;
  min-height: 40px;
`

export const MatchPlayerItem = styled.div`
  font-size: 0.95rem;
  color: #999;
`

export const MatchExpandedActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MatchOpenBtn = styled.button`
  background: none;
  border: none;
  color: #555;
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

export const MatchReplayBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
  background: #0d1f10;
  color: #55c46e;
  border: 1px solid #1a3a1f;

  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

export const MatchDeleteBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s;
  background: #2a1010;
  color: #e05555;
  border: 1px solid #3a1515;

  &:hover {
    opacity: 0.75;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`

// ─── Shared UI ────────────────────────────────────────────────────────────────

export const BackLink = styled.button`
  position: fixed;
  z-index: 100;
  top: 1.25rem;
  left: 1.25rem;
  align-self: flex-start;
  background: none;
  border: none;
  color: #555;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.25rem;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`

export const EmptyNote = styled.p`
  color: #555;
  font-size: 1rem;
  margin-top: 2rem;
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
  padding: 0 1.5rem;
  height: 52px;
  border-radius: 26px;
  border: 1.5px solid
    ${({ $primary, $danger }) => ($danger ? 'rgba(255, 60, 60, 0.55)' : $primary ? colors.green[55] : '#333')};
  background: ${({ $primary, $danger }) => ($danger ? 'rgba(0, 0, 0, 0.5)' : $primary ? 'rgba(0, 0, 0, 0.5)' : '#111')};
  color: ${({ $primary, $danger }) => ($danger ? 'rgba(255, 90, 90, 1)' : $primary ? colors.green[100] : '#666')};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transition:
    background 0.18s ease,
    border-color 0.18s ease;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`
