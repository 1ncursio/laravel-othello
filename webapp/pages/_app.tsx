import Logo from '@components/Logo';
import AppNavBar from '@layouts/AppNavBar';
import {
  ActionIcon,
  AppShell,
  Burger,
  ColorScheme,
  ColorSchemeProvider,
  Global,
  Group,
  Header,
  MantineProvider,
  MediaQuery,
  useMantineTheme,
} from '@mantine/core';
import { getCookie, setCookies } from 'cookies-next';
import type { GetServerSidePropsContext } from 'next';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useState } from 'react';
import { SWRConfig } from 'swr';
import { Moon, Sun } from 'tabler-icons-react';
import '../styles/globals.css';

const App = (props: AppProps & { colorScheme: ColorScheme }) => {
  const theme = useMantineTheme();
  const { Component, pageProps } = props;
  // hook will return either 'dark' or 'light' on client
  // and always 'light' during ssr as window.matchMedia is not available
  const [colorScheme, setColorScheme] = useState<ColorScheme>(props.colorScheme);
  const [opened, setOpened] = useState(false);

  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(nextColorScheme);
    // when color scheme is updated save it to cookie
    setCookies('color-scheme', nextColorScheme, { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <SWRConfig
      value={{
        errorRetryCount: 3,
        dedupingInterval: 5000,
        errorRetryInterval: 5000,
      }}
    >
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            fixed
            navbar={<AppNavBar hidden={!opened} />}
            header={
              <Header height={60} p="md">
                <Group position="apart" sx={{ height: '100%' }}>
                  <Group sx={{ height: '100%' }}>
                    <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                      <Burger
                        opened={opened}
                        onClick={() => setOpened((o) => !o)}
                        size="sm"
                        color={theme.colors.gray[6]}
                        mr="lg"
                      />
                    </MediaQuery>
                    <Link href="/play">
                      <a>
                        <Logo colorScheme={colorScheme} />
                      </a>
                    </Link>
                  </Group>
                  <Group sx={{ height: '100%' }}>
                    <ActionIcon variant="default" onClick={() => toggleColorScheme()}>
                      {colorScheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                    </ActionIcon>
                  </Group>
                </Group>
              </Header>
            }
            styles={(theme) => ({
              main: {
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
              },
            })}
          >
            <Component {...pageProps} />
          </AppShell>
        </MantineProvider>
      </ColorSchemeProvider>
      <Global
        styles={(theme) => ({
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },

          // body: {
          //   ...theme.fn.fontStyles(),
          //   backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          //   color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
          //   lineHeight: theme.lineHeight,
          // },
        })}
      />
    </SWRConfig>
  );
};

App.getInitialProps = ({ ctx }: { ctx: GetServerSidePropsContext }) => ({
  // get color scheme from cookie
  colorScheme: getCookie('color-scheme', ctx) || 'light',
});

export default appWithTranslation(App);
