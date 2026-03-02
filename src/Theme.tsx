import { createTheme } from '@mantine/core';

// Orange theme — works well on black (dark) and light
const theme = createTheme({
  fontFamily: "'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  primaryColor: 'orange',
  defaultRadius: 'md',
  radius: {
    xs: '6px',
    sm: '8px',
    md: '10px',
    lg: '12px',
    xl: '14px',
  },
  headings: {
    fontFamily: "'Onest', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontWeight: '600',
  },
  components: {
    Button: {
      defaultProps: {
        color: 'orange',
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          border: '1px solid var(--mantine-color-default-border)',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
      styles: {
        root: {
          border: '1px solid var(--mantine-color-default-border)',
        },
      },
    },
    Table: {
      styles: {
        root: {
          '& th': { fontWeight: 600 },
        },
      },
    },
    Modal: {
      defaultProps: {
        radius: 'lg',
        shadow: 'lg',
      },
      styles: {
        header: {
          borderBottom: '1px solid var(--mantine-color-default-border)',
        },
      },
    },
    NavLink: {
      defaultProps: {
        variant: 'light',
        color: 'orange',
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: 'md',
        variant: 'subtle',
        color: 'orange',
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});

export default theme;
