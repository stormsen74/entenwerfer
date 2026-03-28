import { NavLink as RouterNavLink, useLocation } from 'react-router-dom'
import { NavBar, NavLink } from './styles'

const NAV_ITEMS = [
  // { to: '/', label: 'Home' },
  { to: '/players', label: 'Spieler' },
  { to: '/players/edit', label: 'Verwaltung' },
  { to: '/game', label: 'Spiel' },
]

const Nav = () => {
  const { pathname } = useLocation()

  return (
    <NavBar>
      {NAV_ITEMS.map(({ to, label }) => (
        <RouterNavLink key={to} to={to} style={{ textDecoration: 'none' }}>
          <NavLink as='span' $active={pathname === to}>
            {label}
          </NavLink>
        </RouterNavLink>
      ))}
    </NavBar>
  )
}

export default Nav
