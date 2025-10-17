import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Default Meta Tags for Tour Guide Platform */}
        <meta
          name="description"
          content="inMakon - Central Asia's premier tour guide booking platform. Book professional local guides in Uzbekistan, Kazakhstan, Kyrgyzstan, and Tajikistan. Expert guides, instant booking, competitive prices."
        />
        
        {/* Keywords for Tour Guide Booking */}
        <meta
          name="keywords"
          content="Central Asia tour guide, Uzbekistan tour guide, Kazakhstan tour guide, Kyrgyzstan tour guide, Tajikistan tour guide, Silk Road guide, local tour guide booking, professional tour guide, certified guide, Tashkent guide, Samarkand guide, Bukhara guide, Almaty guide, Bishkek guide, Dushanbe guide, tour guide platform, guide booking service"
        />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Favicon and Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.wetrippo.com" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
