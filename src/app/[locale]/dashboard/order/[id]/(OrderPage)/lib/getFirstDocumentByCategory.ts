export const getFirstDocumentByCategory = <T extends { category?: string | null; created_at?: string | null }>(
	documents: T[],
	category: string,
) => {
	const matches = documents.filter((document) => (document.category ?? '').toLowerCase() === category.toLowerCase())
	if (!matches.length) return null
	return (
		matches.sort((a, b) => new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime())[0] ?? null
	)
}
