import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { NavBar, NavItem } from './styles'

const NAV_ITEMS = [
  { to: '/players', label: 'Spieler' },
  { to: '/game', label: 'Spiel' },
]

const Nav = () => {
  const { pathname } = useLocation()
  if (pathname === '/') return null

  return (
    <NavBar>
      {NAV_ITEMS.map(({ to, label }) => (
        <RouterNavLink key={to} to={to} style={{ textDecoration: 'none', flex: 1 }}>
          <NavItem $active={pathname === to}>{label}</NavItem>
        </RouterNavLink>
      ))}
    </NavBar>
  )
}

export default Nav
