import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  // Vylepšená paleta (profesionální tyrkysová s doplňkovými barvami)
  colors: {
    brand: {
      50: '#e6fffa',
      100: '#b2f5ea',
      200: '#81e6d9',
      300: '#4fd1c5',
      400: '#38b2ac',
      500: '#319795',  // hlavní brand barva
      600: '#2c7a7b',
      700: '#285e61',
      800: '#234e52',
      900: '#1d4044',
    },
    accent: {
      100: '#f6ad55',  // oranžová pro akcenty
      200: '#ed8936',
      300: '#dd6b20',
    },
    success: {
      100: '#c6f6d5',
      500: '#48bb78',
      900: '#22543d',
    },
    error: {
      100: '#fed7d7',
      500: '#f56565',
      900: '#742a2a',
    },
    warning: {
      100: '#feebc8',
      500: '#ed8936',
      900: '#7b341e',
    },
  },
  // Globální styly
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        lineHeight: 'base',
      },
      // Styly pro scrollbar
      '::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
      '::-webkit-scrollbar-track': {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
      },
      '::-webkit-scrollbar-thumb': {
        bg: props.colorMode === 'dark' ? 'brand.600' : 'brand.400',
        borderRadius: 'full',
      },
    }),
  },
  // Komponenty
  components: {
    // Společné styly pro vstupní prvky
    Input: {
      baseStyle: (props) => ({
        field: {
          _placeholder: {
            color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
          },
        },
      }),
      variants: {
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.300',
            borderWidth: '1px',
            backgroundColor: props.colorMode === 'dark' ? 'gray.800' : 'white',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px ${props.theme.colors.brand[500]}`,
            },
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Textarea: {
      variants: {
        outline: (props) => ({
          borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.300',
          borderWidth: '1px',
          backgroundColor: props.colorMode === 'dark' ? 'gray.800' : 'white',
          _hover: {
            borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.400',
          },
          _focus: {
            borderColor: 'brand.500',
            boxShadow: `0 0 0 1px ${props.theme.colors.brand[500]}`,
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Select: {
      variants: {
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.300',
            borderWidth: '1px',
            backgroundColor: props.colorMode === 'dark' ? 'gray.800' : 'white',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px ${props.theme.colors.brand[500]}`,
            },
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    NumberInput: {
      variants: {
        outline: (props) => ({
          field: {
            borderColor: props.colorMode === 'dark' ? 'brand.400' : 'brand.300',
            borderWidth: '1px',
            backgroundColor: props.colorMode === 'dark' ? 'gray.800' : 'white',
            _hover: {
              borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.400',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: `0 0 0 1px ${props.theme.colors.brand[500]}`,
            },
          },
        }),
      },
      defaultProps: {
        variant: 'outline',
      },
    },
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? 'brand.400' : 'brand.500',
          color: props.colorMode === 'dark' ? 'gray.900' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'brand.300' : 'brand.600',
            transform: 'translateY(-1px)',
            boxShadow: 'sm',
          },
          _active: {
            bg: props.colorMode === 'dark' ? 'brand.500' : 'brand.700',
            transform: 'translateY(0)',
          },
        }),
        outline: (props) => ({
          borderColor: props.colorMode === 'dark' ? 'brand.300' : 'brand.400',
          color: props.colorMode === 'dark' ? 'brand.200' : 'brand.600',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.700' : 'brand.50',
            borderColor: props.colorMode === 'dark' ? 'brand.200' : 'brand.500',
          },
        }),
      },
    },
    Table: {
      variants: {
        striped: (props) => ({
          th: {
            bg: props.colorMode === 'dark' ? 'brand.700' : 'brand.100',
            color: props.colorMode === 'dark' ? 'white' : 'gray.800',
          },
          tr: {
            _odd: {
              bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
            },
            _hover: {
              bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
            },
          },
        }),
      },
    },
    Card: {
      baseStyle: (props) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          boxShadow: 'md',
          borderRadius: 'lg',
          borderWidth: '1px',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
      }),
    },
  },
  // Textové styly
  textStyles: {
    heading: {
      fontFamily: 'heading',
      fontWeight: 'bold',
      lineHeight: 'shorter',
    },
    subtitle: {
      fontFamily: 'heading',
      fontWeight: 'semibold',
      color: 'gray.500',
    },
  },
  // Breakpoints
  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },
  // Nastavení color-mode
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
});

export default theme;