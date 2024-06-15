import express from 'express';

import { Conversation } from '../../models';
import { Conversation as TConversation } from '../../types';

const router = express.Router();

// get conv[] of a user
router.get('/:userId', async (req, res) => {
  const conversation = await Conversation.find({
    members: { $in: [req.params.userId] }
  }).populate('members');
  res.status(200).json(conversation);
});

// other members in a conversation
router.get('/members/:id', async (req, res) => {
  // @ts-ignore
  const decoded = req.user;
  const userId = decoded._id;

  const { id: conversationId } = req.params;
  const conversation =
    await Conversation.findById(conversationId).populate('members');

  const members = conversation?.members;

  const otherMembers = members?.filter(
    // @ts-ignore
    (member) => member._id.toString() != userId
  );

  res.status(200).send(otherMembers);
});

// new conversation with a user
router.post('/', async (req, res) => {
  const { members, isGroup } = req.body as TConversation;

  // isGroup is either true(if exists in req.body) or undefined
  if (isGroup) {
    const {
      groupInfo: { groupName, groupAdmin }
    } = req.body;

    const conversation = new Conversation<TConversation>({
      members,
      isGroup,
      groupInfo: {
        groupName,
        groupAdmin,
        groupImage: 'https://picsum.photos/id/40/4106/2806'
      }
    });
    const conv = await conversation.save();
    res.status(200).json(conv);
  } else {
    const conversation = new Conversation({
      members
    });
    const conv = await conversation.save();
    res.status(200).json(conv);
  }
});

// get conversation between users. includes two userId
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  const conversation = await Conversation.findOne({
    members: { $all: [req.params.firstUserId, req.params.secondUserId] }
  });
  if (!conversation) {
    return res.status(400).send('No conversation found!');
  }
  res.status(200).json(conversation);
});

export default router;
