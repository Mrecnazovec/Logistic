'use client'

import { useFolderPage } from '../hooks/useFolderPage'
import { FolderDocumentsList } from './FolderDocumentsList'
import { FolderPageHeader } from './FolderPageHeader'
import { DocumentListSkeleton, EmptyState } from './FolderPageStates'
import { FolderUploadDropzone } from './FolderUploadDropzone'
import { FolderUploadQueue } from './FolderUploadQueue'

export function FolderPageView() {
	const {
		t,
		isLoading,
		resolvedFolderLabel,
		documentsCountLabel,
		isUploadBlocked,
		isParticipantRestricted,
		fileInputRef,
		isDragActive,
		uploadQueue,
		documentsForFolder,
		hasNoContent,
		statusLabels,
		dateLocale,
		formatFileSize,
		handleInputChange,
		handleDrop,
		handleDragOver,
		handleDragLeave,
		handleKeyDown,
		handleRemoveFromQueue,
		openFilePicker,
	} = useFolderPage()

	return (
		<>
			<section className='rounded-4xl bg-background p-8 space-y-8 mb-4'>
				<FolderPageHeader
					title={resolvedFolderLabel}
					documentsCountLabel={documentsCountLabel}
					sectionLabel={t('order.docs.section.documents')}
				/>

				<FolderUploadDropzone
					isUploadBlocked={isUploadBlocked}
					isParticipantRestricted={isParticipantRestricted}
					isDragActive={isDragActive}
					fileInputRef={fileInputRef}
					isUploading={uploadQueue.some((item) => item.status === 'uploading')}
					onClick={openFilePicker}
					onKeyDown={handleKeyDown}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					onChange={handleInputChange}
					t={t}
				/>
			</section>

			<section className='space-y-4'>
				<div className='flex items-center justify-between'>
					{!isUploadBlocked && uploadQueue.length ? (
						<span className='text-sm text-muted-foreground'>{t('order.docs.upload.queue', { count: uploadQueue.length })}</span>
					) : null}
				</div>

				{!isUploadBlocked ? (
					<FolderUploadQueue
						uploadQueue={uploadQueue}
						onRemove={handleRemoveFromQueue}
						formatFileSize={formatFileSize}
						statusLabels={statusLabels}
						fileLabel={t('order.docs.fileLabel')}
						removeLabel={t('order.docs.removeFile')}
					/>
				) : null}

				{isLoading ? (
					<DocumentListSkeleton />
				) : (
					<FolderDocumentsList
						documents={documentsForFolder}
						formatFileSize={formatFileSize}
						dateLocale={dateLocale}
						downloadLabel={t('order.docs.download')}
						uploadedByLabel={t('order.docs.uploadedBy')}
						fileLabel={t('order.docs.fileLabel')}
					/>
				)}

				{hasNoContent ? <EmptyState title={t('order.docs.empty.title')} description={t('order.docs.empty.description')} /> : null}
			</section>
		</>
	)
}
