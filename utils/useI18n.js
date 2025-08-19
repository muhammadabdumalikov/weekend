import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export const useI18n = () => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const changeLanguage = (locale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale });
  };

  const getCurrentLanguage = () => {
    return router.locale || 'uz';
  };

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: t('languages.english'), flag: '🇺🇸' },
      { code: 'ru', name: t('languages.russian'), flag: '🇷🇺' },
      { code: 'uz', name: t('languages.uzbek'), flag: '🇺🇿' },
    ];
  };

  return {
    t,
    i18n,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    locale: router.locale,
    locales: router.locales,
  };
};
