import { useEffect, useState } from 'react';
import { 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { databases, APPWRITE_CONFIG, COLLECTION_SCHEMA } from '../../lib/appwrite';
import { showAlert, logOperationStart, logOperationComplete, logApiError, parseAppwriteError } from '../../lib/alerts';

// Create a type from the schema
type FormData = Record<string, string>;

interface Document {
    $id: string;
    [key: string]: any;
}

export default function Edit() {
    const { id } = useLocalSearchParams();
    const [document, setDocument] = useState<Document | null>(null);
    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchDocument();
    }, [id]);

    const fetchDocument = async () => {
        logOperationStart('FETCH_DOCUMENT', `Loading document: ${id}`);
        
        try {
            const response = await databases.getDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                id as string
            );
            setDocument(response as unknown as Document);
            
            // Initialize form data from document
            const initialData: FormData = {};
            COLLECTION_SCHEMA.fields.forEach(field => {
                initialData[field.key] = response[field.key] || '';
            });
            setFormData(initialData);
            
            logOperationComplete('FETCH_DOCUMENT', { id });
        } catch (error) {
            logApiError('FETCH_DOCUMENT', error);
            const userMessage = parseAppwriteError(error);
            showAlert('error', 'Fetch Failed', userMessage);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleUpdate = async () => {
        // Validate required fields
        for (const field of COLLECTION_SCHEMA.fields) {
            if (field.required && !formData[field.key]?.trim()) {
                showAlert('error', 'Validation Error', `${field.label} is required`);
                return;
            }
        }

        setSaving(true);
        logOperationStart('UPDATE_DOCUMENT', `Updating document: ${id}`);
        
        try {
            await databases.updateDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                id as string,
                formData
            );
            
            logOperationComplete('UPDATE_DOCUMENT', { id, changes: Object.keys(formData) });
            showAlert('success', 'Saved', 'Event updated successfully!', `Updated event: ${formData.EventName || 'Unknown'}`);
            
            // Navigate back after a short delay to show the success alert
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            logApiError('UPDATE_DOCUMENT', error);
            const userMessage = parseAppwriteError(error);
            showAlert('error', 'Update Failed', userMessage);
        } finally {
            setSaving(false);
        }
    };

    const renderField = (field: typeof COLLECTION_SCHEMA.fields[0]) => {
        const isDateTime = field.type === 'datetime';
        const placeholder = isDateTime ? 'YYYY-MM-DD HH:mm' : `Enter ${field.label.toLowerCase()}`;

        return (
            <View key={field.key} style={styles.fieldContainer}>
                <Text style={styles.label}>{field.label} {field.required && '*'}</Text>
                <TextInput
                    style={styles.input}
                    value={formData[field.key] || ''}
                    onChangeText={(value) => handleChange(field.key, value)}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    multiline={field.key === 'description'}
                    numberOfLines={field.key === 'description' ? 4 : 1}
                    textAlignVertical={field.key === 'description' ? 'top' : 'center'}
                />
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Edit</Text>
                
                <View style={styles.form}>
                    {COLLECTION_SCHEMA.fields.map(renderField)}
                    
                    <TouchableOpacity 
                        style={[styles.button, saving && styles.buttonDisabled]}
                        onPress={handleUpdate}
                        disabled={saving}
                    >
                        <Text style={styles.buttonText}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonDisabled: {
        backgroundColor: '#99BFFF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
    },
});
