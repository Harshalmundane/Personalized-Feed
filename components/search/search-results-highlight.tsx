"use client"

interface SearchResultsHighlightProps {
  text: string
  searchQuery: string
  className?: string
}

export function SearchResultsHighlight({ text, searchQuery, className }: SearchResultsHighlightProps) {
  if (!searchQuery.trim()) {
    return <span className={className}>{text}</span>
  }

  // Handle advanced search operators
  const cleanQuery = searchQuery
    .replace(/type:\w+/g, "") // Remove type: operators
    .replace(/source:\w+/g, "") // Remove source: operators
    .trim()

  if (!cleanQuery) {
    return <span className={className}>{text}</span>
  }

  const parts = text.split(new RegExp(`(${cleanQuery})`, "gi"))

  return (
    <span className={className}>
      {parts.map((part, index) =>
        part.toLowerCase() === cleanQuery.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </span>
  )
}
