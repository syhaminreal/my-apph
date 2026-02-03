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
import { databases, APPWRITE_CONFIG } from '../lib/appwrite';
import { Query } from 'react-native-appwrite';

interface Item {
    $id: string;
    title: string;
    description: string;
}

export default function Index() {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchItems = async () => {
        try {
            const response = await databases.listDocuments(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                [Query.orderDesc('$createdAt')]
            );
            setItems(response.documents as unknown as Item[]);
        } catch (error) {
            console.error('Error fetching items:', error);
            Alert.alert('Error', 'Failed to fetch items. Make sure Appwrite is configured correctly.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Item',
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
                            fetchItems();
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Item }) => (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
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
                <Text style={styles.loadingText}>Loading items...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Items</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => router.push('/create')}
                >
                    <Text style={styles.addButtonText}>+ Add Item</Text>
                </TouchableOpacity>
            </View>

            {items.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No items yet</Text>
                    <Text style={styles.emptySubText}>Tap "Add Item" to create your first item</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
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
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
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
