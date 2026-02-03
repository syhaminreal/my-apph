import { useState } from 'react';
import { 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { databases, APPWRITE_CONFIG, COLLECTION_SCHEMA } from '../lib/appwrite';

// Create a type from the schema
type FormData = Record<string, string>;

export default function Create() {
    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleCreate = async () => {
        // Validate required fields
        for (const field of COLLECTION_SCHEMA.fields) {
            if (field.required && !formData[field.key]?.trim()) {
                Alert.alert('Error', `${field.label} is required`);
                return;
            }
        }

        setLoading(true);
        try {
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                'unique()',
                formData
            );
            router.back();
        } catch (error) {
            console.error('Error creating document:', error);
            Alert.alert('Error', 'Failed to create document. Check your Appwrite configuration.');
        } finally {
            setLoading(false);
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

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Create New Event</Text>
                
                <View style={styles.form}>
                    {COLLECTION_SCHEMA.fields.map(renderField)}
                    
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating...' : 'Create'}
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
