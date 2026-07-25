import { Client, Account, Databases, Query } from 'appwrite';

const endpoint = 'https://fra.cloud.appwrite.io/v1';
const projectId = '6a64cbeb0009826c9efc';
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const newsCollectionId = import.meta.env.VITE_APPWRITE_NEWS_COLLECTION_ID;
export const client = new Client().setEndpoint(endpoint).setProject(projectId);
export const account = new Account(client);
export const databases = new Databases(client);

export async function loadNews() {
  if (!databaseId || !newsCollectionId) return [];
  const result = await databases.listDocuments(databaseId, newsCollectionId, [Query.orderDesc('date'), Query.limit(6)]);
  return result.documents.map(item => [item.date, item.dateLabel, item.title, item.text]);
}
