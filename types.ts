
// The role must be 'user' or 'model' to match the Gemini API's history format.
export type Role = 'user' | 'model';

// This structure is now used both for displaying messages and for sending history.
export interface Message {
  role: Role;
  parts: [{ text: string }];
}
