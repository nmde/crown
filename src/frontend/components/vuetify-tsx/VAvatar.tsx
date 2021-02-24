import * as tsx from 'vue-tsx-support';
import { VAvatar } from 'vuetify/lib';
import { Colorable, Sizeable } from './types';

type Props = Colorable & Sizeable & {
    /**
     * Designates that the avatar is on the left side of a component
     * This is hooked into by components such as v-chip and v-btn.
     */
    left?: boolean;

    /**
     * Designates that the avatar is on the right side of a component
     * This is hooked into by components such as v-chip and v-btn.
     */
    right?: boolean;

    /**
     * Designates the border-radius applied to the component
     * @see https://vuetifyjs.com/styles/border-radius
     */
    rounded?: boolean | string;

    /**
     * Sets the height and width of the component
     */
    size?: number | string;

    /**
     * Removes the component’s border-radius
     */
    tile?: boolean;
};

export default tsx.ofType<Props>().convert(VAvatar);
