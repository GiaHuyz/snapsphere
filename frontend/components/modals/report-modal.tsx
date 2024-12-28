'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useReportModal } from '@/hooks/use-report-modal'

const reportReasons = [
	{
		value: 'spam',
		label: 'Spam',
		description: 'Misleading or repetitive posts'
	},
	{
		value: 'nudity',
		label: 'Nudity, pornography or sexualized content',
		description: 'Sexually explicit content involving adults or nudity, non-nudity or intentional misuse involving minors'
	},
	{
		value: 'self-harm',
		label: 'Self-harm',
		description: 'Eating disorders, cutting, suicide'
	},
	{
		value: 'misinformation',
		label: 'Misinformation',
		description: 'Health, climate, voting misinformation or conspiracies'
	},
	{
		value: 'hate',
		label: 'Hateful activities',
		description: 'Prejudice, stereotypes, white supremacy, slurs'
	},
	{
		value: 'dangerous',
		label: 'Dangerous goods',
		description: 'Drugs, weapons, regulated products'
	},
	{
		value: 'harassment',
		label: 'Harassment or criticism',
		description: 'Insults, threats, cyberbullying, non-consensual nude images'
	},
	{
		value: 'violence',
		label: 'Graphic violence',
		description: 'Violent images or promotion of violence'
	},
	{
		value: 'privacy',
		label: 'Privacy violation',
		description: 'Private photos, personal information'
	},
	{
		value: 'intellectual-property',
		label: 'My intellectual property',
		description: 'Copyright or trademark infringement'
	}
]

export default function ReportModal() {
	const [selectedReason, setSelectedReason] = useState<string>('')
	const { isOpen, onClose, itemId, itemType } = useReportModal()

	const handleSubmit = async () => {
		if (!selectedReason) return

		try {
			// TODO: Implement report submission
			onClose()
			setSelectedReason('')
		} catch (error) {
			console.error('Error submitting report:', error)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-11/12 sm:max-w-[425px] max-h-[calc(100vh-64px)] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-semibold">Report Pin</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<RadioGroup value={selectedReason} onValueChange={setSelectedReason} className='space-y-4'>
						{reportReasons.map((reason) => (
							<div
								key={reason.value}
								className="flex items-start space-x-3"
							>
								<RadioGroupItem value={reason.value} id={reason.value} className="mt-1" />
								<div className="flex-1 space-y-1 leading-none">
									<Label htmlFor={reason.value} className="text-sm font-medium leading-none cursor-pointer">
										{reason.label}
									</Label>
									{reason.description && (
										<p className="text-sm text-muted-foreground">{reason.description}</p>
									)}
								</div>
							</div>
						))}
					</RadioGroup>
				</div>
				<DialogFooter className="mt-6 flex justify-between">
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={!selectedReason}>
						Next
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

