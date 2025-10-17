'use client'

import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Highlighter,
	Italic,
	Link as LinkIcon,
	Link2Off,
	List,
	ListOrdered,
	Strikethrough,
	PlaySquare,
} from 'lucide-react'
import { Editor } from '@tiptap/react'
import { Toggle } from '../../Toggle'
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '../Input'
// import { useUpload } from '../image-upload/useUpload'

export default function MenuBar({ editor }: { editor: Editor | null }) {
	const [open, setOpen] = useState(false)
	const [url, setUrl] = useState('')

	const [videoOpen, setVideoOpen] = useState(false)
	const [videoUrl, setVideoUrl] = useState('')

	useEffect(() => {
		if (open && editor) {
			const existingUrl = editor.getAttributes('link')?.href || ''
			setUrl(existingUrl)
		}
	}, [open, editor])

	if (!editor) return null

	// const { handleButtonClick, handleFileChange, fileInputRef } = useUpload((url) => {
	// 	editor.chain().focus().setImage({ src: url }).run()
	// })

	const Options = [
		// {
		// 	icon: <Heading1 className='size-4' />,
		// 	onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
		// 	preesed: editor.isActive('heading', { level: 1 }),
		// },
		// {
		// 	icon: <Heading2 className='size-4' />,
		// 	onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
		// 	preesed: editor.isActive('heading', { level: 2 }),
		// },
		// {
		// 	icon: <Heading3 className='size-4' />,
		// 	onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
		// 	preesed: editor.isActive('heading', { level: 3 }),
		// },
		{
			icon: <Bold className='size-4' />,
			onClick: () => editor.chain().focus().toggleBold().run(),
			preesed: editor.isActive('bold'),
		},
		{
			icon: <Italic className='size-4' />,
			onClick: () => editor.chain().focus().toggleItalic().run(),
			preesed: editor.isActive('italic'),
		},
		{
			icon: <Strikethrough className='size-4' />,
			onClick: () => editor.chain().focus().toggleStrike().run(),
			preesed: editor.isActive('strike'),
		},
		{
			icon: <AlignLeft className='size-4' />,
			onClick: () => editor.chain().focus().setTextAlign('left').run(),
			preesed: editor.isActive({ textAlign: 'left' }),
		},
		{
			icon: <AlignCenter className='size-4' />,
			onClick: () => editor.chain().focus().setTextAlign('center').run(),
			preesed: editor.isActive({ textAlign: 'center' }),
		},
		{
			icon: <AlignRight className='size-4' />,
			onClick: () => editor.chain().focus().setTextAlign('right').run(),
			preesed: editor.isActive({ textAlign: 'right' }),
		},
		{
			icon: <List className='size-4' />,
			onClick: () => editor.chain().focus().toggleBulletList().run(),
			preesed: editor.isActive('bulletList'),
		},
		{
			icon: <ListOrdered className='size-4' />,
			onClick: () => editor.chain().focus().toggleOrderedList().run(),
			preesed: editor.isActive('orderedList'),
		},
		{
			icon: <Highlighter className='size-4' />,
			onClick: () => editor.chain().focus().toggleHighlight().run(),
			preesed: editor.isActive('highlight'),
		},
	]

	return (
		<div className='rounded-full p-1 mb-1 bg-grayscale-50 space-x-2 z-10 flex flex-wrap items-center'>
			{Options.map((option, index) => (
				<Toggle key={index} pressed={option.preesed} onPressedChange={option.onClick}>
					{option.icon}
				</Toggle>
			))}

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Toggle pressed={editor.isActive('link')} onPressedChange={() => setOpen(true)}>
						<LinkIcon className='size-4' />
					</Toggle>
				</DialogTrigger>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Добавить / изменить ссылку</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-3'>
						<Input type='url' placeholder='https://example.com' value={url} onChange={(e) => setUrl(e.target.value)} />
						<Button
							onClick={() => {
								if (!url) {
									editor.chain().focus().unsetLink().run()
								} else {
									editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
								}
								setOpen(false)
								setUrl('')
							}}
						>
							Применить
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<Toggle
				pressed={false}
				onPressedChange={() => {
					editor.chain().focus().unsetLink().run()
				}}
			>
				<Link2Off className='size-4' />
			</Toggle>

			{/* <Toggle pressed={false} onPressedChange={handleButtonClick}>
				<ImageIcon className='size-4' />
				<input type='file' accept='image/*' ref={fileInputRef} onChange={(e) => handleFileChange(e, 'images')} className='hidden' />
			</Toggle> */}

			<Dialog open={videoOpen} onOpenChange={setVideoOpen}>
				<DialogTrigger asChild>
					<Toggle pressed={false} onPressedChange={() => setVideoOpen(true)}>
						<PlaySquare className='size-4' />
					</Toggle>
				</DialogTrigger>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Вставить YouTube-видео</DialogTitle>
					</DialogHeader>
					<div className='flex flex-col gap-3'>
						<Input
							type='url'
							placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
							value={videoUrl}
							onChange={(e) => setVideoUrl(e.target.value)}
						/>
						<Button
							onClick={() => {
								editor?.chain().focus().setYoutubeVideo({ src: videoUrl }).run()
								setVideoOpen(false)
								setVideoUrl('')
							}}
						>
							Вставить видео
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
