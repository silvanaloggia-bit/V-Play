import { useEffect, useState } from 'react'

export function useDebouncedText(text: string, delayInMilliseconds: number): string {
  const [debouncedText, setDebouncedText] = useState(text)

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedText(text)
    }, delayInMilliseconds)

    return () => clearTimeout(timerId)
  }, [text, delayInMilliseconds])

  return debouncedText
}
