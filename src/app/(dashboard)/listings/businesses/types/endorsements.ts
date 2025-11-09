// src/types/endorsements.ts

import {
  ENDORSEMENT_CATEGORIES,
  RELATIONSHIP_TYPES,
} from "@/lib/data/reviewData";

export interface BusinessEndorsementData {
  totalEndorsements: number;
  totalRecommendations: number;
  totalViews: number;
  hasUserEndorsed: boolean;
  hasUserRecommended: boolean;
  categoryEndorsements: CategoryEndorsementData[];
  recommendations: RecommendationData[];
  relationshipBreakdown: Record<string, number>;
}

export interface CategoryEndorsementData {
  category: string;
  count: number;
  hasUserEndorsed: boolean;
}

export interface RecommendationData {
  id: string;
  recommenderName: string;
  relationshipType: string;
  tags: string[];
  createdAt: string;
}

export interface CreateRecommendationRequest {
  relationshipType: string;
  tags: string[];
}

// Constants

// Derived types from constants
export type EndorsementCategory = (typeof ENDORSEMENT_CATEGORIES)[number];
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

// Helper type guard functions
export function isValidEndorsementCategory(
  value: string
): value is EndorsementCategory {
  return ENDORSEMENT_CATEGORIES.includes(value as EndorsementCategory);
}

export function isValidRelationshipType(
  value: string
): value is RelationshipType {
  return RELATIONSHIP_TYPES.includes(value as RelationshipType);
}
