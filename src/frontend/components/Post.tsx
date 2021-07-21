/* eslint-disable class-methods-use-this */
import path from 'path-browserify';
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import IPost from '../../types/Post';
import IUser from '../../types/User';
import apiPath from '../../util/apiPath';
import formatDate from '../../util/formatDate';
import Styled from '../classes/Styled';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({
  card: {
    padding: '10px',
  },
  description: {
    textAlign: 'right',
  },
});

@Component
/**
 * Displays a post
 */
export default class Post extends Styled<typeof styles> {
  /**
   * The post author
   */
  private data: {
    author?: IUser;
  } = {};

  /**
   * The post data
   */
  @Prop()
  public post!: IPost;

  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Post>> &
  tsx.DeclareOnEvents<{
    onDelete: void;
  }>;

  /**
   * Defines custom styles for the component
   *
   * @constructs
   */
  public constructor() {
    super(styles);
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
          await store.getUserById({
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
   *
   * @returns {VNode} the post
   */
  public render(): VNode {
    // TODO workaround
    if (this.data.author !== undefined) {
      return (
        <v-card class={this.className('card')}>
          <v-toolbar flat>
            <v-toolbar-title>
              <router-link to={`/@${this.data.author.username}`}>
                {this.data.author.username}
              </router-link>
            </v-toolbar-title>
            <v-spacer />
            <v-menu
              scopedSlots={{
                /**
                 * The menu activator
                 *
                 * @param {any} on Vue event bindings
                 * @returns {VNode} the activator button
                 */
                activator({ on: { click } }: Record<string, Record<string, () => void>>) {
                  return (
                    <v-btn icon onClick={click}>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  );
                },
              }}
            >
              <v-list>
                <v-list-item
                  onClick={() => {
                    this.$bus.emit('deletePost', this.post.id);
                  }}
                >
                  <v-list-item-title>Delete post</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-img src={`${path.join(apiPath('media'), this.post.media as string)}`} />
          <v-card-actions>
            <v-btn color="primary" plain block>
              <v-icon>favorite</v-icon>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <div class="text-body-2">{this.post.description}</div>
            <div class={this.className('description')}>{formatDate(this.post.created || '')}</div>
          </v-card-text>
        </v-card>
      );
    }
    return <div></div>;
  }
}
