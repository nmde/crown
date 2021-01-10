declare module '*.vue' {
  import { VueConstructor } from 'vue';

  const component: VueConstructor;
  export default component;
}
