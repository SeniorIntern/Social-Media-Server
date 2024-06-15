import { v2 as cloudinary } from 'cloudinary';
import express from 'express';

import { serverConfig } from '../../config';
import { checkObjId } from '../../middlewares';
import { Bookmark } from '../../models';

cloudinary.config(serverConfig.CLOUDINARY_CONFIG);

const router = express.Router();

router.get('/', async (req, res) => {
  const bookmarks = await Bookmark.find();
  res.status(200).send(bookmarks);
});

// bookmarks by user _id
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  const bookmarks = await Bookmark.findOne({ userId }).populate('tweetIds');
  res.status(200).send(bookmarks);
});

router.patch('/:id', checkObjId, async (req, res) => {
  // @ts-ignore
  const decoded = req.user;
  const userId = decoded._id;

  const tweetId = req.params.id;

  // query first approach
  const bookmark = await Bookmark.findOne({ userId });
  if (!bookmark) {
    const newBookmark = new Bookmark({
      userId,
      tweetIds: [tweetId]
    });
    newBookmark.save();
    return res.status(200).send(newBookmark);
  }

  bookmark.set({
    tweetIds: [...bookmark.tweetIds, tweetId]
  });
  await bookmark.save();

  res.status(200).send(bookmark);
});

// delete by bookmark _id
router.delete('/:id', checkObjId, async (req, res) => {
  const bookmarkId = req.params.id;
  const bookmark = await Bookmark.findByIdAndDelete(bookmarkId);
  res.status(200).send(bookmark);
});

export default router;
