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

                {/* PWA Manifest */}
                <link rel="manifest" href="/manifest.json" />

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

                {/* Default Apple Touch Icon - iOS fallback */}
                <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />

                {/* Apple Touch Icons - different sizes with cache-busting */}
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png?v=1" />
                <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png?v=1" />
                <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png?v=1" />

                {/* iOS Splash Screen - Universal for all devices */}
                <link rel="apple-touch-startup-image" href="/splash-dark.png" />

                {/* Additional iOS-specific meta tags */}
                <meta name="apple-mobile-web-app-status-bar-style" content="#000000" />


                {/* Standard Icons - different sizes */}
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="shortcut icon" href="/favicon.ico" />


                {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
                <ScrollViewStyleReset />

            </head>
            <body>{children}</body>
        </html>
    );
}

{/* iOS Splash Screens - Different device orientations and sizes */ }
{/* <link rel="apple-touch-startup-image" href="/splash-640x1136-png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" /> */ }
{/* <link rel="apple-touch-startup-image" href="/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
<link rel="apple-touch-startup-image" href="/splash-1125x2436-png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
<link rel="apple-touch-startup-image" href="/splash-1242x2208-png" media=" (device-width: 414px)
and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" />
‹link rel="apple-touch-startup-image" href="/splash-1536x2048.png" media="(device-width: 768px)
and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" />
‹link rel="apple-touch-startup-image" href="/splash-1668x2388.png" media="(device-width: 834px)
and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" /> */}


// {
//     "src": "/splash-750x1334.png",
//     "sizes": "750x1334",
//     "type": "image/png",
//     "form_factor": "narrow"
// },
// {
//     "src": "/splash-1125x2436.png",
//     "sizes": "1125x2436",
//     "type": "image/png",
//     "form_factor": "narrow"
// },
// {
//     "src": "/splash-1242x2208.png",
//     "sizes": "1242x2208",
//     "type": "image/png",
//     "form_factor": "narrow"
// },
// {
//     "src": "/splash-1536x2048.png",
//     "sizes": "1536x2048",
//     "type": "image/png",
//     "form_factor": "wide"
// },
// {
//     "src": "/splash-1668x2388.png",
//     "sizes": "1668x2388",
//     "type": "image/png",
//     "form_factor": "wide"
// }