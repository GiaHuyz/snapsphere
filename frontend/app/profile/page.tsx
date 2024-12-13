import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
	return (
		<div className="container max-w-2xl py-8 px-5 mx-auto">
			<div className="space-y-6">
				<div>
					<h1 className="text-2xl font-bold">Edit profile</h1>
					<p className="text-sm text-muted-foreground max-w-[400px]">
						Keep your personal details private. Information you add here is visible to anyone who can view
						your profile.
					</p>
				</div>
				<ProfileForm />
			</div>
		</div>
	)
}
