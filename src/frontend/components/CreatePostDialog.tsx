import { Upload } from 'upload';
import Vue, { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import t from '../translations/en-US.json';
import store from '../store';
import apiPath from '../../util/apiPath';
import ErrorDialog from './ErrorDialog';

type Events = {
  onFinished: void;
};

/**
 * The form for users to upload media & create a post
 */
@Component
export default class CreatePostDialog extends Vue {
  public _tsx!: tsx.DeclareOnEvents<Events>;

  /**
   * The post description
   */
  private description = '';

  /**
   * The current error message, if any
   */
  private error = '';

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

  /**
   * Renders the component
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
                url: apiPath('upload'),
                form: {
                  file: this.file,
                },
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
                          expires: '',
                          token: store.token as string,
                          description: this.description,
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
                  this.error = t.errors.GENERIC;
                }
              } else {
                this.error = t.errors.GENERIC;
              }
            }}
          >
            {t.btn.POST}
          </v-btn>
        </v-card-actions>
        <ErrorDialog header={t.headers.POST_ERROR} message={this.error} />
      </v-card>
    );
  }
}
