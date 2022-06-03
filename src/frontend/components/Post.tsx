/**
 * @file Post component.
 */
import { VNode } from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { IEdge, IPost, IUser } from '../../types';
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

type DescBlock = {
  content: string;
  type: 'text' | 'tag';
};

@Component
/**
 * Displays a post.
 */
export default class Post extends Styled<typeof styles> {
  /**
   * The post author.
   */
  private data: {
    author?: IUser;
    boosts: IEdge[];
    likes: IEdge[];
    media?: string;
  } = {
    boosts: [],
    likes: [],
  };

  /**
   * The post data.
   */
  @Prop()
  public post!: IPost;

  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Post>> &
  tsx.DeclareOnEvents<{
    onDelete: string;
  }>;

  /**
   * Defines custom styles for the component.
   *
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Gets the boost-altered number of likes to display.
   *
   * @returns {number} The likes.
   */
  private get computedLikes(): number {
    return this.data.likes.length + this.data.boosts.length * 5;
  }

  /**
   * Splits the description into objects describing text and links.
   *
   * @returns {DescBlock[]} The description objects.
   */
  private get splitDescription(): DescBlock[] {
    const tagRe = /#([a-zA-Z]+).*/;
    let desc = this.post.description;
    const re: DescBlock[] = [];
    if (desc) {
      let match = tagRe.exec(desc);
      while (match !== null) {
        const tag = desc.substring(match.index).replace(tagRe, '$1');
        re.push({
          content: desc.substring(0, match.index),
          type: 'text',
        });
        re.push({
          content: tag,
          type: 'tag',
        });
        desc = desc.substring(match.index + tag.length + 1);
        match = tagRe.exec(desc);
      }
    }
    re.push({
      content: desc || '',
      type: 'text',
    });
    return re;
  }

  /**
   * Retrieves information about the post author.
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

    if (this.post.id !== undefined) {
      try {
        this.$set(
          this.data,
          'likes',
          await store.getEdges({
            target: this.post.id,
            type: 'like',
          }),
        );
        this.$set(
          this.data,
          'boosts',
          await store.getEdges({
            target: this.post.id,
            type: 'boost',
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
   * Renders the component.
   *
   * @returns {VNode} The component.
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
                 * The menu activator.
                 *
                 * @param {any} on Vue event bindings.
                 * @returns {VNode} The activator button.
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
                  onClick={async () => {
                    try {
                      await store.boost({
                        target: this.post.id as string,
                      });
                    } catch (err) {
                      console.log(err);
                    }
                  }}
                >
                  Boost
                </v-list-item>
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
            <v-btn
              color="primary"
              plain
              block
              onClick={async () => {
                try {
                  await store.createEdge({
                    target: this.post.id as string,
                    type: 'like',
                  });
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              <v-icon>favorite</v-icon>
              <span>{this.computedLikes}</span>
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <div class="text-body-2">
              {(() => this.splitDescription.map((section) => {
                switch (section.type) {
                  case 'tag':
                    return (
                        <router-link to={`/tag/${section.content}`}>#{section.content}</router-link>
                    );
                  default:
                    return <span>{section.content}</span>;
                }
              }))()}
            </div>
            <div class={this.className('description')}>{formatDate(this.post.created || '')}</div>
          </v-card-text>
        </v-card>
      );
    }
    return <div></div>;
  }
}
