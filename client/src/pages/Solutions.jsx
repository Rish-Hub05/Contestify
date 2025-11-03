 import React, { useEffect, useState } from 'react'
 import api from '../services/api'

 export default function Solutions() {
   const [items, setItems] = useState([])
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState('')
   const [contestName, setContestName] = useState('')
   const [youtubeLink, setYoutubeLink] = useState('')

   async function load() {
     setLoading(true)
     setError('')
     try {
       const { data } = await api.get('/solutions')
       setItems(Array.isArray(data) ? data : [])
     } catch (e) {
       setError('Failed to load solutions')
     } finally {
       setLoading(false)
     }
   }

   useEffect(() => {
     load()
   }, [])

   async function handleAdd(e) {
     e.preventDefault()
     try {
       const { data } = await api.post('/solutions', { contestName, youtubeLink })
       setItems((prev) => [data, ...prev])
       setContestName('')
       setYoutubeLink('')
     } catch (e) {
       alert('Failed to add solution')
     }
   }

   async function handleDelete(id) {
     try {
       await api.delete(`/solutions/${id}`)
       setItems((prev) => prev.filter((x) => x._id !== id))
     } catch (e) {
       alert('Failed to delete')
     }
   }

   return (
     <div>
       <h2>Solutions</h2>
       <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
         <input
           type="text"
           placeholder="Contest name"
           value={contestName}
           onChange={(e) => setContestName(e.target.value)}
           style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
           required
         />
         <input
           type="url"
           placeholder="YouTube link"
           value={youtubeLink}
           onChange={(e) => setYoutubeLink(e.target.value)}
           style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}
           required
         />
         <button type="submit" style={{ padding: '8px 12px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: 6 }}>Add</button>
       </form>

       {loading && <div>Loading...</div>}
       {error && <div style={{ color: 'red' }}>{error}</div>}

       <div>
         {items.map((s) => (
           <div key={s._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 8 }}>
             <div style={{ fontWeight: 600 }}>{s.contestName}</div>
             <div>
               <a href={s.youtubeLink} target="_blank" rel="noreferrer">{s.youtubeLink}</a>
             </div>
             <div style={{ marginTop: 8 }}>
               <button onClick={() => handleDelete(s._id)} style={{ padding: '6px 10px', border: '1px solid #ccc', background: '#fff', cursor: 'pointer', borderRadius: 6 }}>Delete</button>
             </div>
           </div>
         ))}
         {!loading && !error && items.length === 0 && <div>No solutions yet.</div>}
       </div>
     </div>
   )
 }
