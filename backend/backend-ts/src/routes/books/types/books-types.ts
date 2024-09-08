import { IBooks } from "../models/Books";

export interface Books {
    media_urls: String[],
    title: String,
    description: String,
    author_id: String,
    time: String,
    number_likes: Number,
    number_com: Number
}

export interface IRecommendations {
    likedRecommendation: IBooks | null;
    dislikedRecommendation: IBooks | null;
}

export interface IRecommendationResult {
    current: IBooks | null;
    like: IBooks | null;
    dislike: IBooks | null;
    error?: string;
}

export interface FromJson{
    title: string;
    author: string;
    description: string;
    media_urls: string;
}

export interface SearchOptions {
    title?: string;
    author?: string;
    is_from_library?: boolean;
}

export interface PaginationOptions {
    page: number;
    limit: number;
}

export interface PaginatedResult {
    results: IBooks[];
    total: number;
    page: number;
    totalPages: number;
}