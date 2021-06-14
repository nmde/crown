import CreateAccQs from './createAccount/Query.json';
import CreateAccRes from './createAccount/Response.json';
import CreateEdgeQs from './createEdge/Query.json';
import CreateEdgeRes from './createEdge/Response.json';
import CreatePostQs from './createPost/Query.json';
import CreatePostRes from './createPost/Response.json';
import GetEdgesQs from './getEdges/Query.json';
import GetFeedQs from './getFeed/Query.json';
import GetPostQs from './getPost/Query.json';
import GetPostRes from './getPost/Response.json';
import GetUserQs from './getUser/Query.json';
import GetUserRes from './getUser/Response.json';
import GetUserByIdQs from './getUserById/Query.json';
import SignInQs from './signIn/Query.json';
import SignInRes from './signIn/Response.json';
import UpdateUserQs from './updateUser/Query.json';

export default {
  createAccount: {
    query: CreateAccQs,
    response: CreateAccRes,
  },
  createEdge: {
    query: CreateEdgeQs,
    response: CreateEdgeRes,
  },
  createPost: {
    query: CreatePostQs,
    response: CreatePostRes,
  },
  getEdges: {
    query: GetEdgesQs,
    response: {
      properties: {
        posts: {
          items: CreateEdgeRes,
          type: 'array',
        },
      },
      type: 'object',
    },
  },
  getFeed: {
    query: GetFeedQs,
    response: {
      properties: {
        posts: {
          items: GetPostRes,
          type: 'array',
        },
      },
      type: 'object',
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
  getUserById: {
    query: GetUserByIdQs,
    response: GetUserRes,
  },
  signIn: {
    query: SignInQs,
    response: SignInRes,
  },
  updateUser: {
    query: UpdateUserQs,
    response: GetUserRes,
  },
};
