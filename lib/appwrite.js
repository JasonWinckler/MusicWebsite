import { Client, Account, Databases, Query } from 'appwrite';

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const newsCollectionId = import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID;
export const isAppwriteConfigured = Boolean(endpoint && projectId);
export const client = isAppwriteConfigured ? new Client().setEndpoint(endpoint).setProject(projectId) : null;
export const account = client ? new Account(client) : null;
export const databases = client ? new Databases(client) : null;

export async function loadNews() {
  if (!databases || !databaseId || !newsCollectionId) return [];
  const result = await databases.listDocuments(databaseId, newsCollectionId, [Query.orderDesc('date'), Query.limit(6)]);
  return result.documents.map(item => [item.date, item.dateLabel, item.title, item.text]);
}
