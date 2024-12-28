import MansoryLayout from '@/components/mansory-layout'
import Pin from '@/components/pin'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
	{
		title: 'Animals',
		image: 'https://i.pinimg.com/474x/cd/a2/be/cda2be611e4466e5e6182b627b18f851.jpg',
		href: '/category/animals'
	},
	{
		title: 'Art',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/art'
	},
	{
		title: 'Beauty',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/beauty'
	},
	{
		title: 'Design',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/design'
	},
	{
		title: 'DIY And Crafts',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/diy-and-crafts'
	},
	{
		title: 'Food And Drink',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/food-and-drink'
	},
	{
		title: 'Home Decor',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/home-decor'
	},
	{
		title: "Men's Fashion",
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/mens-fashion'
	},
	{
		title: 'Quotes',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/quotes'
	},
	{
		title: 'Tattoos',
		image: 'https://i.pinimg.com/236x/05/a6/98/05a698e8295457728ff5b0e5472d3f28.jpg',
		href: '/category/tattoos'
	}
]

const trendingItems = [
	{
		title: 'Gift Guide 2024',
		image: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/gift-guide'
	},
	{
		title: 'Holiday Decorations',
		image: 'https://images.unsplash.com/photo-1732468170768-4ae7fe38376b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/holiday'
	},
	{
		title: 'Winter Fashion',
		image: 'https://images.unsplash.com/photo-1732539661267-5a6b5e6aa65e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/winter-fashion'
	},
	{
		title: 'Home Inspiration',
		image: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/home'
	},
	{
		title: 'Seasonal Recipes',
		image: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/recipes'
	},
	{
		title: 'Seasonal Recipes 2',
		image: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		href: '/trending/recipes'
	}
]

export default function IdeasPage() {
	return (
		<div className="min-h-screen bg-background">
			<main className="container py-6 mx-auto max-w-6xl">
				<section className="space-y-6">
					<h2 className="text-2xl font-semibold tracking-tight">Browse by category</h2>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{categories.map((category) => (
							<Link
								key={category.title}
								href={category.href}
								className="relative overflow-hidden rounded-lg"
							>
								<Image
									src={category.image}
									alt={category.title}
									width={236}
									height={118}
									className="object-cover w-[236px] h-[118px]"
								/>
								<div className="absolute inset-0 overflow-hidden">
									<div className="flex p-4 items-center justify-center h-full bg-black bg-opacity-30 hover:bg-opacity-60">
										<h3 className="text-center text-lg font-semibold break-words text-white line-clamp-3">
											{category.title}
										</h3>
									</div>
								</div>
							</Link>
						))}
					</div>
					<div className="flex justify-center">
						<Button variant="outline">See more</Button>
					</div>
				</section>

				<section className="mt-12 space-y-6">
					<h2 className="text-2xl font-semibold tracking-tight">What&apos;s new on Snapsphere</h2>
					<div className="relative">
						{/* <MansoryLayout className="xl:columns-5">
							{trendingItems.map((item) => (
								<Pin
									key={item.title}
									id={item.title}
									title={item.title}
									image={item.image}
									currentBoard="wuxia"
								/>
							))}
						</MansoryLayout> */}
					</div>
				</section>
			</main>
		</div>
	)
}
