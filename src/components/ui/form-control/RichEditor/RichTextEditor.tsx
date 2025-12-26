'use client'

// components/ui/form-element/RichTextEditor.tsx

import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useI18n } from '@/i18n/I18nProvider'
import { useEffect } from 'react'
import MenuBar from './MenuBar'

interface RichTextEditorProps {
	value: string
	onChange: (value: string) => void
	disabled?: boolean
	placeholder?: string
}

export function RichTextEditor({ value, onChange, disabled, placeholder }: RichTextEditorProps) {
	const { t } = useI18n()
	const placeholderText = placeholder ?? t('components.richEditor.placeholder')

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
				placeholder: placeholderText,
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
				class: 'min-h-[156px] rounded-4xl bg-grayscale-50 py-4 px-6 max-w-full',
			},
		},
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		immediatelyRender: false,
		editable: !disabled,
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
