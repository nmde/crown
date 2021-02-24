import * as tsx from 'vue-tsx-support';
import { VCardTitle } from 'vuetify/lib';

type Props = {};

export default tsx.ofType<Props>().convert(VCardTitle);
