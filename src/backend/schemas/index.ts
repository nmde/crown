import CreateAccBody from './createAccount/Query.json';
import CreateAccResponse from './createAccount/Response.json';
import GetPostQs from './getPost/Query.json';
import GetPostRes from './getPost/Response.json';

export default {
  createAccount: {
    query: CreateAccBody,
    response: CreateAccResponse,
  },
  getPost: {
    query: GetPostQs,
    response: GetPostRes,
  },
};
