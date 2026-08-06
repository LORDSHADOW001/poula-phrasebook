import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient.js'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import EntryList from './components/EntryList.jsx'
import AddEntryForm from './components/AddEntryForm.jsx'

export default function App() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [error, setError] = useState(null)
  const [contributorName, setContributorName] = useState(
    () => localStorage.getItem('poula_contributor_name') || ''
  )

  useEffect(() => {
    localStorage.setItem('poula_contributor_name', contributorName)
  }, [contributorName])

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    setLoading(true)
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEntries(data)
      setError(null)
    }
    setLoading(false)
  }

  async function handleAddEntry({ audioBlob, ...newEntry }) {
    let audio_url = null

    if (audioBlob) {
      const fileName = `${crypto.randomUUID()}.webm`
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, audioBlob, { contentType: 'audio/webm' })

      if (uploadError) {
        setError(`Audio upload failed: ${uploadError.message}`)
        // Still save the text entry even if the audio upload failed —
        // don't lose the phrase over a recording problem.
      } else {
        const { data: urlData } = supabase.storage.from('audio').getPublicUrl(fileName)
        audio_url = urlData.publicUrl
      }
    }

    const { data, error } = await supabase
      .from('entries')
      .insert({ ...newEntry, audio_url })
      .select()

    if (error) {
      setError(error.message)
      return
    }
    setEntries((prev) => [data[0], ...prev])
  }

  async function handleVerify(id) {
    const { error } = await supabase
      .from('entries')
      .update({ verified: true })
      .eq('id', id)

    if (error) {
      setError(error.message)
      return
    }
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, verified: true } : e))
    )
  }

  const filteredEntries = useMemo(() => {
    if (!query.trim()) return entries
    const q = query.trim().toLowerCase()
    return entries.filter(
      (e) =>
        e.poula_text.toLowerCase().includes(q) ||
        e.english_text.toLowerCase().includes(q)
    )
  }, [entries, query])

  return (
    <div className="page">
      <Header />

      <main className="main">
        {error && (
          <div className="error-banner">
            Something went wrong talking to the database: {error}
            <br />
            Double check your .env file has the right Supabase URL and key.
          </div>
        )}

        <section className="browse-section">
          <SearchBar value={query} onChange={setQuery} />
          <p className="count-text">
            {loading ? '\u00A0' : `${filteredEntries.length} phrase${filteredEntries.length === 1 ? '' : 's'}`}
          </p>
          <EntryList entries={filteredEntries} loading={loading} onVerify={handleVerify} />
        </section>

        <section className="add-section">
          <AddEntryForm
            onSubmit={handleAddEntry}
            contributorName={contributorName}
            onContributorChange={setContributorName}
          />
        </section>
      </main>

      <footer className="footer">
        <p>A living record of Poula, made by its speakers.</p>
      </footer>
    </div>
  )
}
