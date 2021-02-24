import * as tsx from 'vue-tsx-support';
import { VCardSubtitle } from 'vuetify/lib';

type Props = {};

export default tsx.ofType<Props>().convert(VCardSubtitle);
