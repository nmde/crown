import {v4 as uuid} from 'uuid';
/*  
User
Properties:
- username (mutable)
- uuid (unique user id, immutable)
- profilePic (path to img file)
- bio (mutable)
- posts: [Post, ...] (list of this user's posts)
- followers: [User, ...] (list of users following this user)
- following: [User, ...] (list of users this user is following)
- likedHashtags: ['#sports', ...] (list of hashtags linked to posts this user 
    has liked)
- dailyTimeSpent: [{date: '10/24/2020', timeSpent: 3.5}] (list of days and the 
    time spent, in hours, by this user on the app on each of those days)
- postsViewed (total number of posts viewed by this user)

Methods:
- makePost(post): creates a new post and appends it to posts
- deletePost(post): removes post from posts
- follow(user): appends user to following and appends self to user.followers
- unfollow(unfollowingUser): removes unfollowingUser from following and reomves self from unfollowingUser's followers
- editUsername(newUsername): changes username to newUsername
- editProfilePic(newProfilePic): changes profilePic to newProfilePic
- editBio(newBio): changes bio to newBio
- likeHashtag(hashTag): appends hashtag to likedHashtags
- dislikeHashtag(hashtag): removes hashtag from likedHashtags
- incrementPostsViewed: postsViewed gets incremented by 1
- deleteUser: unfollows all users in following and has all users in followers unfollow self
*/

class User {
  username: string;
  id: string;
  profilePic: string;
  bio: string;
  posts: Post[];
  followers: User[];
  following: User[];
  likedHashtags: string[];
  dailyTimeSpent: {day: string, timeSpent: number}[];
  postsViewed: number;

  constructor(setUsername: string, setProfilePic: string, setBio: string) {
    this.username = setUsername;
    this.id = uuid();
    this.profilePic = setProfilePic;
    this.bio = setBio;
    this.posts = [];
    this.followers = [];
    this.following = [];
    this.likedHashtags = [];
    this.dailyTimeSpent = [];
    this.postsViewed = 0;
  }
  // creates a new post and appends it to posts
  makePost(newPost: Post) {
    this.posts.push(newPost);
  }

  // removes post from posts
  deletePost(removePost: Post) {
    this.posts.filter((post: Post) =>{
      return post != removePost;
    });
  }

  // appends followingUser to following and appends self to user.followers
  follow(followingUser: User) {
    this.following.push(followingUser);
    followingUser.followers.push(this);
  }

  // removes unfollowingUser from following and reomves self from unfollowingUser's followers
  unfollow(unfollowingUser: User) {
    this.following.filter((user: User) => {
      return user != unfollowingUser;
    });

    unfollowingUser.followers.filter((user: User) => {
      return user != this;
    });
  }

  // changes username to newUsername
  editUsername(newUsername: string) {
    // if newUsername is already taken:
        // notify user newUsername is already taken
    // else: 
    this.username = newUsername;
  }

  // changes profilePic to newProfilePic
  editProfilePic(newProfilePic: string) {
    this.profilePic = newProfilePic;
  }

  // changes bio to newBio
  editBio(newBio: string) {
    this.bio = newBio;
  }

  // adds newHashtag to likedHashtags
  likeHashtag(newHashtag: string) {
    this.likedHashtags.push(newHashtag);
  }

  // removes delHashtag from likedHashtags
  dislikeHashtag(delHashtag: string) {
    this.likedHashtags.filter((hashtag: string) => {
      return hashtag != delHashtag;
    });
  }

  // increments postsViewed by 1
  incrementPostsViewed() {
    this.postsViewed++;
  }

  // unfollows all users in following and has all users in followers unfollow self
  deleteUser() {
    this.followers.forEach((user: User) => 
      user.unfollow(this));

    this.following.forEach((user: User) => 
      this.unfollow(user));
  }
}

/* 
Post
Properties:
- owner: User who created the post (immutable)
- content: holds video or image src for the post {src, type}
- caption: (mutable)
- comments: array of this post's comments
- likes
- views
- shares
- hashtags: array of hashtags associated with the post

Methods:
- editCaption: allows owner to edit the post's caption
- evaluateHashtags: search through caption for hashtags and append them to hashtags
- incrementLikes: called when somebody likes this post
- decrementLikes: called when someone unlikes this post
- incrementViews: called when someone views this post
- share: shares this post to instagram, twitter, sms, facebook messenger, whatsapp,
         and snapchat
- addComment: adds new comment to this post's comments array
*/

class Post {
  owner: User;
  content: {src: string, type: string}
  caption: string;
  hashtags: string[];
  comments: Comment[];
  likes: number;
  views: number;
  shares: number;

  constructor(setOwner: User, setContent: {src: string, type: string}, setCaption: string) {
    this.owner = setOwner;
    this.content = setContent;
    this.caption = '';
    this.editCaption(setCaption);
    this.hashtags = [];
    this.evaluateHashtags(setCaption);
    this.comments = [];
    this.likes = 0;
    this.views = 0;
    this.shares = 0;

  }

  // allows user to edit this post's caption
  editCaption(newCaption: string) {
    this.caption = newCaption;
  }

  // determines which words are hashtags in caption and appends them to hashtags
  evaluateHashtags(caption: string) {
    let captionArray: string[] = caption.split(' ');

    captionArray.forEach((word) => {
      if (word.startsWith('#')) {
        this.hashtags.push(word);
      }
    });
  }

  // increments likes by 1
  incrementLikes(likingUser: User) {
    this.likes++;

    this.hashtags.forEach((hashtag) =>
      likingUser.likeHashtag(hashtag));
  }

  // decrements likes by 1
  decrementLikes(dislikingUser: User) {
    this.hashtags.forEach((hashtag) =>
      dislikingUser.dislikeHashtag(hashtag));
  }

  // increments views by 1
  incrementViews() {
    this.views++;
  }

  // allows user to share this post
  // TODO: implement this method
  share() {
    // share to instagram
    // share to twitter
    // share to sms
    // share to facebook messenger
    // share to whatsapp
    // share to snapchat
  }

  // allows user to add a comment to this post
  addComment(newComment: Comment) {
    this.comments.push(newComment);
  }
}

/* 
Comment
Properties:
- owner: user who posted this comment
- message: content of the comment
- likes
- replies: array of replies to this comment

Methods:
- incrementLikes: increments likes by 1
- addReply: appends new Comment to replies
*/
class Comment {
  owner: string;
  message: string;
  likes: number;
  replies: Comment[];
  
  constructor(setOwner: string, setMessage: string) {
    this.owner = setOwner;
    this.message = setMessage;
    this.likes = 0;
    this.replies = []
  }

  // increment likes by 1
  incrementLikes() {
    this.likes++;
  }

  // add new reply to replies
  addReply(newReply: Comment) {
    this.replies.push(newReply);
  }
}