import { getUsers } from '@/actions/admin-actions'
import { getBoardsAction } from '@/actions/board-actions'
import { getAllPinsUserAction } from '@/actions/pin-actions'
import BoardPreviewList from '@/components/pages/user/board-preview-list'
import PinList from '@/components/pin/pin-list'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import UserList from '@/components/user-list'
import { isActionError } from '@/lib/errors'
import { Plus, Settings, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SearchType = "pins" | "boards" | "profiles"

export default async function SearchPage({
	searchParams,
  }: {
	searchParams: {
	  q: string
	  type?: SearchType
	}
  }) {
	if (!searchParams.q) {
	  redirect("/")
	}
  
	const type = searchParams.type || "pins"
  
	let content
  
	switch (type) {
	  case "pins": {
		const pins = await getAllPinsUserAction({ search: searchParams.q })
		if (isActionError(pins)) {
		  content = (
			<div className="text-center mt-8">
			  <p className="text-muted-foreground">Failed to load pins</p>
			</div>
		  )
		} else {
		  content = <PinList pageName="Search" initialPins={pins.data} search={searchParams.q} />
		}
		break
	  }
	  case "boards": {
		const boards = await getBoardsAction({ title: searchParams.q })
		if (isActionError(boards)) {
		  content = (
			<div className="text-center mt-8">
			  <p className="text-muted-foreground">No boards found</p>
			</div>
		  )
		} else {
		  content = <BoardPreviewList initBoardsPreview={boards} userId="" username="" search={searchParams.q} />
		}
		break
	  }
	  case "profiles": {
		const users = await getUsers(1, searchParams.q)
		if (isActionError(users)) {
		  content = (
			<div className="text-center mt-8">
			  <p className="text-muted-foreground">No profiles found</p>
			</div>
		  )
		} else {
		  content = <UserList users={users.users} />
		}
		break
	  }
	}
  
	return (
	  <div className="min-h-screen bg-background">
		<div className="flex items-center mt-3 px-2">
		  <DropdownMenu>
			<DropdownMenuTrigger asChild>
			  <Button className="rounded-full">
				<Settings2 className="h-4 w-4" />
			  </Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
			  <DropdownMenuItem asChild>
				<Link href={`/search?q=${searchParams.q}&type=pins`} className="cursor-pointer">
				  All Pins
				</Link>
			  </DropdownMenuItem>
			  <DropdownMenuItem asChild>
				<Link href={`/search?q=${searchParams.q}&type=boards`} className="cursor-pointer">
				  Boards
				</Link>
			  </DropdownMenuItem>
			  <DropdownMenuItem asChild>
				<Link href={`/search?q=${searchParams.q}&type=profiles`} className="cursor-pointer">
				  Profiles
				</Link>
			  </DropdownMenuItem>
			</DropdownMenuContent>
		  </DropdownMenu>
		</div>
		<div className="py-6">{content}</div>
	  </div>
	)
  }
  
  