'use client';

import React, { useState, useTransition } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteDocAction } from '@/actions/actions';

type Props = {};

function DeleteDoc({}: Props) {
	const [state, setState] = useState(false);
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const router = useRouter();

	function handleDelete() {
		const roomId = pathname.split('/').pop();
		if (!roomId) return;

		startTransition(async () => {
			const { success } = await deleteDocAction(roomId);
			if (success) {
				setState(false);
				router.replace('/');
				toast.success('Delete succesful');
			} else {
				toast.error('Failed to delete');
			}
		});
	}

	return (
		<Dialog open={state} onOpenChange={setState}>
			<Button asChild variant="destructive">
				<DialogTrigger>Delete</DialogTrigger>
			</Button>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</DialogDescription>
				</DialogHeader>

				<DialogFooter className="sm:justify-end gap-2">
					<Button type="button" variant={'destructive'} onClick={handleDelete} disabled={isPending}>
						{isPending ? 'Deleting...' : 'Delete'}
					</Button>

					<DialogClose asChild>
						<Button type="button" variant="secondary">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default DeleteDoc;
