import { useState } from 'react'
import TopPickerModal from '../../components/admin/TopPickerModal'
import TopsPanel from '../../components/admin/TopsPanel'
import { useMovies } from '../../hooks/useMovies'
import { TOP_LIMIT, useTops } from '../../hooks/useTops'
import type { Movie, MovieType } from '../../types/movie'

export default function AdminTopsPage() {
  const { movies } = useMovies()
  const {
    topIds,
    topSerieIds,
    topMovies,
    topSeries,
    addToTop,
    removeFromTop,
    moveInTop,
  } = useTops(movies)

  const [pickerType, setPickerType] = useState<MovieType | null>(null)

  const pickerMovies = pickerType
    ? movies.filter((movie) => {
        const type = movie.type ?? 'pelicula'
        if (type !== pickerType) return false
        const currentTop = pickerType === 'pelicula' ? topIds : topSerieIds
        return !currentTop.includes(movie.id)
      })
    : []

  const pickerCount =
    pickerType === 'pelicula' ? topMovies.length : topSeries.length

  function handleAddToTop(movie: Movie) {
    addToTop(movie)
    setPickerType(null)
  }

  return (
    <>
      <TopsPanel
        movies={topMovies}
        series={topSeries}
        onAdd={setPickerType}
        onRemove={removeFromTop}
        onMove={moveInTop}
      />

      {pickerType && (
        <TopPickerModal
          movies={pickerMovies}
          type={pickerType}
          currentCount={pickerCount}
          limit={TOP_LIMIT}
          onClose={() => setPickerType(null)}
          onAdd={handleAddToTop}
        />
      )}
    </>
  )
}
