import { v2 as cloudinary } from 'cloudinary';
import express from 'express';

import { serverConfig } from '../../config';
import { Conversation, Message } from '../../models';

cloudinary.config(serverConfig.CLOUDINARY_CONFIG);

const router = express.Router();

// new message
router.post('/', async (req, res) => {
  const attachmentUrls: String[] = [];

  if (req.files) {
    let file = req.files.attachmentUrls;

    if (Array.isArray(file)) {
      for (let f = 0; f < file.length; f++) {
        // tempFilePath - A path to the temporary file when useTempFiles(express-fileupload) option is set to true.
        //@ts-ignore
        const result = await cloudinary.uploader.upload(file[f].tempFilePath, {
          folder: 'users'
        });
        attachmentUrls.push(result.url);
        console.log('new list======', attachmentUrls);
      }
    } else {
      //@ts-ignore
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'users'
      });
      attachmentUrls.push(result.url);
      console.log('new list======', attachmentUrls);
    }
  }

  console.log('attachmentUrls =', attachmentUrls);

  // conversationId sender text
  const { conversationId, sender, text } = req.body;

  const newMessage = new Message({
    conversationId,
    sender,
    text,
    attachmentUrls: attachmentUrls
  });

  await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: text,
      lastSender: sender
    },
    { timestamps: true }
  );

  const savedMessage = await newMessage.save();
  res.status(200).json(savedMessage);
});

// all messages in a conversation
router.get('/:conversationId', async (req, res) => {
  // @ts-ignore
  const limit = parseInt(req.query.limit) || 10;

  const messages = await Message.find({
    conversationId: req.params.conversationId
  })
    .sort({ createdAt: -1 })
    .limit(limit);

  // Count the total number of documents for the given conversationId
  const totalDocuments = await Message.countDocuments({
    conversationId: req.params.conversationId
  });

  res.json({
    messages,
    totalPages: Math.ceil(totalDocuments / messages.length),
    totalDocuments
  });
});

/*
router.get('/:conversationId', async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});
*/

export default router;
