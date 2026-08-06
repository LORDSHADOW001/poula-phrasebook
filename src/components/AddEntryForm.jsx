import { useState } from 'react'
import AudioRecorder from './AudioRecorder.jsx'

const CATEGORIES = ['greeting', 'family', 'food', 'daily life', 'nature', 'other']

export default function AddEntryForm({ onSubmit, contributorName, onContributorChange }) {
  const [poula, setPoula] = useState('')
  const [english, setEnglish] = useState('')
  const [category, setCategory] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)
  const [audioKey, setAudioKey] = useState(0) // used to reset the recorder after submit
  const [submitting, setSubmitting] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!poula.trim() || !english.trim()) return

    setSubmitting(true)
    await onSubmit({
      poula_text: poula.trim(),
      english_text: english.trim(),
      category: category || null,
      contributed_by: contributorName.trim() || null,
      audioBlob,
    })
    setSubmitting(false)
    setPoula('')
    setEnglish('')
    setCategory('')
    setAudioBlob(null)
    setAudioKey((k) => k + 1) // remounts AudioRecorder so it resets to idle
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add a phrase</h2>

      <label className="field">
        <span>Your name</span>
        <input
          type="text"
          value={contributorName}
          onChange={(e) => onContributorChange(e.target.value)}
          placeholder="So we know who to thank"
        />
      </label>

      <label className="field">
        <span>Poula</span>
        <input
          type="text"
          value={poula}
          onChange={(e) => setPoula(e.target.value)}
          placeholder="Phrase in Poula"
          required
          className="field--poula"
        />
      </label>

      <label className="field">
        <span>English</span>
        <input
          type="text"
          value={english}
          onChange={(e) => setEnglish(e.target.value)}
          placeholder="What it means"
          required
        />
      </label>

      <label className="field">
        <span>Category (optional)</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">— none —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="field">
        <span>Pronunciation (optional)</span>
        <AudioRecorder
          key={audioKey}
          onRecordingComplete={(blob) => setAudioBlob(blob)}
          onClear={() => setAudioBlob(null)}
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding…' : 'Add phrase'}
      </button>

      {justAdded && <p className="form-success">Added. Thank you.</p>}
    </form>
  )
}
