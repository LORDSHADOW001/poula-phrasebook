import { useState } from 'react'

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

export default function AdminGate({ onUnlock }) {
  const [input, setInput] = useState('')
  const [wrongPassword, setWrongPassword] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (input && ADMIN_PASSWORD && input === ADMIN_PASSWORD) {
      sessionStorage.setItem('poula_admin_unlocked', 'true')
      setWrongPassword(false)
      onUnlock()
    } else {
      setWrongPassword(true)
    }
  }

  return (
    <form className="admin-gate" onSubmit={handleSubmit}>
      <input
        type="password"
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          setWrongPassword(false)
        }}
        placeholder="Admin password"
        autoFocus
      />
      <button type="submit">Unlock</button>
      {wrongPassword && <p className="admin-gate__error">Wrong password.</p>}
    </form>
  )
}
