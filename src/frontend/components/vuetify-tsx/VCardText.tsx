import * as tsx from 'vue-tsx-support';
import { VCardText } from 'vuetify/lib';

type Props = {};

export default tsx.ofType<Props>().convert(VCardText);
