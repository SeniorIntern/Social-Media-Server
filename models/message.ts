import mongoose from 'mongoose';

import {Message} from '../types'

const messageSchema = new mongoose.Schema<Message>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation'
    },
    sender: {
      type: String
    },
    text: {
      type: String
    },
    attachmentUrls: {
      type: [String]
    }
  },
  { timestamps: true }
);

const Message = mongoose.model<Message>('Message', messageSchema);
export default Message;
