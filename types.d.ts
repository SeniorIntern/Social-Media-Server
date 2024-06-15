type Bookmark = {
  userId: mongoose.Schema.Types.ObjectId;
  tweetIds: mongoose.Schema.Types.ObjectId[];
};

type Conversation = {
  members: [mongoose.Schema.Types.ObjectId];
  lastMessage?: string;
  lastSender?: mongoose.Schema.Types.ObjectId;
  isGroup: boolean;
  groupInfo: {
    groupName: string;
    groupAdmin: string;
    groupImage: string;
  };
};

type Comment = {
  commentContent: string;
  userId: mongoose.Schema.Types.ObjectId;
  profileImage: string;
  username: string;
};

type Message = {
  conversationId: mongoose.Schema.Types.ObjectId;
  sender: string;
  text: string;
  attachmentUrls: string[];
};

type Tweet = {
  userId: mongoose.Schema.Types.ObjectId;
  userProfileImage: string;
  username: string;
  userEmail: string;
  tweetContent: string;
  attachmentUrls: string[];
  comments: mongoose.Schema.Types.ObjectId[];
  likes: mongoose.Schema.Types.ObjectId[];
};

type Intro = {
  shortIntro: string;
  study: string;
  location: string;
  job: string;
};

type User = {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  coverImage: string;
  friends: [mongoose.Schema.Types.ObjectId];
  isAdmin?: boolean;
  intro: mongoose.Schema<Intro>;
  about: string;
};

export { Bookmark, Comment, Conversation, Intro, Message, Tweet, User };
