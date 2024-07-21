import { useOthers, useSelf } from '@liveblocks/react/suspense';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {};

function Avatars({}: Props) {
	const others = useOthers();
	const selfUser = useSelf();

	const all = [selfUser, ...others];

	return (
		<>
			<div className="flex gap-2 items-center">
				<p className="font-light text-sm">Users editing this page</p>
				<div className="flex -space-x-5">
					{all.map((other, i) => (
						<TooltipProvider key={other.id + i}>
							<Tooltip>
								<TooltipTrigger>
									<Avatar>
										<AvatarImage src={other?.info.avatar} />
										<AvatarFallback>CN</AvatarFallback>
									</Avatar>
								</TooltipTrigger>
								<TooltipContent>{other?.info.name || other?.info.email}</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</div>
			</div>
		</>
	);
}

export default Avatars;
