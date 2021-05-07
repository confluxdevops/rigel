import {useState, useEffect} from 'react'

export default function useTheme() {
  let initTheme = 'light'
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    initTheme = 'dark'
  }
  const [theme, setTheme] = useState(initTheme)
  useEffect(() => {
    const colorTheme = theme === 'light' ? 'dark' : 'light'
    const root = window.document.documentElement
    root.classList.remove(colorTheme)
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])
  console.log(theme)
  return [theme, setTheme]
}
