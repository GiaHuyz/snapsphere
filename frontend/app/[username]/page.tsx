import { BoardPreview } from '@/components/board-preview'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Share } from 'lucide-react'

interface Board {
	id: string
	title: string
	pinCount: number
	sectionCount: number
	timeAgo: string
	coverImages: {
		main: string
		secondary: string[]
	}
}

const boards: Board[] = [
	{
		id: '1',
		title: 'wuxia',
		pinCount: 14,
		sectionCount: 1,
		timeAgo: '9h',
		coverImages: {
			main: 'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
			secondary: [
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg'
			]
		}
	},
	{
		id: '2',
		title: 'Chinese architecture',
		pinCount: 1,
		sectionCount: 1,
		timeAgo: '1d',
		coverImages: {
			main: 'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
			secondary: [
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg'
			]
		}
	},
	{
		id: '3',
		title: 'Architecture',
		pinCount: 2,
		sectionCount: 1,
		timeAgo: '2d',
		coverImages: {
			main: 'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
			secondary: [
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg',
				'https://i.pinimg.com/222x/5e/7b/55/5e7b55769f733bef97cad152dc880cc1.jpg'
			]
		}
	}
]

export default function ProfilePage({ params }: { params: { username: string } }) {
	return (
		<div className="min-h-screen bg-background pb-8">
			{/* Profile Header */}
			<div className="flex flex-col items-center space-y-4 py-8">
				<Avatar className="h-32 w-32">
					<AvatarImage src="/placeholder.svg?height=128&width=128" alt={params.username} />
					<AvatarFallback>GH</AvatarFallback>
				</Avatar>
				<h1 className="text-2xl font-bold">{params.username}</h1>
				<p className="text-muted-foreground">
					<span>plus.google.com/102566985836725009655</span>{' '}
				</p>
				<p className="text-muted-foreground max-w-[400px] line-clamp-3">this is bioooooo !</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>@dragonelga90</span>
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
					<TabsList className="h-12 bg-transparent">
						<TabsTrigger
							value="created"
							className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
						>
							Created
						</TabsTrigger>
						<TabsTrigger
							value="saved"
							className="data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:bg-transparent"
						>
							Saved
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="created" className="mt-6">
					<div className='max-w-[200px] mx-auto'>
						<button className="group relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-dashed border-muted hover:border-muted-foreground">
							<div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
								<div className="rounded-full bg-muted p-4 group-hover:bg-muted-foreground/20">
									<Plus className="h-6 w-6 text-muted-foreground" />
								</div>
								<span className="text-sm font-medium">Create board</span>
							</div>
						</button>
					</div>
				</TabsContent>

				<TabsContent value="saved" className="mt-6">
					<div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
						{boards.map((board) => (
							<BoardPreview
								key={board.id}
								id={board.id}
								title={board.title}
								pinCount={board.pinCount}
								sectionCount={board.sectionCount}
								timeAgo={board.timeAgo}
								coverImages={board.coverImages}
								username={params.username}
							/>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
