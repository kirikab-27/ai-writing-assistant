import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Document } from '../types/Document';

interface WritingAssistantDB extends DBSchema {
  documents: {
    key: string;
    value: Document;
    indexes: { 'by-updated': Date };
  };
}

const DB_NAME = 'writing-assistant';
const DB_VERSION = 1;

let db: IDBPDatabase<WritingAssistantDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<WritingAssistantDB>> {
  if (!db) {
    db = await openDB<WritingAssistantDB>(DB_NAME, DB_VERSION, {
      upgrade(database) {
        if (!database.objectStoreNames.contains('documents')) {
          const store = database.createObjectStore('documents', { keyPath: 'id' });
          store.createIndex('by-updated', 'updatedAt');
        }
      },
    });
  }
  return db;
}

export async function getAllDocuments(): Promise<Document[]> {
  const database = await getDB();
  const tx = database.transaction('documents', 'readonly');
  const index = tx.store.index('by-updated');
  const documents = await index.getAll();
  await tx.done;
  return documents.reverse(); // Most recent first
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const database = await getDB();
  return database.get('documents', id);
}

export async function saveDocument(document: Document): Promise<void> {
  const database = await getDB();
  await database.put('documents', document);
}

export async function deleteDocument(id: string): Promise<void> {
  const database = await getDB();
  await database.delete('documents', id);
}

export async function createNewDocument(): Promise<Document> {
  const now = new Date();
  const document: Document = {
    id: crypto.randomUUID(),
    title: 'Untitled Document',
    content: '',
    createdAt: now,
    updatedAt: now,
  };
  await saveDocument(document);
  return document;
}