import express from 'express';

import auth from './auth';
import bookmarks from './bookmark';
import conversations from './conversations';
import messages from './messages';
import tweets from './tweet';
import users from './users';

const router = express.Router();

router.use('/users', users);
router.use('/auth', auth);
router.use('/messages', messages);
router.use('/conversations', conversations);
router.use('/tweets', tweets);
router.use('/bookmarks', bookmarks);

export default router;
