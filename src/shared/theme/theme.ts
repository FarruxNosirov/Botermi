// theme.ts

import { createTheme } from '@shopify/restyle';

const theme = createTheme({
  colors: {
    primary: '#E53935',
    background: '#fff',
    text: '#222',
    white: '#fff',
    gray: '#B0B0B0',
    border: '#F0F0F0',
    gray3: '#333333',
    gray4: '#888',
    black: '#000',
  },
  spacing: {
    none: 0,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 60,
  },
  borderRadii: {
    s: 8,
    m: 16,
    l: 24,
    full: 9999,
  },
  textVariants: {
    title: {
      color: 'text',
      textAlign: 'left',
      fontSize: 22,
      fontWeight: '700',
      marginBottom: 's',
    },
    languageTitle: {
      color: 'gray4',
      fontSize: 18,
      marginBottom: 'l',
    },
    langName: {
      fontSize: 16,
      color: 'text',
    },
    arrow: {
      fontSize: 22,
      color: 'gray',
    },
    goBackHeader: {
      fontSize: 20,
      fontWeight: '600',
      color: 'gray3',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: '600',
    },
    phone: {
      color: 'text',
      fontWeight: '600',
    },
    timeLeft: {
      color: 'gray4',
      fontSize: 16,
    },
    error: {
      color: 'primary',
    },
  },
  breakpoints: {},
  variants: {
    card: {
      default: {
        padding: 'm',
        backgroundColor: 'background',
        borderRadius: 'm',
        borderWidth: 1,
        borderColor: 'border',
      },
      elevated: {
        padding: 'l',
        backgroundColor: 'primary',
        borderRadius: 'l',
        shadowColor: 'black',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
    },
  },
});

export type Theme = typeof theme;
export default theme;
