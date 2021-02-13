import { Upload } from 'upload';
import { VNode } from 'vue';
import { Component } from 'vue-property-decorator';
import t from './translations/en-US.json';
import store from './store';
import Styled from './Styled';
import apiPath from '../util/apiPath';

type Classes = 'fab';

/**
 * The main app component - Contains all global logic & UI
 */
@Component
export default class App extends Styled<Classes> {
  private description = '';

  private error = '';

  private errorDialog = false;

  private file = '';

  private loading = false;

  private nav = this.$route.path.substring(1);

  private progress = 0;

  private uploadDialog = false;

  public constructor() {
    super({
      fab: {
        bottom: '16px',
        right: '16px',
        position: 'absolute',
        width: '56px',
        height: '56px',
      },
    });
  }

  public render(): VNode {
    return (
      <v-app>
        {(() => {
          if (store.token === undefined) {
            return (
              <v-app-bar app color="primary">
                <v-app-bar-title>{t.msg.SIGNED_OUT}</v-app-bar-title>
                <v-spacer />
                <v-btn to="/login">{t.btn.SIGNIN}</v-btn>
              </v-app-bar>
            );
          }
          return null;
        })()}
        <v-main>
          {(() => {
            if (store.token !== undefined) {
              return (
                <v-btn
                  fab
                  color="primary"
                  class={this.c('fab')}
                  onClick={() => {
                    this.uploadDialog = true;
                  }}
                >
                  <v-icon>add</v-icon>
                </v-btn>
              );
            }
            return null;
          })()}
          <router-view />
        </v-main>
        <v-bottom-navigation app color="primary" grow shift vModel={this.nav}>
          <v-btn to="/" value="home">
            <span>{t.headers.HOME}</span>
            <v-icon>home</v-icon>
          </v-btn>
          <v-btn to="/categories" value="categories">
            <span>{t.headers.CATEGORIES}</span>
            <v-icon>category</v-icon>
          </v-btn>
          <v-btn to="/explore" value="explore">
            <span>{t.headers.EXPLORE}</span>
            <v-icon>explore</v-icon>
          </v-btn>
          <v-btn to="/account" value="account">
            <span>{t.headers.ACCOUNT}</span>
            <v-icon>account_circle</v-icon>
          </v-btn>
        </v-bottom-navigation>
        <v-dialog vModel={this.uploadDialog}>
          <v-card>
            <v-card-title>{t.headers.UPLOAD}</v-card-title>
            <v-card-text>
              <v-file-input
                accept="audio/*, video/*, image/*"
                label={t.labels.FILE}
                prepend-icon="camera_alt"
                vModel={this.file}
              />
              <v-textarea
                auto-grow
                rows={1}
                label={t.labels.DESCRIPTION}
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
                      this.uploadDialog = false;
                    } catch (err) {
                      this.error = t.errors.GENERIC;
                      this.errorDialog = true;
                    }
                  } else {
                    this.error = t.errors.GENERIC;
                    this.errorDialog = true;
                  }
                }}
              >
                {t.btn.POST}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog vModel={this.errorDialog}>
          <v-card>
            <v-card-title>{t.headers.POST_ERROR}</v-card-title>
            <v-card-text>{this.error}</v-card-text>
            <v-card-actions>
              <v-btn
                onClick={() => {
                  this.errorDialog = false;
                }}
              >
                {t.btn.CLOSE}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-app>
    );
  }
}
