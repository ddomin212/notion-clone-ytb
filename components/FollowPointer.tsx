'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer } from 'lucide-react';
import generateRandomColor from '@/lib/color';

type Props = {
	x: number;
	y: number;
	info: {
		name: string;
		email: string;
		avatar: string;
	};
};

function FollowPointer({ x, y, info: { name, email, avatar } }: Props) {
	const color = generateRandomColor(email);

	return (
		<motion.div
			className="h-4 w-4 rounded-full absolute z-50"
			initial={{ scale: 1, opacity: 1 }}
			animate={{ scale: 1, opacity: 1 }}
			exit={{ scale: 1, opacity: 1 }}
			style={{ top: y, left: x, pointerEvents: 'none' }}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill={color}
				stroke={color}
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				className="lucide lucide-mouse-pointer h-6 w-6"
			>
				<path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
				<path d="m13 13 6 6" />
				<motion.div
					initial={{ scale: 0.5, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					exit={{ scale: 0.5, opacity: 0 }}
					style={{ backgroundColor: color }}
					className="px-2 py-2 bg-neutral-200 text-black font-bold whitespace-nowrap min-w-max text-xs rounded-full"
				>
					{name || 'Anonymous'}
				</motion.div>
			</svg>
		</motion.div>
	);
}

export default FollowPointer;
