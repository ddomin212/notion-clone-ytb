import Room from '@/components/Room';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

type Props = {
	children: React.ReactNode;
	params: { id: string };
};

function layout({ children, params: { id } }: Props) {
	auth().protect();
	return <Room roomId={id}>{children}</Room>;
}

export default layout;
