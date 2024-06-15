import mongoose from 'mongoose';

import { Tweet } from '../types';

const tweetSchema = new mongoose.Schema<Tweet>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    userProfileImage: {
      type: String
    },
    username: {
      type: String
    },
    userEmail: {
      type: String
    },
    tweetContent: {
      type: String
    },
    attachmentUrls: {
      type: [String]
    },
    comments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Comment'
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User'
    }
  },
  { timestamps: true }
);

const Tweet = mongoose.model<Tweet>('Tweet', tweetSchema);
export default Tweet;
