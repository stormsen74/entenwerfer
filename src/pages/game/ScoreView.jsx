import { Content } from '../../common/styles.js'
import {
  BackLink,
  Fab,
  FabStack,
  ReplayBtn,
  ScoreField,
  ScoreInput,
  ScoreLabel,
  ScoreWrapper,
  SubmitBtn,
  SubmitRow,
} from './styles.js'

export function ScoreView({ teams, score, setScore, onSubmit, onReplay, onBack }) {
  const canSubmit = score.alpha !== '' && score.beta !== ''

  return (
    <Content>
      <BackLink onClick={onBack}>← Matches</BackLink>
      <ScoreWrapper>
        {teams.map((team, i) => {
          const key = i === 0 ? 'alpha' : 'beta'
          return (
            <ScoreField key={team.name}>
              <ScoreLabel>{team.name}</ScoreLabel>
              <ScoreInput
                type='number'
                inputMode='numeric'
                min='0'
                value={score[key]}
                onChange={e => setScore(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder='0'
              />
            </ScoreField>
          )
        })}
      </ScoreWrapper>
      <SubmitRow>
        <SubmitBtn onClick={onSubmit} disabled={!canSubmit}>
          SAVE
        </SubmitBtn>
        <ReplayBtn onClick={onReplay} disabled={!canSubmit}>
          <svg
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            width='16'
            height='16'
          >
            <path d='M2 8a6 6 0 1 0 1.5-3.9' />
            <path d='M2 3.5V8h4.5' />
          </svg>
          REPLAY
        </ReplayBtn>
      </SubmitRow>
    </Content>
  )
}
