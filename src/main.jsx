import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home.jsx'
import PlayersEdit from './pages/PlayersEdit.jsx'
import Game from './pages/Game.jsx'
import Nav from './common/Nav.jsx'
import './i18n.js'
import { GlobalStyle } from './common/styles.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <HashRouter>
      <Nav />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/players' element={<PlayersEdit />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </HashRouter>
  </StrictMode>
)
