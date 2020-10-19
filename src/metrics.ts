/*  User
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
  uuid: any; // change any to uuid type
  profilePic: string;
  bio: string;
  posts: any[]; // change any to Post type
  followers: User[];
  following: User[];
  likedHashtags: string[];
  dailyTimeSpent: {day: string, timeSpent: number}[];
  postsViewed: number;

  constructor(setUsername: string, setProfilePic: string, setBio: string) {
    this.username = setUsername;
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
  makePost(newPost: any) {
    this.posts.push(newPost);
  }

  // removes post from posts
  deletePost(removePost: any) {
    this.posts.filter((post: any) =>{
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
    this.followers.forEach((user: User) => {
      user.unfollow(this);
    });

    this.following.forEach((user: User) => {
      this.unfollow(user);
    });
  }
}