import AuthenticateQs from './authenticate/Query.json';
import BoostQs from './boost/Query.json';
import CreateAccQs from './createAccount/Query.json';
import CreateAccRes from './createAccount/Response.json';
import CreateCommentQs from './createComment/Query.json';
import CreateCommentRes from './createComment/Response.json';
import CreateEdgeQs from './createEdge/Query.json';
import CreateEdgeRes from './createEdge/Response.json';
import CreatePostQs from './createPost/Query.json';
import CreatePostRes from './createPost/Response.json';
import DeleteEdgeQs from './deleteEdge/Query.json';
import DeleteEdgeRes from './deleteEdge/Response.json';
import DeletePostQs from './deletePost/Query.json';
import DeletePostRes from './deletePost/Response.json';
import GetCommentsQs from './getComments/Query.json';
import GetCommentsRes from './getComments/Response.json';
import GetEdgesQs from './getEdges/Query.json';
import GetFeedQs from './getFeed/Query.json';
import GetMediaQs from './getMedia/Query.json';
import GetPostQs from './getPost/Query.json';
import GetPostRes from './getPost/Response.json';
import GetUserQs from './getUser/Query.json';
import GetUserRes from './getUser/Response.json';
import GetUserByIdQs from './getUserById/Query.json';
import MessagesQs from './messages/Query.json';
import MessagesRes from './messages/Response.json'
;import SignInQs from './signIn/Query.json';
import SignInRes from './signIn/Response.json';
import UpdateUserQs from './updateUser/Query.json';

export default {
  authenticate: {
    query: AuthenticateQs,
    response: GetUserRes,
  },
  boost: {
    query: BoostQs,
    response: CreateEdgeRes,
  },
  createAccount: {
    query: CreateAccQs,
    response: CreateAccRes,
  },
  createComment: {
    query: CreateCommentQs,
    response: CreateCommentRes,
  },
  createEdge: {
    query: CreateEdgeQs,
    response: CreateEdgeRes,
  },
  createPost: {
    query: CreatePostQs,
    response: CreatePostRes,
  },
  deleteEdge: {
    query: DeleteEdgeQs,
    response: DeleteEdgeRes,
  },
  deletePost: {
    query: DeletePostQs,
    response: DeletePostRes,
  },
  getComments: {
    query: GetCommentsQs,
    response: GetCommentsRes,
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
  getMedia: {
    query: GetMediaQs,
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
  messages: {
    query: MessagesQs,
    response: MessagesRes,
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
