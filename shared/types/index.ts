/**
 * Shared types used across client and server
 * Types for Your Year in Code - GitHub Wrapped
 */

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum ThemePreferenceEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

export interface IUser {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  githubId: string;
  githubAccessToken?: string;
  themePreference?: ThemePreferenceEnum;
  role: UserRoleEnum;
  createdAt: Date;
  updatedAt: Date;
}

// GitHub Stats Types for Year in Code
export interface IGitHubYearStats {
  _id: string;
  userId: string;
  year: number;
  totalCommits: number;
  totalPullRequests: number;
  totalIssues: number;
  totalReviews: number;
  totalRepositories: number;
  totalStars: number;
  contributionStreak: number;
  longestStreak: number;
  mostActiveDay: string;
  mostActiveMonth: string;
  topLanguages: ILanguageStat[];
  topRepositories: IRepoStat[];
  contributionsByMonth: IMonthlyContribution[];
  contributionsByDayOfWeek: IDayOfWeekContribution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILanguageStat {
  name: string;
  percentage: number;
  color: string;
  bytes: number;
}

export interface IRepoStat {
  name: string;
  owner: string;
  commits: number;
  stars: number;
  url: string;
}

export interface IMonthlyContribution {
  month: string;
  commits: number;
  pullRequests: number;
  issues: number;
}

export interface IDayOfWeekContribution {
  day: string;
  count: number;
}

export { NodeEnv } from './environment.types';