export type WSMessage =
	| { type: 'auth'; token: string }
	| { type: 'subscribe'; channel: string }
	| { type: 'unsubscribe'; channel: string }
	| { type: 'ping' }
	| { type: 'event'; name: string; payload: unknown }
	| { action: string }

type WSClientOptions = {
	pingIntervalMs?: number
	reconnectBaseMs?: number
	reconnectMaxMs?: number
	queueLimit?: number
	onMessage?: (direction: 'in' | 'out', message: unknown) => void
	onOpen?: () => void
	onClose?: () => void
	onError?: () => void
}

type Listener = (payload: unknown) => void

export class WSClient {
	private ws: WebSocket | null = null
	private url: string
	private token: string | null = null
	private reconnectAttempts = 0
	private channels = new Set<string>()
	private listeners = new Map<string, Set<Listener>>()
	private queue: string[] = []
	private pingTimerId: number | null = null
	private reconnectTimerId: number | null = null
	private shouldReconnect = true
	private options: Required<WSClientOptions>

	constructor(url: string, options: WSClientOptions = {}) {
		this.url = url
		this.options = {
			pingIntervalMs: options.pingIntervalMs ?? 25000,
			reconnectBaseMs: options.reconnectBaseMs ?? 500,
			reconnectMaxMs: options.reconnectMaxMs ?? 10000,
			queueLimit: options.queueLimit ?? 200,
			onMessage: options.onMessage ?? (() => {}),
			onOpen: options.onOpen ?? (() => {}),
			onClose: options.onClose ?? (() => {}),
			onError: options.onError ?? (() => {}),
		}
	}

	setToken(token: string | null) {
		this.token = token
	}

	connect(token?: string) {
		if (token) this.token = token
		if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return
		if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
			return
		}

		this.shouldReconnect = true
		this.ws = new WebSocket(this.url)

		this.ws.onopen = () => {
			this.reconnectAttempts = 0
			this.flushQueue()
			if (this.token) this.send({ type: 'auth', token: this.token })
			for (const channel of this.channels) {
				this.send({ type: 'subscribe', channel })
			}
			this.startPing()
			this.options.onOpen()
		}

		this.ws.onmessage = (event) => {
			let msg: WSMessage
			try {
				msg = JSON.parse(event.data)
			} catch {
				return
			}
			this.options.onMessage('in', msg)

			if ('type' in msg && msg.type === 'event') {
				this.emit(msg.name, msg.payload)
				return
			}

			if ('action' in msg && typeof msg.action === 'string') {
				this.emit(msg.action, msg)
			}
		}

		this.ws.onclose = () => {
			this.ws = null
			this.stopPing()
			this.options.onClose()
			if (this.shouldReconnect) this.scheduleReconnect()
		}

		this.ws.onerror = () => {
			this.options.onError()
		}
	}

	disconnect() {
		this.shouldReconnect = false
		this.stopPing()
		if (this.reconnectTimerId) {
			window.clearTimeout(this.reconnectTimerId)
			this.reconnectTimerId = null
		}
		this.ws?.close()
		this.ws = null
	}

	subscribe(channel: string) {
		this.channels.add(channel)
		this.send({ type: 'subscribe', channel })
	}

	unsubscribe(channel: string) {
		this.channels.delete(channel)
		this.send({ type: 'unsubscribe', channel })
	}

	on(eventName: string, cb: Listener) {
		if (!this.listeners.has(eventName)) {
			this.listeners.set(eventName, new Set())
		}
		this.listeners.get(eventName)?.add(cb)
		return () => this.off(eventName, cb)
	}

	off(eventName: string, cb: Listener) {
		this.listeners.get(eventName)?.delete(cb)
		if (this.listeners.get(eventName)?.size === 0) {
			this.listeners.delete(eventName)
		}
	}

	private emit(eventName: string, payload: unknown) {
		const set = this.listeners.get(eventName)
		if (!set) return
		for (const cb of set) cb(payload)
	}

	send(message: WSMessage) {
		const data = JSON.stringify(message)
		this.options.onMessage('out', message)
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(data)
			return
		}
		this.enqueue(data)
	}

	private enqueue(data: string) {
		this.queue.push(data)
		if (this.queue.length > this.options.queueLimit) {
			this.queue.shift()
		}
	}

	private flushQueue() {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
		while (this.queue.length) {
			const item = this.queue.shift()
			if (item) this.ws.send(item)
		}
	}

	private startPing() {
		if (this.options.pingIntervalMs <= 0 || typeof window === 'undefined') return
		this.stopPing()
		this.pingTimerId = window.setInterval(() => {
			this.send({ type: 'ping' })
		}, this.options.pingIntervalMs)
	}

	private stopPing() {
		if (this.pingTimerId) {
			window.clearInterval(this.pingTimerId)
			this.pingTimerId = null
		}
	}

	private scheduleReconnect() {
		if (typeof window === 'undefined') return
		this.reconnectAttempts += 1
		const delay = Math.min(
			this.options.reconnectMaxMs,
			this.options.reconnectBaseMs * 2 ** (this.reconnectAttempts - 1),
		)
		this.reconnectTimerId = window.setTimeout(() => {
			this.connect()
		}, delay)
	}
}
