export default function EntryCard({ entry, onVerify }) {
  return (
    <article className={`entry-card${entry.verified ? ' entry-card--verified' : ''}`}>
      <div className="entry-card__text">
        <p className="entry-card__poula">{entry.poula_text}</p>
        <p className="entry-card__english">{entry.english_text}</p>
        {entry.audio_url && (
          <audio className="entry-card__audio" controls src={entry.audio_url} />
        )}
      </div>
      <div className="entry-card__meta">
        {entry.category && <span className="tag">{entry.category}</span>}
        {entry.contributed_by && (
          <span className="entry-card__by">added by {entry.contributed_by}</span>
        )}
        {entry.verified ? (
          <span className="badge badge--verified">✓ verified</span>
        ) : (
          <button className="badge badge--pending" onClick={() => onVerify(entry.id)}>
            mark verified
          </button>
        )}
      </div>
    </article>
  )
}
