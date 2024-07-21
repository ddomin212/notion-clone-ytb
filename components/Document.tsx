'use client';

import { FormEvent, Fragment, useEffect, useState, useTransition } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDoc from './DeleteDoc';
import Invite from './Invite';
import ManageUsers from './ManageUsers';
import Avatars from './Avatars';

function Document({ id }: { id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, 'documents', id));
	const [inp, setInp] = useState('');
	const [isUpdate, startTransition] = useTransition();
	const isOwner = useOwner();

	useEffect(() => {
		if (data) setInp(data.title);
	}, [data]);

	function updateTitle(e: FormEvent) {
		e.preventDefault();

		startTransition(async () => {
			await updateDoc(doc(db, 'documents', id), {
				title: inp,
			});
		});
	}

	return (
		<div>
			<div className="flex max-w-6xl mx-auto">
				<form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
					<Input value={inp} onChange={(e) => setInp(e.target.value)} />

					<Button disabled={isUpdate} type="submit">
						{isUpdate ? 'Updating' : 'Update'}
					</Button>

					{isOwner && (
						<>
							<DeleteDoc />
							<Invite />
						</>
					)}
				</form>
			</div>

			<div className="flex max-w-6xl mx-auto justify-between items-center mt-5">
				<ManageUsers />
				<Avatars />
			</div>

			{/* Collab */}
			<Editor />
		</div>
	);
}

export default Document;
