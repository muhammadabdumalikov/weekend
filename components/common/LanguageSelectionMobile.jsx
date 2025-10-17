import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSelectionMobile = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const languageContent = useMemo(() => [
    { id: 1, language: t("languages.english"), country: "United States", code: "en", flag: "🇺🇸" },
    { id: 2, language: t("languages.russian"), country: "Russia", code: "ru", flag: "🇷🇺" },
    { id: 3, language: t("languages.uzbek"), country: "Uzbekistan", code: "uz", flag: "🇺🇿" },
  ], [t]);

  const [selectedLanguage, setSelectedLanguage] = useState(
    languageContent.find(lang => lang.code === router.locale) || languageContent[0]
  );

  // Show popup after 2 seconds if user hasn't selected a language preference
  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('userLanguagePreference');
    
    if (!hasSelectedLanguage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Update selected language when router locale changes
  useEffect(() => {
    const currentLanguage = languageContent.find(lang => lang.code === router.locale);
    if (currentLanguage) {
      setSelectedLanguage(currentLanguage);
    }
  }, [router.locale, i18n.language]);

  const handleItemClick = (item) => {
    setSelectedLanguage(item);
    
    // Save user preference
    localStorage.setItem('userLanguagePreference', item.code);
    
    // Change the language
    const { pathname, asPath, query } = router;
    console.log('Changing language to:', item.code);
    router.push({ pathname, query }, asPath, { locale: item.code });
    
    // Close popup after selection
    setIsVisible(false);
  };

  const handleClosePopup = () => {
    setIsVisible(false);
    // Set a default preference to prevent popup from showing again
    localStorage.setItem('userLanguagePreference', selectedLanguage.code);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Language Popup - Icons Only */}
      <div className="language-mobile-overlay" onClick={handleClosePopup}>
        <div className="language-mobile-container" onClick={(e) => e.stopPropagation()}>
          <div className="language-mobile-content">
            {/* Header */}
            <div className="language-mobile-header">
              <div className="language-mobile-title">
                {t("common.selectLanguage")}
              </div>
            </div>

            {/* Language Icons */}
            <div className="language-mobile-icons">
              {languageContent.map((item) => (
                <button
                  className={`language-mobile-icon ${
                    selectedLanguage.code === item.code ? "active" : ""
                  }`}
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  title={`${item.language} - ${item.country}`}
                >
                  <span className="language-mobile-flag">
                    {item.flag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .language-mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          z-index: 9999;
          pointer-events: none;
        }

        .language-mobile-container {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: auto;
          animation: mobilePopupSlideIn 0.3s ease-out;
        }

        .language-mobile-content {
          background: white;
          border: 1px solid #e4e5e7;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
          min-width: 200px;
        }

        .language-mobile-header {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .language-mobile-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
        }

        .language-mobile-icons {
          display: flex;
          gap: 12px;
          padding: 16px;
          justify-content: center;
        }

        .language-mobile-icon {
          background: none;
          border: 2px solid #e4e5e7;
          border-radius: 12px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
          min-height: 48px;
        }

        .language-mobile-icon:hover {
          border-color: #3554d1;
          background-color: #f8f9ff;
        }

        .language-mobile-icon.active {
          border-color: #3554d1;
          background-color: #f8f9ff;
        }

        .language-mobile-flag {
          font-size: 24px;
          line-height: 1;
        }

        @keyframes mobilePopupSlideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .language-mobile-container {
            bottom: 15px;
            left: 50%;
            transform: translateX(-50%);
          }
          
          .language-mobile-content {
            min-width: 180px;
          }
          
          .language-mobile-header {
            padding: 8px 12px;
          }
          
          .language-mobile-title {
            font-size: 12px;
          }
          
          .language-mobile-icons {
            padding: 12px;
            gap: 8px;
          }
          
          .language-mobile-icon {
            min-width: 40px;
            min-height: 40px;
            padding: 8px;
          }
          
          .language-mobile-flag {
            font-size: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default LanguageSelectionMobile;
