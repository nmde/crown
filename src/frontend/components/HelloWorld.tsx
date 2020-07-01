import { Component, Prop } from 'vue-property-decorator';
import * as tsx from 'vue-tsx-support';
import { VNode } from 'vue';

type HelloWorldProps = {
  message: string;
};

@Component
export default class HelloWorld extends tsx.Component<HelloWorldProps> {
  _tsx!: tsx.DeclareProps<tsx.AutoProps<HelloWorld>>;

  @Prop({ type: String, required: true })
  message!: string;

  render(): VNode {
    return <h1>{this.message}</h1>;
  }
}
