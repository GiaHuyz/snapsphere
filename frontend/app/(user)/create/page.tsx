import CreatePinForm from '@/components/pages/create/create-pin-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Snapsphere | Create Pin'
}

export default async function CreatePinPage() {
	return (
		<div className="container max-w-4xl py-8 px-3 mx-auto">
			<div className="space-y-6">
				<h1 className="text-2xl font-bold text-center">Create Pin</h1>
				<CreatePinForm />
			</div>
		</div>
	)
}
