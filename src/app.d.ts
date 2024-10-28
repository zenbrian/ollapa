// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface Message {
			role: string;
			content: string;
			timestamp: Date;
		}

		interface Chat {
			id: IDBValidKey;
			title: string;
			createdAt: Date;
			modifiedAt: Date;
			messages: Message[];
		}
	}
}

export {};
