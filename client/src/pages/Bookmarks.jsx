 import React, { useEffect, useState } from 'react'
 import api from '../services/api'

 export default function Bookmarks() {
   const [items, setItems] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')

   async function load() {
     setLoading(true)
     setError('')
     try {
       const { data } = await api.get('/bookmarks')
       setItems(Array.isArray(data) ? data : [])
     } catch (e) {
       setError('Failed to load bookmarks')
     } finally {
       setLoading(false)
     }
   }

   useEffect(() => {
     load()
   }, [])

   async function handleDelete(id) {
     try {
       await api.delete(`/bookmarks/${id}`)
       setItems((prev) => prev.filter((x) => x._id !== id))
     } catch (e) {
       alert('Failed to delete')
     }
   }

   return (
     <div>
       <h2>Bookmarks</h2>
       {loading && <div>Loading...</div>}
       {error && <div style={{ color: 'red' }}>{error}</div>}
       <div>
         {items.map((b) => {
           const start = b?.start_time ? new Date(b.start_time) : null
           const end = b?.end_time ? new Date(b.end_time) : null
           return (
             <div key={b._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
               <div style={{ fontWeight: 600 }}>{b.name}</div>
               <div style={{ fontSize: 12, color: '#666' }}>{b.site}</div>
               <div style={{ fontSize: 12 }}>
                 {start ? `Starts: ${start.toLocaleString()}` : ''}
                 {end ? `  •  Ends: ${end.toLocaleString()}` : ''}
               </div>
               {b.url && (
                 <a href={b.url} target="_blank" rel="noreferrer">Open</a>
               )}
               <div style={{ marginTop: 8 }}>
                 <button onClick={() => handleDelete(b._id)} style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: 6 }}>Delete</button>
               </div>
             </div>
           )
         })}
         {!loading && !error && items.length === 0 && <div>No bookmarks.</div>}
       </div>
     </div>
   )
 }
