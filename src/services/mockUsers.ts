/** Mock user records — isolated from production code paths. */
export interface MockUser {
  id: string;
  name: string;
  email: string;
  /** Plaintext only for demo purposes. Never do this in production. */
  password: string;
  username: string;
  bio: string;
  avatarUrl: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    password: 'Password1!',
    username: 'alex_rivera',
    bio: 'Senior developer and coffee enthusiast.',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
  },
  {
    id: '2',
    name: 'Sam Chen',
    email: 'sam@example.com',
    password: 'Password1!',
    username: 'sam_chen',
    bio: 'UX designer with a passion for accessibility.',
    avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sam',
  },
];
