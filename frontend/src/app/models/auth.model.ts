import { AccessibilityPreferences } from './user.model';

export interface UserResponse {
  id: string;
  userName: string;
  email: string;
  accessibilityPreferences: AccessibilityPreferences;
  token: string;
} 