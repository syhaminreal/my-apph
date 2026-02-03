import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#fff',
                },
                headerTintColor: '#333',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        >
            <Stack.Screen 
                name="index" 
                options={{ 
                    title: 'Items',
                    headerShown: false,
                }} 
            />
            <Stack.Screen 
                name="create" 
                options={{ 
                    title: 'Create Item',
                    presentation: 'modal',
                }} 
            />
            <Stack.Screen 
                name="edit/[id]" 
                options={{ 
                    title: 'Edit Item',
                    presentation: 'modal',
                }} 
            />
        </Stack>
    );
}
