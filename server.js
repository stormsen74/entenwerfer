import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data', 'players.json')

const app = express()
app.use(express.json())

app.get('/api/players', (_req, res) => {
  const players = JSON.parse(readFileSync(DATA_FILE, 'utf-8'))
  res.json(players)
})

app.post('/api/players', (req, res) => {
  writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2))
  res.json({ ok: true })
})

// Statische Dateien im Produktionsbetrieb
if (existsSync(join(__dirname, 'dist'))) {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, 'dist', 'index.html'))
  })
}

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API-Server läuft auf Port ${PORT}`)
})
