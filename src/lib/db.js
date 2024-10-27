import { openDB } from 'idb';

const DB_NAME = 'OllamaClient';
const DB_VERSION = 1;
const STORE_NAME = 'chats';

/** @type {Promise<import('idb').IDBPDatabase>} */
let dbPromise;

export function initDB() {
	if (!dbPromise) {
		dbPromise = openDB(DB_NAME, DB_VERSION, {
			upgrade(db) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
			}
		});
	}
	return dbPromise;
}

export async function getChats() {
	const db = await initDB();
	return db.getAll(STORE_NAME);
}

/**
 *
 * @param {string} title
 * @returns {Promise<App.Chat>}
 */
export async function addChat(title) {
	const db = await initDB();
	const newChat = { title, createdAt: new Date() };
	const id = await db.add(STORE_NAME, newChat);
	return { ...newChat, id };
}

/**
 *
 * @param {IDBValidKey} id
 */
export async function deleteChat(id) {
	const db = await initDB();
	await db.delete(STORE_NAME, id);
}
