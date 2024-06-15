import mongoose from 'mongoose';

import { Bookmark } from '../types';

const bookmarkSchema = new mongoose.Schema<Bookmark>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    tweetIds: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Tweet'
    }
  },
  { timestamps: true }
);

const Bookmark = mongoose.model<Bookmark>('Bookmark', bookmarkSchema);
export default Bookmark;
