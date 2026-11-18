export interface SoundComment {
  id?: string;
  author: string;
  avatarHero: string;
  text: string;
  createdAt: number;
  likes: number;
  dislikes: number;
}

export interface AudioRecommendation {
  id?: string;
  phrase: string;
  clipUrl?: string;
  timestampHint?: string;
  author: string;
  createdAt: number;
  votes: number;
  status: 'pending' | 'approved' | 'added';
}
