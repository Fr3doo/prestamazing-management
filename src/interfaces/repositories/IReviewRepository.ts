
export interface Review {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface CreateReviewData {
  user_name: string;
  comment: string;
  rating: number;
}

export interface UpdateReviewData {
  user_name?: string;
  comment?: string;
  rating?: number;
  updated_at: string;
}

export interface IReviewRepository {
  getAllReviews(): Promise<Review[]>;
  getReviewById(id: string): Promise<Review | null>;
  createReview(data: CreateReviewData): Promise<Review>;
  updateReview(id: string, data: UpdateReviewData): Promise<Review>;
  deleteReview(id: string): Promise<void>;
}
