import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { VNode } from 'vue';
import PostData from '../../types/PostData';
import TSXProps from '../../types/TSXProps';

type PostProps = {
  post: PostData;
};

@Component
export default class Post extends tsx.Component<PostProps> {
  _tsx!: TSXProps<Post>;

  @Prop()
  post!: PostData;

  render(): VNode {
    return <h1>{this.post}</h1>;
  }
}
