import { Styles } from '../styles/makeStyles';
import Styled from './Styled';

/**
 * Utility class for view component
 */
export default class ViewComponent<T extends Styles<string>> extends Styled<T> {}
