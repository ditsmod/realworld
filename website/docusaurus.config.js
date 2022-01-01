// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const i18n = require('./i18n');

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  i18n,
  title: 'RealWorld',
  // tagline: 'Dinosaurs are cool',
  url: 'https://ditsmod.github.io',
  baseUrl: '/realworld/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ditsmod', // Usually your GitHub org/user name.
  projectName: 'realworld', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        gtag: {
          trackingID: 'G-0M12KDH9XX',
          // Optional fields.
          // anonymizeIP: true, // Should IPs be anonymized?
        },
        docs: {
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: ({ version, versionDocsDirPath, docPath, locale }) =>
          locale == 'en'
            ? `https://github.com/ditsmod/realworld/edit/main/website/i18n/en/docusaurus-plugin-content-docs/${version}/${docPath}`
            : `https://github.com/ditsmod/realworld/edit/main/website/${versionDocsDirPath}/${docPath}`,
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        // title: 'RealWorld',
        logo: {
          alt: 'RealWorld Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            href: 'https://github.com/ditsmod/realworld',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Ditsmod, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
