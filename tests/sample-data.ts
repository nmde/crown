import Feed from '../src/frontend/classes/Feed';
import MediaRecord from '../src/types/MediaRecord';
import IUser from '../src/types/User';

export const Users: IUser[] = [
  {
    id: '1',
    displayName: 'Freddie Benson',
    email: 'me@example.com',
    username: 'epicgamer123',
    profileBackground: 'background',
    profilePicture: 'avatar',
  },
];

export const Media: MediaRecord[] = [
  {
    background: 'http://via.placeholder.com/900x400/555555',
    avatar: 'http://via.placeholder.com/100',
    post1: 'http://via.placeholder.com/500',
    post2: 'http://via.placeholder.com/500x350',
    post3: 'http://via.placeholder.com/1000',
    post4: 'http://via.placeholder.com/12x140',
  },
];

export const Feeds: Feed[] = [
  new Feed([
    {
      id: '1',
      media: 'post1',
      author: '1',
      created: new Date(2021, 1, 15, 13, 35).toISOString(),
      expires: '',
      description: 'Sample Post 1',
    },
    {
      id: '2',
      media: 'post2',
      author: '1',
      created: new Date(2021, 1, 15, 14, 0).toISOString(),
      expires: '',
      description: 'Sample Post 2',
    },
    {
      id: '3',
      media: 'post3',
      author: '1',
      created: new Date(2021, 2, 1, 2, 11).toISOString(),
      expires: '',
      description: 'Sample Post 3',
    },
    {
      id: '4',
      media: 'post4',
      author: '1',
      created: new Date().toISOString(),
      expires: '',
      description: 'Sample Post 4',
    },
  ]),
];
