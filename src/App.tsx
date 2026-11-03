import { useEffect, useState } from 'react'
import CatalogHeader from './components/CatalogHeader'
import CatalogIntro from './components/CatalogIntro'
import PhoneTable from './components/PhoneTable'
import type { Telefon } from './types/phone'

function App() {
  const [telefonok, setTelefonok] = useState<Telefon[]>([])
  const [betoltes, setBetoltes] = useState(true)
  const [novekvo, setNovekvo] = useState(true)
  const [hiba, setHiba] = useState<string | null>(null)

  useEffect(() => {
    console.log('1. useEffect: minden render után')
  })

  useEffect(() => {
    const controller = new AbortController()

    async function telefonokBetoltese() {
      try {
        console.log('2. useEffect: csak az első render után')
        const response = await fetch('/phones.json', { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`A telefonok betöltése nem sikerült (${response.status}).`)
        }

        const data: Telefon[] = await response.json()
        setTelefonok(data)
      } catch (error) {
        if (controller.signal.aborted) return
        setHiba(error instanceof Error ? error.message : 'Ismeretlen hiba történt.')
      } finally {
        if (!controller.signal.aborted) setBetoltes(false)
      }
    }

    void telefonokBetoltese()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    console.log('3. useEffect: telefonok vagy rendezési irány változott')
    document.title = `Mobilkatalógus (${telefonok.length}) · ${novekvo ? 'A–Z' : 'Z–A'}`
  }, [telefonok, novekvo])

  const rendezettTelefonok = [...telefonok].sort((a, b) =>
    novekvo
      ? a.nev.localeCompare(b.nev, 'hu')
      : b.nev.localeCompare(a.nev, 'hu'),
  )

  return (
    <main>
      <CatalogHeader />
      <section aria-labelledby="page-title">
        <CatalogIntro />
        <PhoneTable
          phones={rendezettTelefonok}
          loading={betoltes}
          error={hiba}
          ascending={novekvo}
          onToggleSort={() => setNovekvo((irany) => !irany)}
        />
        <footer>Készülékadatok egy helyen.</footer>
      </section>
    </main>
  )
}

export default App
