import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Bookmarks from './pages/Bookmarks'
import Solutions from './pages/Solutions'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/solutions" element={<Solutions />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
