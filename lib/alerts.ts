import { Alert } from 'react-native';

// Alert type for different operation results
export type AlertType = 'success' | 'error' | 'warning';

// Configuration for alert styles
export const ALERT_CONFIG = {
    success: {
        bgColor: '#4CAF50',
        icon: '✅',
    },
    error: {
        bgColor: '#F44336',
        icon: '❌',
    },
    warning: {
        bgColor: '#FF9800',
        icon: '⚠️',
    },
};

/**
 * Show an alert with proper styling based on operation result
 * @param type - The type of alert (success, error, warning)
 * @param title - The title of the alert
 * @param message - The message to display
 * @param logMessage - Optional custom message for console logging
 */
export const showAlert = (
    type: AlertType,
    title: string,
    message: string,
    logMessage?: string
): void => {
    const config = ALERT_CONFIG[type];
    const fullTitle = `${config.icon} ${title}`;

    // Console logging with proper formatting
    if (type === 'success') {
        console.log(`✅ [SUCCESS] ${title}: ${logMessage || message}`);
    } else if (type === 'error') {
        console.error(`❌ [ERROR] ${title}: ${logMessage || message}`);
    } else {
        console.warn(`⚠️ [WARNING] ${title}: ${logMessage || message}`);
    }

    // Show alert with styled message
    Alert.alert(fullTitle, message);
};

/**
 * Log operation start for debugging
 * @param operation - The operation being performed
 * @param details - Additional details
 */
export const logOperationStart = (operation: string, details?: string): void => {
    console.log(`🚀 [${operation}] Started${details ? `: ${details}` : ''}`);
};

/**
 * Log operation completion for debugging
 * @param operation - The operation that completed
 * @param result - The result of the operation
 */
export const logOperationComplete = (operation: string, result?: any): void => {
    console.log(`✅ [${operation}] Completed${result ? `: ${JSON.stringify(result)}` : ''}`);
};

/**
 * Log API error with full details
 * @param operation - The operation that failed
 * @param error - The error object
 */
export const logApiError = (operation: string, error: any): void => {
    console.error(`❌ [${operation}] API Error:`, {
        message: error?.message || 'Unknown error',
        code: error?.code || 'N/A',
        type: error?.type || 'N/A',
        details: error?.response?.body || error,
    });
};

/**
 * Parse Appwrite error and return user-friendly message
 * @param error - The Appwrite error object
 * @returns User-friendly error message
 */
export const parseAppwriteError = (error: any): string => {
    // Handle specific Appwrite error types
    if (error?.type === 'document_invalid_structure') {
        const message = error?.message || '';
        // Extract attribute name from message like 'Attribute "EventName" has invalid type...'
        const attributeMatch = message.match(/"([^"]+)"/);
        const attribute = attributeMatch ? attributeMatch[1] : 'Unknown field';
        return `${attribute}: ${message.replace(/Attribute "[^"]+" has invalid type\. /, '')}`;
    }
    
    if (error?.message) {
        return error.message;
    }
    
    if (typeof error === 'string') {
        return error;
    }
    
    return 'An unexpected error occurred. Please try again.';
};
