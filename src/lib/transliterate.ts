const cyrillicToLatin: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'yo',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'shch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya',
}

const latinToCyrillicMulti: Record<string, string> = {
	shch: 'щ',
	yo: 'ё',
	zh: 'ж',
	ts: 'ц',
	ch: 'ч',
	sh: 'ш',
	yu: 'ю',
	ya: 'я',
}

const latinToCyrillicSingle: Record<string, string> = {
	a: 'а',
	b: 'б',
	c: 'к',
	d: 'д',
	e: 'е',
	f: 'ф',
	g: 'г',
	h: 'х',
	i: 'и',
	j: 'й',
	k: 'к',
	l: 'л',
	m: 'м',
	n: 'н',
	o: 'о',
	p: 'п',
	q: 'к',
	r: 'р',
	s: 'с',
	t: 'т',
	u: 'у',
	v: 'в',
	w: 'в',
	x: 'кс',
	y: 'ы',
	z: 'з',
}

export function transliterate(text: string): string {
	const lower = text.toLowerCase()
	let result = ''

	for (let index = 0; index < lower.length; index++) {
		const triple = lower.slice(index, index + 4)
		if (latinToCyrillicMulti[triple]) {
			result += latinToCyrillicMulti[triple]
			index += 3
			continue
		}

		const duo = lower.slice(index, index + 2)
		if (latinToCyrillicMulti[duo]) {
			result += latinToCyrillicMulti[duo]
			index += 1
			continue
		}

		const char = lower[index]
		if (cyrillicToLatin[char]) {
			result += cyrillicToLatin[char]
			continue
		}

		if (latinToCyrillicSingle[char]) {
			result += latinToCyrillicSingle[char]
			continue
		}

		result += char
	}

	return result
}
