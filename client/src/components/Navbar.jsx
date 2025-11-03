 import React from 'react'

 export default function Navbar() {
   return (
     <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #eee' }}>
       <a href="/">Home</a>
       <a href="/bookmarks">Bookmarks</a>
       <a href="/solutions">Solutions</a>
     </nav>
   )
 }
