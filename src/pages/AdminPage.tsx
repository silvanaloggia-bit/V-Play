import { useState } from 'react'
import MovieTable from '../components/admin/MovieTable'
import TopsPanel from '../components/admin/TopsPanel'
import TrendsPanel from '../components/admin/TrendsPanel'
import { initialData } from '../data/initialData'
import styles from './AdminPage.module.css'

const TABS = [
  { id: 'titulos', label: 'Títulos', icon: 'bi-collection' },
  { id: 'tops', label: 'Tops', icon: 'bi-trophy' },
  { id: 'tendencias', label: 'Tendencias', icon: 'bi-graph-up-arrow' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabId>('titulos')

  return (
    <div className={styles.page}>
      <main className={`container ${styles.main}`}>
        <h1 className={styles.title}>Panel — Películas y Series</h1>

        <nav className={styles.tabs} aria-label="Secciones del panel">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${
                activeTab === tab.id ? styles.tabActive : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bi ${tab.icon} me-1`} aria-hidden="true" />
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'titulos' && <MovieTable movies={initialData} />}
        {activeTab === 'tops' && <TopsPanel movies={initialData} />}
        {activeTab === 'tendencias' && <TrendsPanel movies={initialData} />}
      </main>
    </div>
  )
}
