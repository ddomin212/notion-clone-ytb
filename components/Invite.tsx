'use client';

import React, { FormEvent, useState, useTransition } from 'react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { inviteToDoc } from '@/actions/actions';
import { Input } from './ui/input';

type Props = {};

function Invite({}: Props) {
	const [state, setState] = useState(false);
	const [email, setEmail] = useState('');
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const router = useRouter();

	function handleDelete(e: FormEvent) {
		e.preventDefault();

		const roomId = pathname.split('/').pop();
		if (!roomId) return;

		startTransition(async () => {
			const { success } = await inviteToDoc(roomId, email);
			if (success) {
				setEmail('');
				setState(false);
				router.replace('/');
				toast.success('Invitation succesful');
			} else {
				toast.error('Failed to invite');
			}
		});
	}

	return (
		<Dialog open={state} onOpenChange={setState}>
			<Button asChild variant="outline">
				<DialogTrigger>Invite</DialogTrigger>
			</Button>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite user.</DialogTitle>
					<DialogDescription>Enter the email of the user to invite.</DialogDescription>
				</DialogHeader>

				<form className="flex gap-2" onSubmit={handleDelete}>
					<Input type="email" placeholder="Email" className="w-full" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
				</form>

				<Button type="submit" variant={'outline'} onClick={handleDelete} disabled={isPending}>
					{isPending ? 'Processing...' : 'Invite'}
				</Button>
			</DialogContent>
		</Dialog>
	);
}

export default Invite;
