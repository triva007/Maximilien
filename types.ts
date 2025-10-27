
export type Role = 'user' | 'model';

export interface Message {
  role: Role;
  parts: { text: string }[];
}
