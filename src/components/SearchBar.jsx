export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search in Poula or English…"
        aria-label="Search phrases"
      />
    </div>
  )
}
