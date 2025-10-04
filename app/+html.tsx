import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="de">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

                {/* PWA Meta Tags */}
                <meta name="application-name" content="Meterstein" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Meterstein" />
                <meta name="description" content="Professional awning and sunshade management app" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" href="/logo192.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/logo192.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/logo192.png" />
                <link rel="apple-touch-icon" sizes="167x167" href="/logo192.png" />

                {/* Standard Icons */}
                <link rel="icon" type="image/png" sizes="32x32" href="/logo192.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/logo192.png" />
                <link rel="shortcut icon" href="/favicon.ico" />

                {/* PWA Manifest */}
                <link rel="manifest" href="/manifest.json" />

                {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
                <ScrollViewStyleReset />

                {/* Add any additional <head> elements that you want globally available on web... */}
            </head>
            <body>{children}</body>
        </html>
    );
}
