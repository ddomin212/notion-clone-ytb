import Liveblocks from '@/components/Liveblocks';
import React from 'react';

type Props = {
	children: React.ReactNode;
};

function layout({ children }: Props) {
	return <Liveblocks>{children}</Liveblocks>;
}

export default layout;
