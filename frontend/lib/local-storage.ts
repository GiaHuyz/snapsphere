const MAX_RECENT_SEARCHES = 20

export const getLocalRecentSearches = (): { query: string; timestamp: number }[] => {
	if (typeof window === 'undefined') return []

	const searches = localStorage.getItem('recentSearches')
	return searches ? JSON.parse(searches) : []
}

export const addLocalRecentSearch = (query: string) => {
	if (typeof window === 'undefined') return

	const searches = getLocalRecentSearches()
	const newSearches = [{ query, timestamp: Date.now() }, ...searches.filter((s) => s.query !== query)].slice(
		0,
		MAX_RECENT_SEARCHES
	)

	localStorage.setItem('recentSearches', JSON.stringify(newSearches))
}

export const removeLocalRecentSearch = (query: string) => {
    if (typeof window === 'undefined') return

    const searches = getLocalRecentSearches()
    const newSearches = searches.filter((s) => s.query !== query)

    localStorage.setItem('recentSearches', JSON.stringify(newSearches))
}
