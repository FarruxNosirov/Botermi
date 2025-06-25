import { Image as RNImage } from 'react-native';
import { createBox } from '@shopify/restyle';
import { Theme } from '../theme/theme';

const Box = createBox<Theme>();

export const Image = ({ ...props }) => (
  <Box {...props}>
    <RNImage style={{ width: '100%', height: '100%' }} {...props} />
  </Box>
);
