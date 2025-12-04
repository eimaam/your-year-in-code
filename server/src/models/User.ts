import mongoose, { Document, Schema } from 'mongoose';
import { IUser, UserRoleEnum, ThemePreferenceEnum } from '@shared/types';

/**
 * User document interface for MongoDB
 */
export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    githubId: {
      type: String,
      required: true,
      unique: true,
    },
    githubAccessToken: {
      type: String,
      select: false, // Don't include in queries by default
    },
    themePreference: {
      type: String,
      enum: Object.values(ThemePreferenceEnum),
      default: ThemePreferenceEnum.SYSTEM,
    },
    role: {
      type: String,
      enum: Object.values(UserRoleEnum),
      default: UserRoleEnum.USER,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUserDocument>('User', userSchema);
