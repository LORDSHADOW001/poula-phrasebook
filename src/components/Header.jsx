export default function Header({ variant = 'public' }) {
  if (variant === 'admin') {
    return (
      <header className="header header--admin">
        <div className="stripe-band" aria-hidden="true">
          <span className="stripe stripe--gold" />
          <span className="stripe stripe--red" />
          <span className="stripe stripe--gold" />
        </div>
        <div className="header__content header__content--compact">
          <p className="eyebrow">Admin view</p>
          <h1 className="header__title--compact">Poula Phrasebook</h1>
        </div>
      </header>
    )
  }

  return (
    <header className="header">
      <div className="stripe-band" aria-hidden="true">
        <span className="stripe stripe--gold" />
        <span className="stripe stripe--red" />
        <span className="stripe stripe--gold" />
      </div>
      <div className="header__content">
        <p className="eyebrow">Poumai Naga · Manipur &amp; Nagaland</p>
        <h1>
          Poula <span className="header__accent">Phrasebook</span>
        </h1>
        <p className="header__sub">
          Help keep the language alive — add a phrase you know, in your own words.
        </p>
      </div>
      <div className="stripe-band" aria-hidden="true">
        <span className="stripe stripe--red" />
        <span className="stripe stripe--gold" />
        <span className="stripe stripe--red" />
      </div>
    </header>
  )
}
