import moment from 'moment';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import Vue, { VNode } from 'vue';
import PostData from '../../types/PostData';

@Component
export default class Post extends Vue {
  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Post>>;

  @Prop()
  public post!: PostData;

  private get expires() {
    const expires = this.post.expires.valueOf();
    return ((expires - new Date().valueOf()) / (expires - this.post.date.valueOf())) * 100;
  }

  public render(): VNode {
    return (
      <v-card width={500}>
        <v-list-item>
          <v-list-item-avatar></v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{this.post.author}</v-list-item-title>
            <v-list-item-subtitle>{moment(this.post.date).fromNow()}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-img src={this.post.media} height={194} />
        <v-card-text>{this.post.text}</v-card-text>
        <v-card-actions>
          <v-btn icon color="primary">
            <v-icon>favorite</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    );
  }
}
