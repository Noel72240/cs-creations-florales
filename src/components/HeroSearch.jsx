import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSiteConfig } from '../context/SiteContentContext'
import { buildSiteSearchIndex, searchSiteIndex } from '../lib/siteSearch'

export default function HeroSearch({ placeholder, hint }) {
  const { content } = useSiteConfig()
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef(null)
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const index = useMemo(
    () => buildSiteSearchIndex(content?.pageArticles),
    [content?.pageArticles],
  )

  const results = useMemo(
    () => (open && query.trim().length >= 2 ? searchSiteIndex(index, query) : []),
    [index, open, query],
  )

  const goTo = useCallback(
    (path) => {
      setOpen(false)
      setQuery('')
      setActiveIndex(-1)
      navigate(path)
    },
    [navigate],
  )

  useEffect(() => {
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (results.length > 0) {
      goTo(results[activeIndex >= 0 ? activeIndex : 0].path)
    }
  }

  const onKeyDown = (e) => {
    if (!open || results.length === 0) {
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      goTo(results[activeIndex].path)
    }
  }

  const showPanel = open && query.trim().length >= 2
  const showEmpty = showPanel && results.length === 0

  return (
    <div ref={rootRef} className="hero-search-wrap relative">
      <form className="hero-search" role="search" onSubmit={onSubmit}>
        <span className="hero-search__icon" aria-hidden="true">
          ⌕
        </span>
        <input
          ref={inputRef}
          type="search"
          className="hero-search__input"
          placeholder={placeholder}
          aria-label="Rechercher sur le site"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listId : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query ? (
          <button
            type="button"
            className="hero-search__clear"
            aria-label="Effacer la recherche"
            onClick={() => {
              setQuery('')
              setActiveIndex(-1)
              inputRef.current?.focus()
            }}
          >
            ×
          </button>
        ) : null}
      </form>

      {showPanel ? (
        <ul id={listId} className="hero-search-results" role="listbox">
          {results.map((r, i) => (
            <li key={r.id} role="option" aria-selected={i === activeIndex}>
              <Link
                to={r.path}
                className={`hero-search-results__item${i === activeIndex ? ' hero-search-results__item--active' : ''}`}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  setOpen(false)
                  setQuery('')
                }}
              >
                <span className="hero-search-results__title">{r.title}</span>
                <span className="hero-search-results__meta">
                  {r.kind === 'product' ? 'Création' : 'Page'}
                  {r.subtitle ? ` · ${r.subtitle}` : ''}
                </span>
              </Link>
            </li>
          ))}
          {showEmpty ? (
            <li className="hero-search-results__empty" role="status">
              Aucun résultat pour « {query.trim()} »
            </li>
          ) : null}
        </ul>
      ) : null}

      <p
        className="hero-search-hint mt-3 text-lg sm:text-xl md:text-[1.35rem] font-refined font-medium leading-snug sm:leading-normal tracking-wide text-center px-1"
        style={{ color: 'rgba(61, 42, 74, 0.68)' }}
      >
        {hint}
      </p>
    </div>
  )
}
