'use client';

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';

import React from 'react';
import Brotcrumb from './Brotcrumb';

type Props = {};

function Header({}: Props) {
	const { user } = useUser();

	return (
		<div className="flex items-center justify-between p-5">
			{user && (
				<h1 className="text-2xl">
					{user?.firstName || user?.emailAddresses[0].toString().split('@')[0]}
					{"'s"}
				</h1>
			)}

			<Brotcrumb />

			<div>
				<SignedOut>
					<SignInButton />
				</SignedOut>

				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</div>
	);
}

export default Header;
