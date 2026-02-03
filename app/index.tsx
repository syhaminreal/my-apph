import { useEffect, useState } from 'react';
import { 
    FlatList, 
    Text, 
    View, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { databases, APPWRITE_CONFIG, COLLECTION_SCHEMA } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';

interface Document {
    $id: string;
    [key: string]: any;
}

export default function Index() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchDocuments = async () => {
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                [Query.orderDesc('$createdAt')]
            );
            setDocuments(response.documents as unknown as Document[]);
        } catch (error) {
            console.error('Error fetching documents:', error);
            Alert.alert('Error', 'Failed to fetch documents. Check your Appwrite configuration.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDocuments();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await databases.deleteDocument(
                                APPWRITE_CONFIG.databaseId,
                                APPWRITE_CONFIG.collectionId,
                                id
                            );
                            fetchDocuments();
                        } catch (error) {
                            console.error('Error deleting document:', error);
                            Alert.alert('Error', 'Failed to delete document');
                        }
                    }
                }
            ]
        );
    };

    const formatFieldValue = (value: any, type: string): string => {
        if (value === null || value === undefined) return 'N/A';
        
        if (type === 'datetime') {
            try {
                const date = new Date(value);
                return date.toLocaleString();
            } catch {
                return String(value);
            }
        }
        
        return String(value);
    };

    const renderItem = ({ item }: { item: Document }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {COLLECTION_SCHEMA.fields.map(field => (
                    <Text key={field.key} style={styles.field}>
                        <Text style={styles.fieldLabel}>{field.label}: </Text>
                        {formatFieldValue(item[field.key], field.type)}
                    </Text>
                ))}
            </View>
            <View style={styles.cardActions}>
                <TouchableOpacity 
                    style={[styles.button, styles.editButton]}
                    onPress={() => router.push(`/edit/${item.$id}`)}
                >
                    <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => handleDelete(item.$id)}
                >
                    <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Events</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => router.push('/create')}
                >
                    <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
            </View>

            {documents.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No documents yet</Text>
                    <Text style={styles.emptySubText}>Tap "Add New" to create your first item</Text>
                </View>
            ) : (
                <FlatList
                    data={documents}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.$id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    listContent: {
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        marginBottom: 12,
    },
    field: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    fieldLabel: {
        fontWeight: '600',
        color: '#333',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
    },
    editButton: {
        backgroundColor: '#007AFF',
    },
    deleteButton: {
        backgroundColor: '#FFE5E5',
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 14,
    },
    deleteButtonText: {
        color: '#FF3B30',
    },
});
