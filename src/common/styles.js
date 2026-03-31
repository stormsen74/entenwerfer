import styled, { createGlobalStyle, css, keyframes } from 'styled-components'
import { normalize } from 'styled-normalize'
import { defaultTextStyle } from './text'

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  html, body, #root {
    margin: 0;
    padding: 0;
    width: 100%;
    overflow-x: hidden;
    background-color: black;
    color: rgba(255, 255, 255, 0.87);
    font-family: "Ubuntu", sans-serif;
  }
`

export const colors = {
  grey: { light: '#A7A7A7', medium: '#333333', dark: '#191919' },
  green: {
    25: 'rgba(0, 255, 105, 0.25)',
    55: 'rgba(0, 255, 105, 0.55)',
    100: 'rgba(0, 255, 105, 1)',
  },
}

export const easings = {
  easeOutStrong: `cubic-bezier(0.12, 0.2, 0.09, 0.99)`,
}

export const defaultContentStyle = css`
  ${defaultTextStyle};
  padding: 75px 25px;
  color: ${colors.grey.dark};
`

export const BackgroundImage = styled.div`
  height: ${props => (!props.fullHeight ? props.height + 'px' : '100%')};
  background-image: url(${props => props.src});
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  margin: ${props => props.margin || 0};
`

export const opacityFadeIn = keyframes`
  from {opacity: 0}
  to {opacity: 1}
`

export const Debug = styled.div`
  border: ${props => (props.debug ? '1px solid' + props.color : null)};
`

//------------------------------------------//
export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

export const ToggleLang = styled.div`
  position: absolute;
  right: 0;
  font-size: 1.2em;
  border-radius: 5px;
  width: 45px;
  height: 45px;
  margin: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  cursor: pointer;
`

export const Content = styled.div`
  padding: 1.75rem 1.25rem 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  box-sizing: border-box;
`

export const Header = styled.h1`
  font-size: 2.3rem;
  color: #fff;
  text-align: center;
`

export const Headline = styled.h1`
  text-align: center;
`

export const Text = styled.div`
  font-size: 1.3rem;
  color: #ccc;
  text-align: center;

  margin-bottom: 1.5rem;
`

export const SvgImage = styled.img`
  min-width: 320px;
  width: 30vw;
  height: auto;
  margin-top: 20px;
`

export const StyledLink = styled.a`
  color: #eeab49;
  font-weight: bold;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #ff6f61;
    text-decoration: underline;
  }

  &:active {
    color: #ff6f61;
  }
`

export const Separator = styled.hr`
  width: 100%;
  border: none;
  border-top: 1px solid #444;
  margin: 1rem 0;
`

export const Footer = styled.div`
  font-size: 0.8em;
  display: flex;
  width: 100%;
  color: #444;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  text-align: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

export const FooterLeft = styled.div`
  text-align: left;
  margin-bottom: 15px;
  @media (max-width: 768px) {
    text-align: center;
  }
`

export const FooterRight = styled.div`
  text-align: right;
  @media (max-width: 768px) {
    text-align: center;
  }
`

//------------------------------------------//
export const NavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 58px;
  background-color: #0d0d0d;
  border-top: 1px solid #1e1e1e;
  display: flex;
  align-items: stretch;
  z-index: 100;
`

export const NavItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${props => (props.$active ? colors.green[100] : '#555')};
  font-size: 0.82rem;
  font-weight: ${props => (props.$active ? '600' : '400')};
  letter-spacing: 0.02em;
  border-top: 2px solid ${props => (props.$active ? colors.green[100] : 'transparent')};
  transition:
    color 0.2s ease,
    border-color 0.18s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
`
