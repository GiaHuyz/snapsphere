'use client'

import { createReportAction } from '@/actions/report-actions'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useReportModal } from '@/hooks/use-report-modal'
import { ReportReason } from '@/lib/constants'
import { isActionError } from '@/lib/errors'
import { useState } from 'react'
import { toast } from 'sonner'

const reportReasons: { value: ReportReason; label: string; description?: string }[] = [
	{
		value: ReportReason.SPAM,
		label: 'Spam',
		description: 'Misleading or repetitive posts'
	},
	{
		value: ReportReason.NUDITY,
		label: 'Nudity, pornography or sexualized content',
		description: 'Sexually explicit content involving adults or nudity, non-nudity or intentional misuse involving minors'
	},
	{
		value: ReportReason.SELF_HARM,
		label: 'Self-harm',
		description: 'Eating disorders, cutting, suicide'
	},
	{
		value: ReportReason.MISINFORMATION,
		label: 'Misinformation',
		description: 'Health, climate, voting misinformation or conspiracies'
	},
	{
		value: ReportReason.HATE,
		label: 'Hateful activities',
		description: 'Prejudice, stereotypes, white supremacy, slurs'
	},
	{
		value: ReportReason.DANGEROUS,
		label: 'Dangerous goods',
		description: 'Drugs, weapons, regulated products'
	},
	{
		value: ReportReason.HARASSMENT,
		label: 'Harassment or criticism',
		description: 'Insults, threats, cyberbullying, non-consensual nude images'
	},
	{
		value: ReportReason.VIOLENCE,
		label: 'Graphic violence',
		description: 'Violent images or promotion of violence'
	},
	{
		value: ReportReason.PRIVACY,
		label: 'Privacy violation',
		description: 'Private photos, personal information'
	},
	{
		value: ReportReason.INTELLECTUAL_PROPERTY,
		label: 'My intellectual property',
		description: 'Copyright or trademark infringement'
	}
]

export default function ReportModal() {
	const [selectedReason, setSelectedReason] = useState<ReportReason>(ReportReason.SPAM)
	const { isOpen, onClose, itemId, itemType } = useReportModal()

	const handleSubmit = async () => {
		if (!selectedReason) return

        const res = await createReportAction({item_id: itemId!, reason: selectedReason, type: itemType!})

        if (isActionError(res)) {
            toast.error(res.error)
        } else {
            toast.success('Report submitted successfully')
            onClose()
        }
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="w-11/12 sm:max-w-[425px] max-h-[calc(100vh-64px)] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-center text-xl font-semibold">Report Pin</DialogTitle>
				</DialogHeader>
				<div className="mt-4">
					<RadioGroup value={selectedReason} onValueChange={setSelectedReason as any} className='space-y-4'>
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

