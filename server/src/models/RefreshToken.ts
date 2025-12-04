import mongoose, { Document, Schema } from 'mongoose';

/**
 * Refresh token document interface for MongoDB
 */
export interface IRefreshTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdByIp?: string;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
}

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdByIp: {
      type: String,
    },
    revokedAt: {
      type: Date,
    },
    revokedByIp: {
      type: String,
    },
    replacedByToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient token lookups
refreshTokenSchema.index({ token: 1 });
// Index for finding user's tokens
refreshTokenSchema.index({ userId: 1, revokedAt: 1 });
// Index for cleanup of expired tokens
refreshTokenSchema.index({ expiresAt: 1 });

export const RefreshTokenModel = mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);
