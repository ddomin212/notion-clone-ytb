'use client';

import React from 'react';
import { LiveblocksProvider } from '@liveblocks/react/suspense';

type Props = {
	children: React.ReactNode;
};

function Liveblocks({ children }: Props) {
	if (!process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY) throw new Error('ENV not set');
	return (
		<LiveblocksProvider authEndpoint={'/auth-endpoint'} throttle={16}>
			{children}
		</LiveblocksProvider>
	);
}

export default Liveblocks;
