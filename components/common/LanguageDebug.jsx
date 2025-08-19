import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const LanguageDebug = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    setDebugInfo({
      routerLocale: router.locale,
      routerLocales: router.locales,
      routerDefaultLocale: router.defaultLocale,
      i18nLanguage: i18n.language,
      i18nLanguages: i18n.languages,
      i18nReady: i18n.isInitialized,
      currentUrl: typeof window !== "undefined" ? window.location.href : "Server-side",
      timestamp: new Date().toISOString(),
    });
  }, [router, i18n]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "10px",
      background: "rgba(0,0,0,0.8)",
      color: "white",
      padding: "10px",
      borderRadius: "5px",
      fontSize: "12px",
      zIndex: 9999,
      maxWidth: "300px",
      fontFamily: "monospace"
    }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>🌐 Language Debug</div>
      <div>Router Locale: {debugInfo.routerLocale}</div>
      <div>i18n Language: {debugInfo.i18nLanguage}</div>
      <div>i18n Ready: {debugInfo.i18nReady ? "✅" : "❌"}</div>
      <div>URL: {debugInfo.currentUrl}</div>
      <div>Time: {debugInfo.timestamp}</div>
      <div style={{ marginTop: "5px", fontSize: "10px" }}>
        Test: {t("common.welcome")}
      </div>
    </div>
  );
};

export default LanguageDebug;
