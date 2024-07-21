'use server';

import { adminDb } from '@/firebase-admin';
import liveblocks from '@/lib/liveblocks';
import { auth } from '@clerk/nextjs/server';

export async function createNewDocument() {
	auth().protect();
	const { sessionClaims } = await auth();

	const docCRef = adminDb.collection('documents');
	const docRef = await docCRef.add({
		title: 'New Doc',
	});

	await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
		userId: sessionClaims?.email,
		role: 'owner',
		createdAt: new Date(),
		roomId: docRef.id,
	});

	return { docId: docRef.id };
}

export async function deleteDocAction(roomId: string) {
	auth().protect();

	try {
		await adminDb.collection('documents').doc(roomId).delete();
		const query = await adminDb.collectionGroup('rooms').where('roomId', '==', roomId).get();

		const batch = adminDb.batch();

		query.docs.forEach((d) => {
			batch.delete(d.ref);
		});

		await batch.commit();

		await liveblocks.deleteRoom(roomId);

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false };
	}
}

export async function inviteToDoc(roomId: string, email: string) {
	auth().protect();

	try {
		await adminDb.collection('rooms').doc(roomId).set({
			userId: email,
			role: 'editor',
			createdAt: new Date(),
			roomId,
		});

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false };
	}
}

export async function deleteFromRoom(roomId: string, userId: string) {
	auth().protect();

	try {
		await adminDb.collection('users').doc(userId).collection('rooms').doc(roomId).delete();

		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false };
	}
}
