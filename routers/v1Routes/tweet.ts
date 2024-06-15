import { v2 as cloudinary } from 'cloudinary';
import express from 'express';

import { serverConfig } from '../../config';
import { checkObjId } from '../../middlewares';
import { Comment, Tweet, User } from '../../models';

cloudinary.config(serverConfig.CLOUDINARY_CONFIG);

const router = express.Router();

router.get('/', async (req, res) => {
  // @ts-ignore
  const limit = parseInt(req.query.limit) || 10;

  const tweets = await Tweet.find().sort({ createdAt: -1 }).limit(limit);

  // Count the total number of documents for the given conversationId
  const totalDocuments = await Tweet.countDocuments();

  res.json({
    tweets,
    totalPages: Math.ceil(totalDocuments / tweets.length),
    totalDocuments
  });
});

router.get('/user/:id', checkObjId, async (req, res) => {
  const userId = req.params.id;
  const userTweets = await Tweet.find({ userId }).populate('userId');
  res.status(200).send(userTweets);
});

router.get('/:id', checkObjId, async (req, res) => {
  const tweetId = req.params.id;
  const tweets = await Tweet.findById(tweetId);
  res.status(200).send(tweets);
});

// likes of a tweet by tweet's _id
router.get('/like/:id', checkObjId, async (req, res) => {
  const tweetId = req.params.id;

  const tweets = await Tweet.findById(tweetId).populate('likes');

  res.status(200).send(tweets);
});

// comments of a tweet by tweet's _id
router.get('/comment/:id', checkObjId, async (req, res) => {
  const tweetId = req.params.id;
  const tweets = await Tweet.findById(tweetId).populate('comments');
  res.status(200).send(tweets);
});

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

  // @ts-ignore
  const decoded = req.user;
  const userId = decoded._id;

  const user = await User.findById(userId);
  if (!user) return res.status(400).send('User not found');

  const tweetContent = req.body.tweetContent;

  const tweets = new Tweet({
    userId,
    userProfileImage: user.profileImage,
    username: user.username,
    userEmail: user.email,
    tweetContent,
    attachmentUrls
  });
  await tweets.save();
  res.status(200).send(tweets);
});

// add comment to a tweet
router.patch('/comment/:id', checkObjId, async (req, res) => {
  // @ts-ignore
  const decoded = req.user;
  const userId = decoded._id;

  const tweetId = req.params.id;

  const { commentContent } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(200).send("User with this id doesn't exist");

  const { profileImage, username } = user;

  const comment = new Comment({
    commentContent,
    userId,
    profileImage,
    username
  });
  await comment.save();

  const staleTweet = await Tweet.findById(tweetId);

  const newTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      comments:
        staleTweet?.comments && staleTweet.comments.length > 0
          ? [...staleTweet.comments, comment._id]
          : [comment._id]
    },
    { new: true }
  );
  res.status(200).send(newTweet);
});

// add like to a tweet
router.patch('/like/:id', checkObjId, async (req, res) => {
  // @ts-ignore
  const decoded = req.user;
  const userId = decoded._id;

  const tweetId = req.params.id;

  const staleTweet = await Tweet.findById(tweetId);
  if (!staleTweet) return res.status(400).send('No tweet found');

  const newTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      likes: [...staleTweet?.likes, userId]
    },
    { new: true }
  );

  res.status(200).send(newTweet);
});

router.delete('/:id', checkObjId, async (req, res) => {
  const tweetId = req.params.id;
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  res.status(200).send(tweet);
});

export default router;
