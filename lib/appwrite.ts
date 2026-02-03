import { Client, Databases, Account } from 'react-native-appwrite';

const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '698223300022ead0aec7';
const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '698226cc00165f415310';
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || 'your-collection-id';

export const client = new Client()
    .setProject(projectId)
    .setEndpoint(endpoint);

export const account = new Account(client);
export const databases = new Databases(client);

// Appwrite configuration
export const APPWRITE_CONFIG = {
    projectId,
    endpoint,
    databaseId,
    collectionId,
};
