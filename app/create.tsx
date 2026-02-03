import { useState } from 'react';
import { 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    StyleSheet, 
    Alert,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { router } from 'expo-router';
import { databases, APPWRITE_CONFIG } from '../lib/appwrite';

export default function Create() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await databases.createDocument(
                APPWRITE_CONFIG.databaseId,
                APPWRITE_CONFIG.collectionId,
                'unique()',
                {
                    title: title.trim(),
                    description: description.trim(),
                }
            );
            router.back();
        } catch (error) {
            console.error('Error creating item:', error);
            Alert.alert('Error', 'Failed to create item. Please check your Appwrite configuration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Create New Item</Text>
                
                <View style={styles.form}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Enter item title"
                        placeholderTextColor="#999"
                    />
                    
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Enter item description"
                        placeholderTextColor="#999"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleCreate}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Creating...' : 'Create Item'}
                        </Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        marginBottom: 16,
        color: '#333',
    },
    textArea: {
        minHeight: 100,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
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
