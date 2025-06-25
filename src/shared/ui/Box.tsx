import { createBox } from '@shopify/restyle';
import { Theme } from '../theme/theme'; // <- to‘g‘ri path

const Box = createBox<Theme>(); // 🔥 MUHIM: <Theme> bo‘lishi shart
export default Box;
