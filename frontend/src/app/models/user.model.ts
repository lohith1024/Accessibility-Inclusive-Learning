export interface User {
    id: string;
    username: string;
    email: string;
    accessibilityPreferences: AccessibilityPreferences;
    createdAt: Date;
}

export interface AccessibilityPreferences {
    fontSize: string;
    highContrast: boolean;
    screenReader: boolean;
    colorScheme: string;
    reducedMotion: boolean;
}

export interface UserRegistration {
    username: string;
    email: string;
    password: string;
}

export interface UserLogin {
    email: string;
    password: string;
} 