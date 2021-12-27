import { createRenderer } from 'fela';
import important from 'fela-plugin-important';

export default createRenderer({
  plugins: [important()],
});
