'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const recentPins = [
	{
		id: '1',
		title: 'Beautiful Sunset',
		user: {
			name: 'John Doe',
			image: '/placeholder.svg'
		},
		createdAt: '2024-01-26T14:00:00.000Z'
	},
	{
		id: '2',
		title: 'Mountain Landscape',
		user: {
			name: 'Jane Smith',
			image: '/placeholder.svg'
		},
		createdAt: '2024-01-26T13:45:00.000Z'
	},
	{
		id: '3',
		title: 'City Lights',
		user: {
			name: 'Mike Johnson',
			image: '/placeholder.svg'
		},
		createdAt: '2024-01-26T13:30:00.000Z'
	},
	{
		id: '4',
		title: 'Ocean View',
		user: {
			name: 'Sarah Wilson',
			image: '/placeholder.svg'
		},
		createdAt: '2024-01-26T13:15:00.000Z'
	},
	{
		id: '5',
		title: 'Forest Path',
		user: {
			name: 'David Brown',
			image: '/placeholder.svg'
		},
		createdAt: '2024-01-26T13:00:00.000Z'
	}
]

export function RecentPins() {
	return (
		<div className="space-y-8">
			{recentPins.map((pin) => (
				<div key={pin.id} className="flex items-center">
					<Avatar className="h-9 w-9">
						<AvatarImage src={pin.user.image} alt={pin.user.name} />
						<AvatarFallback>{pin.user.name[0]}</AvatarFallback>
					</Avatar>
					<div className="ml-4 space-y-1">
						<p className="text-sm font-medium leading-none">{pin.title}</p>
						<p className="text-sm text-muted-foreground">By {pin.user.name}</p>
					</div>
					<div className="ml-auto font-medium">
						{new Date(pin.createdAt).toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit'
						})}
					</div>
				</div>
			))}
		</div>
	)
}

