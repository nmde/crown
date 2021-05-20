type IEdge = {
  source: string;
  target: string;
  type: 'follow' | 'like';
  id?: string;
};

export default IEdge;
