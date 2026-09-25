import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'

/*
 * Eque global Storybook config (TASKS.md 0.6).
 * - Dark canvas forced to the page background #070A0F (DESIGN §2.1).
 * - Fonts load via .storybook/preview-head.html (Google Fonts link for
 *   Spline Sans Mono + Inter, the Google Sans fallback from DESIGN §3.1).
 * - a11y addon registered in main.ts; kept on 'todo' so violations show
 *   in the test UI without failing CI prematurely.
 * - 375px mobile viewport added per AGENTS.md §9 / DESIGN §10.
 * - autodocs enabled globally; every component meta still sets tags too.
 */
const preview: Preview = {
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    backgrounds: {
      default: 'eque-canvas',
      values: [
        { name: 'eque-canvas', value: '#070A0F' },
        { name: 'surface', value: '#0D1219' },
        { name: 'surface-high', value: '#1A222D' },
      ],
    },

    viewport: {
      options: {
        mobile375: {
          name: 'Mobile 375',
          styles: { width: '375px', height: '812px' },
        },
        tablet768: {
          name: 'Tablet 768',
          styles: { width: '768px', height: '1024px' },
        },
        desktop1280: {
          name: 'Desktop 1280',
          styles: { width: '1280px', height: '800px' },
        },
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;
