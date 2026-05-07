export interface TeamMember {
  id: string;
  name: string;
  avatarUrl?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: 'u1', name: 'Alice Chen' },
  { id: 'u2', name: 'Bob Smith' },
  { id: 'u3', name: 'Carol White' },
  { id: 'u4', name: 'David Lee' },
  { id: 'u5', name: 'Eva Martinez' },
  { id: 'u6', name: 'Frank Johnson' },
];
