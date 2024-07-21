'use client';

import React, { useEffect, useState } from 'react';
import NewDocBtn from './NewDocBtn';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { MenuIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { DocumentData, collectionGroup, query, where } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase';
import SidebarOption from './SidebarOption';

type Props = {};

interface RoomDocument extends DocumentData {
	createdAt: string;
	role: 'owner' | 'editor';
	roomId: string;
	userid: string;
}

function Sidebar({}: Props) {
	const { user } = useUser();
	const [groupedData, setGroupedData] = useState<{ owner: RoomDocument[]; editor: RoomDocument[] }>({
		owner: [],
		editor: [],
	});

	const [data, loading, error] = useCollection(user && query(collectionGroup(db, 'rooms'), where('userId', '==', user.emailAddresses[0].toString())));

	const menuOptions = (
		<>
			<NewDocBtn />
			<div className="flex py-4 flex-col space-y-4 md:max-w-36">
				{/* Docs */}
				{groupedData.owner.length === 0 ? null : (
					<>
						<h2 className="text-gray-500 font-semibold text-sm">Documents</h2>
						{groupedData.owner.map((doc) => {
							return <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />;
						})}
					</>
				)}
				{/* Shared */}
				{groupedData.editor.length === 0 ? null : (
					<>
						<h2 className="text-gray-500 font-semibold text-sm">Shared</h2>
						{groupedData.editor.map((doc) => {
							return <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />;
						})}
					</>
				)}
				{groupedData.editor.length + groupedData.owner.length === 0 ? (
					<div>
						<h2 className="text-gray-500 font-semibold text-sm">No docs found</h2>
					</div>
				) : null}
			</div>
		</>
	);

	useEffect(() => {
		if (!data) return;

		const grouped = data.docs.reduce<{ owner: RoomDocument[]; editor: RoomDocument[] }>(
			(acc, doc) => {
				const roomData = doc.data() as RoomDocument;

				if (roomData.role === 'owner') {
					acc.owner.push({
						id: doc.id,
						...roomData,
					});
				} else {
					acc.editor.push({
						id: doc.id,
						...roomData,
					});
				}

				return acc;
			},
			{
				owner: [],
				editor: [],
			}
		);

		console.log(grouped);

		setGroupedData(grouped);
	}, [data]);

	return (
		<div className="p-2 md:p-5 bg-gray-200 relative">
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger>
						<MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40}></MenuIcon>
					</SheetTrigger>

					<SheetContent side="left" className="w-2/4">
						<SheetHeader>
							<SheetTitle></SheetTitle>
							<div>{menuOptions}</div>
							<SheetDescription></SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
			<div className="hidden md:inline">{menuOptions}</div>
		</div>
	);
}

export default Sidebar;
