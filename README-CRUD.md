# React Native App with Appwrite CRUD

A complete CRUD (Create, Read, Update, Delete) application built with React Native (Expo) and Appwrite backend.

## 📁 Project Structure

```
my-app/
├── app/
│   ├── _layout.tsx          # Navigation setup with Stack navigator
│   ├── index.tsx            # Main screen - List all documents
│   ├── create.tsx           # Screen - Create new document
│   └── edit/
│       └── [id].tsx         # Dynamic route - Edit existing document
├── lib/
│   └── appwrite.ts          # Appwrite configuration & schema
├── .env                     # Environment variables
├── package.json             # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Expo CLI
- Appwrite Cloud account or self-hosted instance

### Installation

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

## ⚙️ Appwrite Configuration

### Environment Variables

Edit `.env` file with your Appwrite credentials:

```env
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your-database-id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your-collection-id
```

### Appwrite Setup

1. **Create a Project** in Appwrite Console
2. **Create a Database** with a unique ID
3. **Create a Collection** with the following attributes:

| Attribute | Type | Size | Required |
|-----------|------|------|----------|
| EventName | string | 255 | Yes |
| location | string | 255 | Yes |
| time | datetime | - | Yes |
| host | string | 255 | Yes |

4. **Set Permissions**: Go to Collection Settings → Permissions → Add "Any" role with read/write permissions

## 📝 Schema Configuration

The app uses a dynamic schema defined in [`lib/appwrite.ts`](lib/appwrite.ts). To customize fields:

```typescript
export const COLLECTION_SCHEMA = {
    fields: [
        { key: 'EventName', label: 'Event Name', type: 'string', required: true },
        { key: 'location', label: 'Location', type: 'string', required: true },
        { key: 'time', label: 'Time', type: 'datetime', required: true },
        { key: 'host', label: 'Host', type: 'string', required: true },
        // Add more fields as needed
    ]
};
```

### Field Types

- `string` - Text input
- `datetime` - Date/time input
- `integer` - Numeric input
- `boolean` - Toggle switch
- `email` - Email input
- `url` - URL input

## 📱 Screens

### 1. Home Screen (`app/index.tsx`)
- Displays all documents in a list
- Pull-to-refresh functionality
- Edit and delete buttons for each item
- FAB (Floating Action Button) to add new items

### 2. Create Screen (`app/create.tsx`)
- Dynamic form based on schema
- Validates required fields
- Creates new document in Appwrite

### 3. Edit Screen (`app/edit/[id].tsx`)
- Dynamic form pre-filled with existing data
- Updates document in Appwrite
- Delete functionality

## 🔧 Appwrite Library (`lib/appwrite.ts`)

This file contains all Appwrite-related code:

```typescript
// Client setup
export const client = new Client()
    .setProject(projectId)
    .setEndpoint(endpoint);

// Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Configuration
export const APPWRITE_CONFIG = {
    projectId,
    endpoint,
    databaseId,
    collectionId,
};

// Schema definition
export const COLLECTION_SCHEMA = {
    fields: [...]
};
```

## 🛠 Dependencies

- `react-native-appwrite` - Appwrite SDK for React Native
- `react-native-url-polyfill` - URL polyfill for React Native
- `expo-router` - File-based navigation
- `@react-navigation/native` - Navigation library

## 📋 Scripts

```bash
npm start          # Start development server
npm run android    # Run on Android emulator
npm run ios        # Run on iOS simulator
npm run web        # Run as web app
npm run lint       # Run ESLint
```

## 🔒 Security

- Never commit `.env` file to version control
- Use Appwrite's built-in authentication for production apps
- Set proper permissions on collections and buckets
- Use environment variables for all sensitive data

## 📖 Learn More

- [Appwrite Documentation](https://appwrite.io/docs)
- [Expo Documentation](https://docs.expo.dev)
- [React Native Appwrite SDK](https://github.com/appwrite/sdk-for-react-native)
