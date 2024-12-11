import { getBoardsByUsernameAction } from '@/actions/board-actions'
import BoardPreviewList from '@/components/board-preview-list'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { isActionError } from '@/lib/errors'
import { clerkClient } from '@clerk/nextjs/server'
import { DropdownMenu } from '@radix-ui/react-dropdown-menu'
import { Plus, Settings2, Share } from 'lucide-react'
import Link from 'next/link'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
	const { username } = await params

	const fetchUser = async () => {
		const { data } = await (
			await clerkClient()
		).users.getUserList({
			username: [username]
		})
		return data[0]
	}

	const user = await fetchUser()

	if (!user) {
		return (
			<div className="flex items-center justify-center mt-20">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-2">User Not Found</h2>
					<p className="text-muted-foreground">The requested user profile does not exist.</p>
				</div>
			</div>
		)
	}

	const boards = await getBoardsByUsernameAction(user.id)

	if (isActionError(boards)) {
		return (
			<div className="flex items-center justify-center mt-20">
				<div className="text-center">
					<h2 className="text-2xl font-semibold mb-2">{boards.error}</h2>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-background pb-8">
			{/* Profile Header */}
			<div className="flex flex-col items-center space-y-3 py-3">
				<Avatar className="h-28 w-28">
					<AvatarImage src={user.imageUrl} alt={username} />
					<AvatarFallback>GH</AvatarFallback>
				</Avatar>
				<h1 className="text-2xl font-bold">{user.fullName}</h1>
				<p className="text-muted-foreground">
					<span>plus.google.com/102566985836725009655</span>{' '}
				</p>
				{(user.unsafeMetadata?.bio as string) && (
					<p className="text-muted-foreground">{user.unsafeMetadata?.bio as string}</p>
				)}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>@{user.username}</span>
					<span>.</span>
					<span>1 following</span>
				</div>
				<div className="flex gap-2">
					<Button variant="secondary" className="rounded-full">
						<Share className="mr-2 h-4 w-4" />
						Share
					</Button>
					<Button variant="secondary" className="rounded-full">
						Edit profile
					</Button>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="saved" className="px-4">
				<div className="flex items-center justify-center border-b">
					<TabsList className="h-16 w-[200px] grid grid-cols-2 gap-2 bg-transparent">
						<TabsTrigger
							value="created"
							className="border h-10 rounded-2xl hover:bg-muted data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
						>
							Created
						</TabsTrigger>
						<TabsTrigger
							value="saved"
							className="border h-10 rounded-2xl hover:bg-muted data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black"
						>
							Saved
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="created" className="mt-6">
					<div className="max-w-[200px] mx-auto">
						<Link href={`/create`}>
							<button className="group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-dashed border-muted hover:border-muted-foreground">
								<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
									<div className="rounded-full bg-muted p-4 group-hover:bg-muted-foreground/20">
										<Plus className="h-6 w-6 text-muted-foreground" />
									</div>
									<span className="text-sm font-medium">Create pin</span>
								</div>
							</button>
						</Link>
					</div>
				</TabsContent>

				<TabsContent value="saved" className="mt-2">
					<div className="flex justify-between items-center">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="rounded-full">
									<Settings2 className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start'>
								<DropdownMenuItem className='cursor-pointer'>
									Share
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button className="rounded-full">
									<Plus />
								</Button>
							</DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem className='cursor-pointer'>
                                        Create Pin
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer'>
                                        Create Board
                                </DropdownMenuItem>
                            </DropdownMenuContent>
						</DropdownMenu>
					</div>
					<BoardPreviewList username={username} initBoards={boards} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
