'use client'

import { getUsers } from '@/actions/admin-actions'
import { getTagsAction, TagPage } from '@/actions/tag-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
	CommandSeparator
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { addLocalRecentSearch, getLocalRecentSearches, removeLocalRecentSearch } from '@/lib/local-storage'
import { User } from '@clerk/nextjs/server'
import { Loader2, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDeferredValue, useEffect, useState } from 'react'

interface TagResult {
	_id: string
	name: string
	type: 'tag'
}

interface UserResult {
	user: User
	type: 'user'
}

interface RecentResult {
	_id: string
	name: string
	timestamp: string
	type: 'recent'
}

type SearchResult = TagResult | UserResult | RecentResult

export function SearchBar() {
	const searchParams = useSearchParams()
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState(searchParams.get('q') || '')
	const deferredQuery = useDeferredValue(query)
	const [results, setResults] = useState<{
		tags: TagResult[]
		users: UserResult[]
		recent: RecentResult[]
	}>({
		tags: [],
		users: [],
		recent: []
	})
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const fetchRecentSearches = () => {
			const localSearches = getLocalRecentSearches()
			setResults((prev) => ({
				...prev,
				recent: localSearches.map((search) => ({
					_id: search.timestamp.toString(),
					name: search.query,
					timestamp: new Date(search.timestamp).toISOString(),
					type: 'recent' as const
				}))
			}))
		}

		fetchRecentSearches()
	}, [])

	useEffect(() => {
		const fetchResults = async () => {
			if (deferredQuery.trim()) {
				setIsLoading(true)
				try {
					const [tags, users] = await Promise.all([
						getTagsAction({ name: deferredQuery }),
						getUsers(1, deferredQuery)
					])

					setResults((prev) => ({
						tags: (tags as TagPage).tags.map((tag) => ({
							_id: tag._id,
							name: tag.name,
							type: 'tag' as const
						})),
						users: users.users?.map((user: User) => ({
							user: user,
							type: 'user' as const
						})),
						recent: prev.recent
					}))
				} catch (error) {
					console.log('Error fetching search results:', error)
				} finally {
					setIsLoading(false)
				}
			} else {
				setOpen(false)
				setResults((prev) => ({
					tags: [],
					users: [],
					recent: [...prev.recent]
				}))
			}
		}

		fetchResults()
	}, [deferredQuery])

	const handleSelect = async (result: SearchResult) => {
		setOpen(false)
		if (result.type === 'user') {
            router.push(`/user/${result.user.username}`)
		} else {
            setQuery(result.name)
			router.push(`/search?q=${encodeURIComponent(result.name)}`)
		}
	}

	const handleSearch = async () => {
		if (!query.trim()) return

		setOpen(false)
		await saveRecentSearch(query)
		if (!results.recent.some((r) => r.name === query)) {
			setResults((prev) => ({
				...prev,
				recent: [
					{
						_id: new Date().toISOString(),
						name: query,
						timestamp: new Date().toISOString(),
						type: 'recent' as const
					},
					...prev.recent
				]
			}))
		}
		router.push(`/search?q=${encodeURIComponent(query)}`)
	}

	const saveRecentSearch = async (searchQuery: string) => {
		addLocalRecentSearch(searchQuery)
	}

	return (
		<div className="relative w-full">
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="relative">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							placeholder="Search for inspiration or people"
							value={query}
							onChange={(e) => {
								if (e.target.value.startsWith(' ')) return
								setQuery(e.target.value)
								setOpen(true)
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									handleSearch()
								}
							}}
							className="pl-8 h-[48px] rounded-full w-full"
						/>
						{query && (
							<div className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer rounded-full p-2 bg-gray-200 hover:bg-gray-300">
								<X
									className="h-4 w-4 "
									onClick={() => {
										setQuery('')
										setOpen(false)
										router.push('/')
									}}
								/>
							</div>
						)}
					</div>
				</PopoverTrigger>
				<PopoverContent
					className="w-[var(--radix-popover-trigger-width)] p-0"
					align="start"
					side="bottom"
					onOpenAutoFocus={(e) => e.preventDefault()}
				>
					<Command>
						<CommandList>
							{isLoading && (
								<div className="p-4 flex items-center justify-center">
									<Loader2 className="h-4 w-4 animate-spin" />
								</div>
							)}
							{!isLoading && <CommandEmpty>No results found.</CommandEmpty>}
							{!isLoading && results.users?.length > 0 && (
								<CommandGroup heading="People">
									{results.users.map((user) => (
										<CommandItem
											key={user.user.id}
											onSelect={() => handleSelect(user)}
											className="flex items-center gap-2 px-4 py-2 cursor-pointer"
										>
											<Avatar className="h-8 w-8">
												<AvatarImage src={user.user.imageUrl} />
												<AvatarFallback>{user.user.firstName?.slice(0, 1)}</AvatarFallback>
											</Avatar>
											<div className="flex flex-col">
												<span className="font-medium">
													{user.user.firstName + ' ' + user.user.lastName}
												</span>
												<span className="text-sm text-muted-foreground">
													@{user.user.username}
												</span>
											</div>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{results.users?.length > 0 && results.tags.length > 0 && <CommandSeparator />}
							{!isLoading && results.tags.length > 0 && (
								<CommandGroup heading="Tags">
									{results.tags.map((tag) => (
										<CommandItem
											key={tag._id}
											onSelect={() => handleSelect(tag)}
											className="flex items-center gap-2 px-4 py-2 cursor-pointer"
										>
											<Search className="h-4 w-4 text-muted-foreground shrink-0" />
											<span>{tag.name}</span>
										</CommandItem>
									))}
								</CommandGroup>
							)}
							{!isLoading &&
								results.recent.length > 0 &&
								results.tags.length === 0 &&
								results.users.length === 0 && (
									<CommandGroup heading="Recent Searches">
										{results.recent.map((result) => (
											<CommandItem
												key={result._id}
												onSelect={() => handleSelect(result)}
												className="flex items-center gap-2 px-4 py-2 cursor-pointer"
											>
												<Search className="h-4 w-4 text-muted-foreground shrink-0" />
												<span className="text-muted-foreground">{result.name}</span>
												<Button
													variant="outline"
													size="icon"
													className="ml-auto"
													onClick={(e) => {
														e.stopPropagation()
														setResults((prev) => ({
															...prev,
															recent: prev.recent.filter((r) => r._id !== result._id)
														}))
														removeLocalRecentSearch(result.name)
													}}
												>
													<X className="h-4 w-4 text-muted-foreground shrink-0" />
												</Button>
											</CommandItem>
										))}
									</CommandGroup>
								)}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	)
}
