import * as tsx from 'vue-tsx-support';
import { VCardActions } from 'vuetify/lib';

type Props = {};

export default tsx.ofType<Props>().convert(VCardActions);
