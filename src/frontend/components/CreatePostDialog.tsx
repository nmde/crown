import { Upload } from 'upload';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { CreatePostResponse } from '../../types/schemas/createPost/Response';
import apiPath from '../../util/apiPath';
import categoryKey from '../../util/categoryKey';
import APIError from '../classes/APIError';
import ViewComponent from '../classes/ViewComponent';
import categories from '../data/categories.json';
import store from '../store';
import makeStyles from '../styles/makeStyles';

const styles = makeStyles({});

type Events = {
  onFinished: void;
};

@Component
/**
 * The form for users to upload media & create a post
 */
export default class CreatePostDialog extends ViewComponent<typeof styles> {
  /**
   * The post category
   */
  private category!: string;

  /**
   * The post description
   */
  private description = '';

  /**
   * The uploaded file data
   */
  private file = '';

  /**
   * Progress uploading the media
   */
  private progress = 0;

  public _tsx!: tsx.DeclareOnEvents<Events>;

  /**
   * @constructs
   */
  public constructor() {
    super(styles);
  }

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-card>
        <v-card-title>{this.messages.headers.UPLOAD}</v-card-title>
        <v-card-text>
          <v-file-input
            accept="audio/*, video/*, image/*"
            label={this.messages.labels.FILE}
            prepend-icon="camera_alt"
            vModel={this.file}
          />
          <v-select
            items={categories.categories}
            item-text={(item: { name: string }) => this.messages.categories[categoryKey(item.name)]}
            item-value="name"
            label={this.messages.labels.CATEGORY}
            vModel={this.category}
          />
          <v-textarea
            auto-grow
            rows={1}
            label={this.messages.labels.DESCRIPTION}
            vModel={this.description}
          />
          {(() => {
            if (this.loading) {
              return <v-progress-linear value={this.progress} />;
            }
            return null;
          })()}
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            loading={this.loading}
            onClick={async () => {
              this.progress = 0;
              this.loading = true;
              // TODO: Validate input
              const upload = new Upload({
                form: {
                  file: this.file,
                },
                url: apiPath('upload'),
              });
              upload.on('progress', (progress: number) => {
                this.progress = progress * 100;
              });
              const res = await upload.upload();
              const { data } = res;
              if (data !== undefined) {
                let createdPost: CreatePostResponse;
                await this.apiCall(
                  async () => {
                    createdPost = await store.createPost({
                      category: this.category,
                      description: this.description,
                      expires: '',
                      media: JSON.parse(data.toString()).id,
                    });
                  },
                  () => {
                    this.$router.push(`/post/${createdPost.id}`);
                    this.file = '';
                    this.progress = 0;
                    this.loading = false;
                    this.$emit('finished');
                  },
                  {},
                );
              } else {
                this.$bus.emit(
                  'error',
                  new APIError(this.messages.headers.POST_ERROR, this.messages.errors.GENERIC, -1),
                );
              }
            }}
          >
            {this.messages.btn.POST}
          </v-btn>
        </v-card-actions>
      </v-card>
    );
  }
}
