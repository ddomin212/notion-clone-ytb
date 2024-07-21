'use client';

import React, { FormEvent, useState, useTransition } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useOwner from '@/lib/useOwner';
import { useUser } from '@clerk/nextjs';
import { useRoom } from '@liveblocks/react/suspense';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collectionGroup, doc, query, where } from 'firebase/firestore';
import { db } from '@/firebase';
import { deleteFromRoom } from '@/actions/actions';

type Props = {};

function ManageUsers({}: Props) {
	const [state, setState] = useState(false);

	const [isPending, startTransition] = useTransition();
	const isOwner = useOwner();
	const { user } = useUser();
	const room = useRoom();
	const pathname = usePathname();

	const [usersInRoom] = useCollection(user && query(collectionGroup(db, 'rooms'), where('roomId', '==', room.id)));

	function handleDelete(userId: string) {
		const roomId = pathname.split('/').pop();
		if (!roomId) return;

		startTransition(async () => {
			const { success } = await deleteFromRoom(roomId, userId);
			if (success) {
				setState(false);
				toast.success('Removal succesful');
			} else {
				toast.error('Failed to remove');
			}
		});
	}

	return (
		<Dialog open={state} onOpenChange={setState}>
			<Button asChild variant="outline">
				<DialogTrigger>Manage editors</DialogTrigger>
			</Button>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Editors</DialogTitle>
					<DialogDescription>These people can edit your file, and you manage them here.</DialogDescription>
				</DialogHeader>

				<div>
					{usersInRoom?.docs.map((doc) => (
						<div>
							{isOwner && doc.data().userId !== user?.emailAddresses[0].toString() && (
								<div className="flex items-center justify-between" key={doc.data().userId}>
									<p className="font-light">
										{doc.data().userId} ({doc.data().role})
									</p>
									<Button variant={'destructive'} onClick={() => handleDelete(doc.data().userId)} disabled={isPending} size="sm">
										{isPending ? 'Processing...' : 'Remove'}
									</Button>
								</div>
							)}
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ManageUsers;
