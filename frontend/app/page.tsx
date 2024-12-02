import { MansoryLayout } from '@/components/mansory-layout'
import { Pin } from '@/components/pin'

const images = [
	{
		id: '1',
		src: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Traditional Asian architecture with cherry blossoms',
		width: 300,
		height: 400
	},
	{
		id: '2',
		src: 'https://images.unsplash.com/photo-1732468170768-4ae7fe38376b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Floating temple in the clouds',
		width: 300,
		height: 500
	},
	{
		id: '3',
		src: 'https://images.unsplash.com/photo-1732539661267-5a6b5e6aa65e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Sunset over ancient city',
		width: 300,
		height: 600
	},
	{
		id: '4',
		src: 'https://plus.unsplash.com/premium_photo-1731624534286-adf5e9c78159?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Sunset over ancient city',
		width: 300,
		height: 500
	},
	{
		id: '5',
		src: 'https://images.unsplash.com/photo-1732468170768-4ae7fe38376b?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Sunset over ancient city',
		width: 300,
		height: 200
	},
	{
		id: '6',
		src: 'https://images.unsplash.com/photo-1732539661267-5a6b5e6aa65e?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
		alt: 'Sunset over ancient city',
		width: 300,
		height: 300
	}
]
// TODO: Trang chủ, hiển thị các ý tưởng nổi bật,
// có thể dựa vào lịch sử duyệt web của người dùng để đề xuất ý tưởng phù hợp

export default function IdeasPage() {
	return (
		<div className="min-h-screen bg-background">
			<main className="py-6">
				<MansoryLayout className="xl:columns-6">
					{images.map((image) => (
						<Pin key={image.id} id={image.id} image={image.src} title={image.alt} currentBoard="wuxia" />
					))}
				</MansoryLayout>
			</main>
		</div>
	)
}
