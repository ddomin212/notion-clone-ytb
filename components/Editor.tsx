import { useRoom, useSelf } from '@liveblocks/react/suspense';
import React, { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { LiveblocksYjsProvider } from '@liveblocks/yjs';
import { Button } from './ui/button';
import { BlockNoteView } from '@blocknote/shadcn';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import generateRandomColor from '@/lib/color';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';

type Props = {
	doc: Y.Doc;
	provider: any;
	darkMode: boolean;
};

function BlockNote({ doc, darkMode, provider }: Props) {
	const userInfo = useSelf((me) => me.info);

	const editor: BlockNoteEditor = useCreateBlockNote({
		collaboration: { provider, fragment: doc.getXmlFragment('document-store'), user: { name: userInfo?.name, color: generateRandomColor(userInfo?.email) } },
	});

	return (
		<div className="relative max-w-6xl mx-auto">
			<BlockNoteView editor={editor} theme={darkMode ? 'dark' : 'light'} className="min-h-screen"></BlockNoteView>
		</div>
	);
}

function Editor({}: {}) {
	const room = useRoom();
	const [doc, setDoc] = useState<Y.Doc>();
	const [provider, setProvider] = useState<LiveblocksYjsProvider>();
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const yDoc = new Y.Doc();
		const yProvider = new LiveblocksYjsProvider(room, yDoc);
		setDoc(yDoc);
		setProvider(yProvider);

		return () => {
			yDoc?.destroy();
			yProvider?.destroy();
		};
	}, [room]);

	if (!doc || !provider) return null;

	const darkModeStyle = `hover:text-white ${
		darkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700' : 'text-gray-700 bg-gray-200 hover:bg-gray-700 hover:text-gray-300'
	}`;

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex items-center gap-2 justify-end mb-5 mt-5">
				{/* Darkmode */}
				<Button className={darkModeStyle} onClick={() => setDarkMode(!darkMode)}>
					{darkMode ? 'light' : 'dark'}
				</Button>
			</div>
			{/* Blocknote */}
			<BlockNote doc={doc} provider={provider} darkMode={darkMode} />
		</div>
	);
}

export default Editor;
