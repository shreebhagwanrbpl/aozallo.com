import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
let database;

function resolveDbPath() {
  return process.env.SQLITE_DB_PATH
    ? path.resolve(process.env.SQLITE_DB_PATH)
    : path.resolve(process.cwd(), "../SuperAdminRBPL/data/catalog.db");
}

export function getSqliteDb() {
  if (database) return database;

  const dbPath = resolveDbPath();
  if (!fs.existsSync(dbPath)) {
    throw new Error(`SQLite catalog database not found: ${dbPath}`);
  }

  database = new DatabaseSync(dbPath, { readOnly: true });
  database.exec("PRAGMA query_only = ON;");
  database.exec("PRAGMA read_uncommitted = ON;");
  return database;
}

export function getSqliteDbPath() {
  return resolveDbPath();
}

export function readDocumentsWhereCollection(collectionPath) {
  const db = getSqliteDb();
  const stmt = db.prepare(
    "SELECT path, collection_path, doc_id, data, updated_at FROM documents WHERE collection_path = ? ORDER BY path"
  );
  return stmt.all(collectionPath).map(parseDocumentRow);
}

export function readDocument(documentPath) {
  const db = getSqliteDb();
  const row = db.prepare(
    "SELECT path, collection_path, doc_id, data, updated_at FROM documents WHERE path = ? LIMIT 1"
  ).get(documentPath);
  return row ? parseDocumentRow(row) : null;
}

export function readAllDocuments() {
  const db = getSqliteDb();
  return db.prepare(
    "SELECT path, collection_path, doc_id, data, updated_at FROM documents ORDER BY path"
  ).all().map(parseDocumentRow);
}

function parseDocumentRow(row) {
  let data = {};
  try {
    data = row?.data ? JSON.parse(row.data) : {};
  } catch (error) {
    console.error("Invalid JSON in SQLite document:", row?.path, error);
  }
  return { ...row, data };
}
