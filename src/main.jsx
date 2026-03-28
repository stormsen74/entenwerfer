import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './Home.jsx'
import Players from './pages/Players.jsx'
import PlayersEdit from './pages/PlayersEdit.jsx'
import Game from './pages/Game.jsx'
import Nav from './common/Nav.jsx'
import './i18n.js'
import { GlobalStyle } from './common/styles.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyle />
    <BrowserRouter>
      {/*<Nav />*/}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/players' element={<Players />} />
        <Route path='/players/edit' element={<PlayersEdit />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
