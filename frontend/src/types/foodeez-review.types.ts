export interface CreateFoodeezReviewData {
  REVIEWER_NAME?: string;
  REVIEWER_EMAIL?: string;
  AVATAR?: string;
  RATING: number;
  REVIEW: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
}

export interface UpdateFoodeezReviewData {
  REVIEWER_NAME?: string;
  REVIEWER_EMAIL?: string;
  AVATAR?: string;
  RATING?: number;
  REVIEW?: string;
  PIC_1?: string;
  PIC_2?: string;
  PIC_3?: string;
  APPROVED?: number;
}

export interface ReviewFormData {
  rating: number;
  review: string;
  images: File[];
}