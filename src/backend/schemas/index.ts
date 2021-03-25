import CreateAccQs from './createAccount/Query.json';
import CreateAccRes from './createAccount/Response.json';
import CreatePostQs from './createPost/Query.json';
import CreatePostRes from './createPost/Response.json';
import GetFeedQs from './getFeed/Query.json';
import GetPostQs from './getPost/Query.json';
import GetPostRes from './getPost/Response.json';
import GetUserQs from './getUser/Query.json';
import GetUserRes from './getUser/Response.json';
import SignInQs from './signIn/Query.json';
import SignInRes from './signIn/Response.json';

export default {
  createAccount: {
    query: CreateAccQs,
    response: CreateAccRes,
  },
  createPost: {
    query: CreatePostQs,
    response: CreatePostRes,
  },
  getFeed: {
    query: GetFeedQs,
    response: {
      properties: {
        type: "array",
        items: GetPostRes.properties,
      },
    },
  },
  getPost: {
    query: GetPostQs,
    response: GetPostRes,
  },
  getUser: {
    query: GetUserQs,
    response: GetUserRes,
  },
  signIn: {
    query: SignInQs,
    response: SignInRes,
  },
};
