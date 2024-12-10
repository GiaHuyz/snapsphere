import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Expand, Heart, MoreHorizontal, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function PinDetails() {
	return (
		<div className="min-h-screen">
			<div className="flex items-center justify-center py-8">
				<div className="grid w-full max-w-5xl grid-cols-1 gap-4 rounded-2xl bg-white p-4 shadow-2xl lg:grid-cols-[500px,1fr]">
					{/* Left: Image Section */}
					<div className="relative">
						<div className="relative w-full overflow-hidden rounded-lg">
							<Image
								src="https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
								alt="Detailed landscape artwork"
								width={500}
								height={500}
								className="h-auto w-full max-h-[685px] object-cover"
								priority
							/>
							<Button
								size="icon"
								variant="secondary"
								className="absolute bottom-4 right-4 rounded-full bg-white/90 backdrop-blur-sm"
							>
								<Expand className="h-5 w-5" />
							</Button>
						</div>
					</div>

					{/* Right: Info Section */}
					<div className="flex flex-col">
						{/* Top Actions */}
						<div className="flex items-center justify-between pb-4">
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2">
									<Heart className="h-5 w-5" />
									<span className="text-sm font-medium">30</span>
								</div>
								<Button size="icon" variant="secondary" className="rounded-full">
									<Share2 className="h-5 w-5" />
								</Button>
								<Button size="icon" variant="secondary" className="rounded-full">
									<MoreHorizontal className="h-5 w-5" />
								</Button>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="secondary" className="rounded-full">
									wuxia
								</Button>
								<Button variant="default" className="rounded-full">
									Save
								</Button>
							</div>
						</div>

						{/* User Info */}
						<div className="flex items-center justify-between py-4">
							<Link href={`/giahuy957z`}>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src="/placeholder.svg?height=40&width=40" alt="Mùa Hoa" />
										<AvatarFallback>MH</AvatarFallback>
									</Avatar>
									<div>
										<h2 className="font-medium">Mùa Hoa</h2>
										<p className="text-sm text-muted-foreground">1k followers</p>
									</div>
								</div>
							</Link>
							<Button variant="outline" className="rounded-full">
								Follow
							</Button>
						</div>

						{/* Comments Section */}
						<div className="flex-1 overflow-y-auto">
							<h3 className="font-medium">No comments yet</h3>
							<p className="text-sm text-muted-foreground">
								No comments yet! Add one to start the conversation.
							</p>
						</div>

						{/* Comment Input */}
						<div className="pt-4">
							<div className="flex items-center gap-2">
								<Avatar className="size-12">
									<AvatarImage src="/placeholder.svg?height=32&width=32" alt="Current user" />
									<AvatarFallback>U</AvatarFallback>
								</Avatar>
								<div className="relative flex-1">
									<Input placeholder="Add a comment" className="rounded-full pr-20 min-h-12" />
									<div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
										<Button size="icon" variant="ghost" className="h-8 w-8">
											😊
										</Button>
										<Button size="icon" variant="ghost" className="h-8 w-8">
											📷
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
