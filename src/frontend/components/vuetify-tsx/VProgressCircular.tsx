import * as tsx from 'vue-tsx-support';
import { VProgressCircular } from 'vuetify/lib';
import { Colorable } from './types';

type Props = Colorable & {
    /**
     * Constantly animates, use when loading progress is unknown
     */
    indeterminate?: boolean;

    /**
     * Rotates the circle start point in deg
     */
    rotate?: number | string;

    /**
     * Sets the diameter of the circle in pixels
     */
    size?: number | string;

    /**
     * The percentage value for current progress
     */
    value?: number | string;

    /**
     * Sets the stroke of the circle in pixels
     */
    width?: number | string;
};

export default tsx.ofType<Props>().convert(VProgressCircular);
