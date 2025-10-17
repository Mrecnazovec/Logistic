// components/ui/form-element/RichTextEditor.tsx
'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
// import ResizeImage from 'tiptap-extension-resize-image'
import Youtube from '@tiptap/extension-youtube'
import { useEffect } from 'react'
import MenuBar from './MenuBar'
import Placeholder from '@tiptap/extension-placeholder'

interface RichTextEditorProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				bulletList: {
					HTMLAttributes: {
						class: 'list-disc ml-3',
					},
				},
				orderedList: {
					HTMLAttributes: {
						class: 'list-decimal ml-3',
					},
				},
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph'],
			}),
			Highlight,
			Link.configure({
				openOnClick: false,
				autolink: true,
				linkOnPaste: true,
				HTMLAttributes: {
					class: 'text-link hover:text-link/80 transition-[color]',
				},
			}),
			Placeholder.configure({
				placeholder: 'Начните писать...',
			}),
			// ResizeImage.configure({
			// 	allowBase64: true,
			// 	HTMLAttributes: {
			// 		class: 'rounded-xl cursor-default',
			// 	},
			// }),
			Youtube.configure({
				inline: false,
				width: 640,
				height: 360,
				allowFullscreen: true,
				HTMLAttributes: {
					class: 'max-w-full aspect-video h-auto',
				},
			}),
		],
		content: value,
		editorProps: {
			attributes: {
				class: 'min-h-[156px] rounded-[32px] bg-grayscale-50 py-4 px-6 max-w-',
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		immediatelyRender: false,
	})

	useEffect(() => {
		if (editor && value !== editor.getHTML()) {
			editor.commands.setContent(value)
		}
	}, [value, editor])

	if (!editor) return null

	return (
		<>
			<MenuBar editor={editor} />
			<div className='w-full max-w-full min-w-0'>
				<EditorContent editor={editor} />
			</div>
		</>
	)
}
