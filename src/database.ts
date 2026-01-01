import * as SQLite from 'expo-sqlite';
import { Document, Page } from './types';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  db = await SQLite.openDatabaseAsync('docscanner.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY NOT NULL,
      documentId TEXT NOT NULL,
      originalUri TEXT NOT NULL,
      processedUri TEXT NOT NULL,
      filterName TEXT NOT NULL,
      rotation INTEGER NOT NULL DEFAULT 0,
      orderIndex INTEGER NOT NULL,
      FOREIGN KEY (documentId) REFERENCES documents (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_pages_documentId ON pages(documentId);
    CREATE INDEX IF NOT EXISTS idx_pages_order ON pages(documentId, orderIndex);
  `);
};

export const createDocument = async (title: string, pages: Omit<Page, 'id'>[]): Promise<Document> => {
  const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = Date.now();

  await db.runAsync(
    'INSERT INTO documents (id, title, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
    docId, title, timestamp, timestamp
  );

  for (let i = 0; i < pages.length; i++) {
    const pageId = `page_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
    const page = pages[i];
    await db.runAsync(
      'INSERT INTO pages (id, documentId, originalUri, processedUri, filterName, rotation, orderIndex) VALUES (?, ?, ?, ?, ?, ?, ?)',
      pageId, docId, page.originalUri, page.processedUri, page.filterName, page.rotation, page.order
    );
  }

  return getDocument(docId);
};

export const getDocument = async (id: string): Promise<Document> => {
  const doc = await db.getFirstAsync<{ id: string; title: string; createdAt: number; updatedAt: number }>(
    'SELECT * FROM documents WHERE id = ?',
    id
  );

  if (!doc) {
    throw new Error('Document not found');
  }

  const pages = await db.getAllAsync<Page & { orderIndex: number }>(
    'SELECT id, originalUri, processedUri, filterName, rotation, orderIndex as "order" FROM pages WHERE documentId = ? ORDER BY orderIndex',
    id
  );

  return {
    ...doc,
    pages: pages as Page[]
  };
};

export const getAllDocuments = async (): Promise<Document[]> => {
  const docs = await db.getAllAsync<{ id: string; title: string; createdAt: number; updatedAt: number }>(
    'SELECT * FROM documents ORDER BY createdAt DESC'
  );

  const documents: Document[] = [];
  for (const doc of docs) {
    const pages = await db.getAllAsync<Page & { orderIndex: number }>(
      'SELECT id, originalUri, processedUri, filterName, rotation, orderIndex as "order" FROM pages WHERE documentId = ? ORDER BY orderIndex',
      doc.id
    );
    documents.push({
      ...doc,
      pages: pages as Page[]
    });
  }

  return documents;
};

export const updateDocument = async (id: string, title: string): Promise<void> => {
  await db.runAsync(
    'UPDATE documents SET title = ?, updatedAt = ? WHERE id = ?',
    title, Date.now(), id
  );
};

export const deleteDocument = async (id: string): Promise<void> => {
  await db.runAsync('DELETE FROM documents WHERE id = ?', id);
  await db.runAsync('DELETE FROM pages WHERE documentId = ?', id);
};

export const updatePageOrder = async (documentId: string, pageIds: string[]): Promise<void> => {
  for (let i = 0; i < pageIds.length; i++) {
    await db.runAsync(
      'UPDATE pages SET orderIndex = ? WHERE id = ? AND documentId = ?',
      i, pageIds[i], documentId
    );
  }
  await db.runAsync('UPDATE documents SET updatedAt = ? WHERE id = ?', Date.now(), documentId);
};

export const updatePageFilter = async (pageId: string, processedUri: string, filterName: string): Promise<void> => {
  await db.runAsync(
    'UPDATE pages SET processedUri = ?, filterName = ? WHERE id = ?',
    processedUri, filterName, pageId
  );
};

export const deletePage = async (documentId: string, pageId: string): Promise<void> => {
  await db.runAsync('DELETE FROM pages WHERE id = ?', pageId);
  await db.runAsync('UPDATE documents SET updatedAt = ? WHERE id = ?', Date.now(), documentId);
};
