import type { Telefon } from '../types/phone'

type PhoneTableProps = {
  phones: Telefon[]
  loading: boolean
  error: string | null
  ascending: boolean
  onToggleSort: () => void
}

const arFormatter = new Intl.NumberFormat('hu-HU')

function PhoneTable({ phones, loading, error, ascending, onToggleSort }: PhoneTableProps) {
  return (
    <section aria-label="Telefonok listája">
      <div>
        <h2>Összes telefon</h2>
        <p>{loading ? 'Adatok betöltése…' : `${phones.length} készülék a katalógusban`}</p>
        <button
          type="button"
          onClick={onToggleSort}
          aria-label={`Rendezés ${ascending ? 'csökkenő' : 'növekvő'} névsorrendbe`}
        >
          Név szerint {ascending ? 'növekvő ↑' : 'csökkenő ↓'}
        </button>
      </div>

      {error ? (
        <div role="alert">
          <div>
            <strong>Nem sikerült betölteni az adatokat</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : loading ? (
        <p role="status">Telefonok betöltése…</p>
      ) : phones.length === 0 ? (
        <p role="status">Jelenleg nincs megjeleníthető telefon.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">Telefon</th>
              <th scope="col">Gyártó</th>
              <th scope="col">Ár</th>
              <th scope="col">Memória</th>
              <th scope="col">Tárhely</th>
              <th scope="col">Kijelző</th>
              <th scope="col">Rendszer</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id}>
                <td>{phone.nev}</td>
                <td>{phone.gyarto}</td>
                <td>{arFormatter.format(phone.ar)} Ft</td>
                <td>{phone.memoria} GB</td>
                <td>{phone.tarhely} GB</td>
                <td>{phone.kijelzo.toLocaleString('hu-HU')}″</td>
                <td>{phone.operaciosRendszer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p>Az árak magyar forintban értendők.</p>
    </section>
  )
}

export default PhoneTable
