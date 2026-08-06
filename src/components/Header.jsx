export default function Header() {
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
          Built with Poula speakers, one phrase at a time.
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
