import Feed from '../src/frontend/classes/Feed';
import MediaRecord from '../src/types/MediaRecord';
import IUser from '../src/types/User';

export const Users: IUser[] = [
  {
    displayName: 'Freddie Benson',
    email: 'me@example.com',
    id: '1',
    lastTokenReset: 0,
    password: '',
    profileBackground: 'background',
    profilePicture: 'avatar',
    username: 'epicgamer123',
  },
  {
    displayName: 'Jane Doe',
    email: 'me2@example.com',
    id: '2',
    lastTokenReset: 0,
    password: '',
    profileBackground: 'background',
    profilePicture: 'avatar',
    username: 'username_1',
  },
];

export const Media: MediaRecord[] = [
  {
    avatar: 'http://via.placeholder.com/100',
    background: 'http://via.placeholder.com/900x400/555555',
    post1: 'http://via.placeholder.com/500',
    post2: 'http://via.placeholder.com/500x350',
    post3: 'http://via.placeholder.com/1000',
    post4: 'http://via.placeholder.com/12x140',
  },
];

export const Feeds: Feed[] = [
  new Feed([
    {
      author: 'epicgamer123',
      created: new Date(2021, 1, 15, 13, 35).toISOString(),
      description: 'Sample Post 1',
      expires: '',
      id: '1',
      media: 'post1',
    },
    {
      author: 'epicgamer123',
      created: new Date(2021, 1, 15, 14, 0).toISOString(),
      description: 'Sample Post 2',
      expires: '',
      id: '2',
      media: 'post2',
    },
    {
      author: 'epicgamer123',
      created: new Date(2021, 2, 1, 2, 11).toISOString(),
      description: 'Sample Post 3',
      expires: '',
      id: '3',
      media: 'post3',
    },
    {
      author: 'epicgamer123',
      created: new Date().toISOString(),
      description: 'Sample Post 4',
      expires: '',
      id: '4',
      media: 'post4',
    },
  ]),
];
