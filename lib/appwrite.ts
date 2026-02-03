import { Client, Databases, Account } from 'react-native-appwrite';

const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '698223300022ead0aec7';
const endpoint = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1';
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '698226cc00165f415310';
const collectionId = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || 'events';

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

// Collection schema - update this to match your Appwrite collection
export const COLLECTION_SCHEMA = {
    fields: [
        { key: 'EventName', label: 'Event Name', type: 'string', required: true },
        { key: 'location', label: 'Location', type: 'string', required: true },
        { key: 'time', label: 'Time', type: 'datetime', required: true },
        { key: 'host', label: 'Host', type: 'string', required: true },
    ]
};

// Get the document type based on schema
export interface EventDocument {
    $id: string;
    EventName: string;
    location: string;
    time: string;
    host: string;
    $createdAt: string;
    $updatedAt: string;
}
