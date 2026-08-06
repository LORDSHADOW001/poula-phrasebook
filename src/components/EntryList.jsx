import EntryCard from './EntryCard.jsx'

export default function EntryList({ entries, loading, onVerify }) {
  if (loading) {
    return <p className="status-text">Loading phrases…</p>
  }

  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <p>No phrases here yet.</p>
        <p className="empty-state__sub">Be the first to add one below.</p>
      </div>
    )
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} onVerify={onVerify} />
      ))}
    </div>
  )
}
