import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';

@Component({})
export default class Media extends Vue {
  public _tsx!: tsx.DeclareProps<tsx.AutoProps<Media>>;

  @Prop()
  public enabled?: boolean;

  @Prop()
  public debug?: boolean;

  public render(): VNode {
    return (
      <vue-plyr
        options={{
          enabled: this.enabled,
          debug: this.debug,
        }}
      >
        <slot />
      </vue-plyr>
    );
  }
}
