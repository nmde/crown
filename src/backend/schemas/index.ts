import CreateAccQs from './createAccount/Query.json';
import CreateAccRes from './createAccount/Response.json';
import CreatePostQs from './createPost/Query.json';
import CreatePostRes from './createPost/Response.json';
import GetPostQs from './getPost/Query.json';
import GetPostRes from './getPost/Response.json';
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
  getPost: {
    query: GetPostQs,
    response: GetPostRes,
  },
  signIn: {
    query: SignInQs,
    response: SignInRes,
  },
};
