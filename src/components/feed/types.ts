// ──────────────────────────────────────────────────────
//  Feed – Shared TypeScript interfaces and enums
// ──────────────────────────────────────────────────────

export type ReactionType = '👍' | '❤️' | '😂' | '😮' | '😢' | '😡';

export const REACTION_OPTIONS: ReactionType[] = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export interface Author {
  id: string;
  name: string;
  username: string; // e.g. "@jane_doe"
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  content: string;
  createdAt: string; // ISO 8601
  likeCount: number;
  likedByCurrentUser: boolean;
}

export interface ReactionCount {
  type: ReactionType;
  count: number;
}

export interface Post {
  id: string;
  author: Author;
  content: string;
  mediaUrl?: string; // optional image URL
  createdAt: string; // ISO 8601
  likeCount: number;
  likedByCurrentUser: boolean;
  reactionType: ReactionType | null;
  reactionCounts: ReactionCount[];
  commentCount: number;
  shareCount: number;
  comments: Comment[];
  isCommentsOpen: boolean;
}

export interface FeedState {
  posts: Post[];
  page: number;
  hasMore: boolean;
  isLoading: boolean;
}

export interface NewPostDraft {
  content: string;
  mediaPreviewUrl?: string;
}

// ──────────────────────────────────────────────────────
//  Current user (mock)
// ──────────────────────────────────────────────────────
export const CURRENT_USER: Author = {
  id: 'current_user',
  name: 'Alex Rivera',
  username: '@alexrivera',
  avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
};

// ──────────────────────────────────────────────────────
//  Seed data helpers
// ──────────────────────────────────────────────────────
const AUTHORS: Author[] = [
  CURRENT_USER,
  { id: 'u2', name: 'Jordan Lee', username: '@jordanlee', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Jordan' },
  { id: 'u3', name: 'Sam Chen', username: '@samchen_dev', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sam' },
  { id: 'u4', name: 'Taylor Morgan', username: '@tmorgan', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Taylor' },
  { id: 'u5', name: 'Riley Park', username: '@rilepark', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Riley' },
];

function isoAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

function makeComment(id: string, postId: string, authorIdx: number, content: string, minutesAgo: number): Comment {
  return {
    id,
    postId,
    author: AUTHORS[authorIdx],
    content,
    createdAt: isoAgo(minutesAgo),
    likeCount: Math.floor(Math.random() * 8),
    likedByCurrentUser: false,
  };
}

export function generateSeedPosts(): Post[] {
  return [
    {
      id: 'p1',
      author: AUTHORS[1],
      content: 'Just shipped the new design system 🎨 Six months of work finally landing in production. The component library now covers 140+ components with full dark mode support and WCAG AA accessibility out of the box. So proud of the team!',
      mediaUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop',
      createdAt: isoAgo(30),
      likeCount: 47,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '❤️', count: 23 }, { type: '👍', count: 24 }],
      commentCount: 2,
      shareCount: 8,
      isCommentsOpen: false,
      comments: [
        makeComment('c1', 'p1', 2, 'Congrats! The dark mode implementation looks flawless 🔥', 25),
        makeComment('c2', 'p1', 3, 'Shipping something this polished in 6 months is impressive. Open-sourcing it?', 20),
      ],
    },
    {
      id: 'p2',
      author: AUTHORS[2],
      content: 'Hot take: TypeScript strict mode + no-any is not just a preference — it\'s a professional obligation. Found three latent bugs today just by enabling `noUncheckedIndexedAccess`. Type safety pays dividends.',
      createdAt: isoAgo(90),
      likeCount: 112,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '👍', count: 78 }, { type: '😂', count: 34 }],
      commentCount: 4,
      shareCount: 19,
      isCommentsOpen: false,
      comments: [
        makeComment('c3', 'p2', 1, 'Fully agree. Onboarded a new dev last week and strict TS saved us from two subtle async race conditions.', 80),
        makeComment('c4', 'p2', 3, 'What\'s your tsconfig setup? Do you use project references?', 70),
        makeComment('c5', 'p2', 4, '`noUncheckedIndexedAccess` is underrated. More codebases should enable it.', 60),
        makeComment('c6', 'p2', 0, 'Converted our legacy JS codebase last quarter. Painful but 100% worth it.', 50),
      ],
    },
    {
      id: 'p3',
      author: AUTHORS[0],
      content: 'Working from the coast this week 🌊 Sometimes a change of scenery is all you need to break a creative block. Knocked out three feature specs before lunch.',
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop',
      createdAt: isoAgo(200),
      likeCount: 63,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '😮', count: 30 }, { type: '❤️', count: 33 }],
      commentCount: 1,
      shareCount: 5,
      isCommentsOpen: false,
      comments: [
        makeComment('c7', 'p3', 2, 'Which coast? I\'ve been thinking about a remote work trip for ages!', 180),
      ],
    },
    {
      id: 'p4',
      author: AUTHORS[3],
      content: 'We just hit 10k active users on our indie SaaS 🎉 18 months since the first commit. No VC funding, no growth hacks — just relentless focus on the ICP and shipping value every two weeks. If you\'re building something, keep going.',
      createdAt: isoAgo(360),
      likeCount: 204,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '🎉', count: 120 }, { type: '❤️', count: 84 }] as ReactionCount[],
      commentCount: 3,
      shareCount: 42,
      isCommentsOpen: false,
      comments: [
        makeComment('c8', 'p4', 0, 'This is incredibly inspiring. What\'s your stack?', 350),
        makeComment('c9', 'p4', 2, 'What was the biggest inflection point in growth?', 340),
        makeComment('c10', 'p4', 1, 'Real founders share their journey. Thank you for this 🙏', 330),
      ],
    },
    {
      id: 'p5',
      author: AUTHORS[4],
      content: 'Interesting UX experiment: we removed the "Save" button from our settings page and replaced it with auto-save + a subtle status indicator. Support tickets about "lost settings" dropped 73% in 30 days. Small change, big impact.',
      createdAt: isoAgo(720),
      likeCount: 88,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '👍', count: 55 }, { type: '😮', count: 33 }],
      commentCount: 2,
      shareCount: 14,
      isCommentsOpen: false,
      comments: [
        makeComment('c11', 'p5', 3, '73% is wild. What status indicator did you use — toast, inline text, or something else?', 700),
        makeComment('c12', 'p5', 1, 'Google Docs has trained everyone to expect auto-save. Makes total sense.', 680),
      ],
    },
    {
      id: 'p6',
      author: AUTHORS[1],
      content: 'Open sourced our Figma → React token pipeline today. It reads design tokens directly from your Figma Variables, runs them through Style Dictionary, and outputs a type-safe Tailwind config and CSS custom properties file. Zero manual copying. Link in the comments 👇',
      createdAt: isoAgo(1440),
      likeCount: 156,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [{ type: '👍', count: 100 }, { type: '❤️', count: 56 }],
      commentCount: 1,
      shareCount: 31,
      isCommentsOpen: false,
      comments: [
        makeComment('c13', 'p6', 4, 'This is exactly what my team needs. Starring right now ⭐', 1430),
      ],
    },
  ];
}

// ──────────────────────────────────────────────────────
//  More mock posts for infinite scroll
// ──────────────────────────────────────────────────────
const EXTRA_CONTENTS = [
  'Just finished reading "A Philosophy of Software Design" for the second time. The chapter on deep vs shallow modules aged like fine wine. Required reading for any senior engineer.',
  'Reminder that "move fast and break things" was never meant to apply to production user data. Please write tests. Please do code review. Please document your APIs.',
  'Three things that made my team\'s velocity skyrocket: async standups, proper ADRs for all non-trivial decisions, and ruthless scope management. None of them require new tooling.',
  'Accessibility isn\'t a checkbox. It\'s the baseline expectation for every UI we ship. If your app doesn\'t work with a keyboard, a screen reader, or reduced motion settings — it\'s not done.',
  'Spent the morning pairing with a junior dev on debugging a gnarly race condition. Reminded me that explaining your mental model out loud is one of the best ways to find bugs fast.',
  'Six months into our platform migration: 40% reduction in p95 latency, 60% lower infra cost, and the team actually enjoys working on it now. The rewrite was worth it.',
  'Obsessed with the new CSS `has()` selector. The things you can do with `form:has(input:invalid)` without touching JavaScript feel like actual magic.',
  'Hot take: premature optimization is still the root of all evil, but premature abstraction is the silent killer sitting right next to it.',
];

const EXTRA_MEDIA = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  undefined,
  undefined,
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop',
  undefined,
  undefined,
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
  undefined,
];

export function generateMorePosts(page: number): Post[] {
  return Array.from({ length: 4 }, (_, i) => {
    const idx = ((page - 1) * 4 + i) % EXTRA_CONTENTS.length;
    const authorIdx = (page + i) % AUTHORS.length;
    const pid = `p_page${page}_${i}`;
    return {
      id: pid,
      author: AUTHORS[authorIdx],
      content: EXTRA_CONTENTS[idx],
      mediaUrl: EXTRA_MEDIA[idx],
      createdAt: isoAgo((page * 2000) + i * 300),
      likeCount: Math.floor(Math.random() * 80) + 5,
      likedByCurrentUser: false,
      reactionType: null,
      reactionCounts: [
        { type: '👍' as ReactionType, count: Math.floor(Math.random() * 40) + 2 },
        { type: '❤️' as ReactionType, count: Math.floor(Math.random() * 20) + 1 },
      ],
      commentCount: 0,
      shareCount: Math.floor(Math.random() * 15),
      comments: [],
      isCommentsOpen: false,
    };
  });
}
