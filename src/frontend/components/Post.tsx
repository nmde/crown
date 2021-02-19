/* eslint-disable class-methods-use-this */
import path from 'path-browserify';
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import store from '../store';
import Styled from '../Styled';
import IPost from '../../types/Post';
import IUser from '../../types/User';
import apiPath from '../../util/apiPath';
import formatDate from '../../util/formatDate';

type Classes = 'description';

/**
 * Displays a post
 */
@Component
export default class Post extends Styled<Classes> {
  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Post>>;

  /**
   * The post author
   */
  private data: {
    author: IUser;
  } = {
    author: {},
  };

  /**
   * The post data
   */
  @Prop()
  public post!: IPost;

  /**
   * Defines custom styles for the component
   * @constructs
   */
  public constructor() {
    super({
      description: {
        textAlign: 'right',
      },
    });
  }

  /**
   * Retrieves information about the post author
   */
  @Watch('post', {
    deep: true,
    immediate: true,
  })
  private async getAuthor() {
    if (this.post.author !== undefined) {
      try {
        this.$set(
          this.data,
          'author',
          await store.getUser({
            id: this.post.author,
          }),
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
   * Vue lifecycle hook
   * Keeps the author in sync
   */
  public created(): void {
    this.getAuthor();
  }

  /**
   * Renders the component
   * @returns the post
   */
  public render(): VNode {
    return (
      <v-card>
        <v-toolbar>
          <v-toolbar-title>
            <router-link to={`/@${this.data.author.username}`}>
              {this.data.author.username}
            </router-link>
          </v-toolbar-title>
        </v-toolbar>
        <v-img src={`${path.join(apiPath('media'), this.post.media as string)}`} />
        <v-card-actions>
          <v-btn color="primary" plain block>
            <v-icon>favorite</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <div class="text-body-2">{this.post.description}</div>
          <div class={this.c('description')}>{formatDate(this.post.created || '')}</div>
        </v-card-text>
      </v-card>
    );
  }
}
