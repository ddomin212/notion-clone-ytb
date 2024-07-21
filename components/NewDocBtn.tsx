'use client';

import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { createNewDocument } from '@/actions/actions';
import { Plus } from 'lucide-react';

type Props = {};

function NewDocBtn({}: Props) {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	function handleCreateNewDoc() {
		startTransition(async function () {
			const { docId } = await createNewDocument();
			router.push(`/doc/${docId}`);
		});
	}

	return (
		<Button onClick={handleCreateNewDoc} disabled={isPending}>
			{isPending ? 'Creating...' : <Plus size={16} />}
		</Button>
	);
}

export default NewDocBtn;
