/* eslint-disable class-methods-use-this */
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import IPost from '../../types/Post';
import IUser from '../../types/User';
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

export type Props = {
  post: IPost;
};

@Component
/**
 * Displays a post
 */
export default class Post extends Styled<typeof styles> implements Props {
  /**
   * The post author
   */
  private data: {
    author?: IUser;
    media?: string;
  } = {};

  /**
   * The post data
   */
  @Prop()
  public post!: IPost;

  public _tsx!: tsx.DeclareProps<Props> & tsx.DeclareOnEvents<{
    onDelete: string;
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
  private async setup() {
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

    if (this.post.media !== undefined) {
      this.$set(
        this.data,
        'media',
        await store.getMedia({
          id: this.post.media,
        }),
      );
    }
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
                {(() => {
                  if (this.post.author === store.currentUser?.id) {
                    return (
                      <v-list-item
                        onClick={async () => {
                          try {
                            await store.deletePost({
                              id: this.post.id as string,
                            });
                            this.$emit('delete', this.post.id);
                          } catch (err) {
                            this.$bus.emit('error', err);
                          }
                        }}
                      >
                        <v-icon>delete</v-icon>
                      </v-list-item>
                    );
                  }
                  return <div />;
                })()}
              </v-list>
            </v-menu>
          </v-toolbar>
          <v-img src={this.data.media} />
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
