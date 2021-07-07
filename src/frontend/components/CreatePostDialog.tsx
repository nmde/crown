import { Upload } from 'upload';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import apiPath from '../../util/apiPath';
import APIError from '../classes/APIError';
import store from '../store';
import t from '../translations/en-US.json';

type Events = {
  onFinished: void;
};

@Component
/**
 * The form for users to upload media & create a post
 */
export default class CreatePostDialog extends Vue {
  /**
   * The post description
   */
  private description = '';

  /**
   * The uploaded file data
   */
  private file = '';

  /**
   * Is the upload is pending
   */
  private loading = false;

  /**
   * Progress uploading the media
   */
  private progress = 0;

  public _tsx!: tsx.DeclareOnEvents<Events>;

  /**
   * Renders the component
   *
   * @returns {VNode} the component
   */
  public render(): VNode {
    return (
      <v-card>
        <v-card-title>{t.headers.UPLOAD}</v-card-title>
        <v-card-text>
          <v-file-input
            accept="audio/*, video/*, image/*"
            label={t.labels.FILE}
            prepend-icon="camera_alt"
            vModel={this.file}
          />
          <v-textarea auto-grow rows={1} label={t.labels.DESCRIPTION} vModel={this.description} />
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
              if (res.data) {
                try {
                  this.$router.push(
                    `/post/${
                      (
                        await store.createPost({
                          description: this.description,
                          expires: '',
                          media: JSON.parse(res.data.toString()).id,
                        })
                      ).id
                    }`,
                  );
                  this.file = '';
                  this.progress = 0;
                  this.loading = false;
                  this.$emit('finished');
                } catch (err) {
                  this.$bus.emit('error', new APIError(t.headers.POST_ERROR, t.errors.GENERIC, err.response.status));
                }
              } else {
                this.$bus.emit('error', new APIError(t.headers.POST_ERROR, t.errors.GENERIC, -1));
              }
            }}
          >
            {t.btn.POST}
          </v-btn>
        </v-card-actions>
      </v-card>
    );
  }
}
