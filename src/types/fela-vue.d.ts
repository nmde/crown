import Vue from 'vue';

declare module 'vue/types/vue' {
  interface Vue {
    f: (className: string) => string;
  }
}
