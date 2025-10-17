import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageSelectionModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [click, setClick] = useState(false);
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

  // Show modal after 2 seconds if user hasn't selected a language preference
  useEffect(() => {
    const hasSelectedLanguage = localStorage.getItem('userLanguagePreference');
    
    if (!hasSelectedLanguage) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

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
    setClick(false);
    
    // Save user preference
    localStorage.setItem('userLanguagePreference', item.code);
    
    // Change the language
    const { pathname, asPath, query } = router;
    console.log('Changing language to:', item.code);
    router.push({ pathname, query }, asPath, { locale: item.code });
    
    // Close modal after selection
    setIsVisible(false);
  };

  const handleCloseModal = () => {
    setIsVisible(false);
    // Set a default preference to prevent modal from showing again
    localStorage.setItem('userLanguagePreference', selectedLanguage.code);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Language Popup */}
      <div className="language-popup-overlay" onClick={handleCloseModal}>
        <div className="language-popup-container" onClick={(e) => e.stopPropagation()}>
          <div className="language-popup-content bg-white rounded-4 shadow-4">
            {/* Header */}
            <div className="language-popup-header">
              <div className="text-14 fw-500 text-dark-1">
                {t("common.selectLanguage")}
              </div>
              <button className="language-popup-close" onClick={handleCloseModal}>
                <i className="icon-close text-12" />
              </button>
            </div>

            {/* Language Options */}
            <div className="language-popup-body">
              <div className="language-popup-list">
                {languageContent.map((item) => (
                  <div
                    className={`language-popup-item ${
                      selectedLanguage.code === item.code ? "active" : ""
                    }`}
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="language-popup-flag">
                      {item.flag}
                    </div>
                    <div className="language-popup-info">
                      <div className="language-popup-name">
                        {item.language}
                      </div>
                      <div className="language-popup-country">
                        {item.country}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .language-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: transparent;
          z-index: 9999;
          pointer-events: none;
        }

        .language-popup-container {
          position: absolute;
          top: 80px;
          right: 20px;
          pointer-events: auto;
          animation: popupSlideIn 0.3s ease-out;
        }

        .language-popup-content {
          min-width: 280px;
          max-width: 320px;
          border: 1px solid #e4e5e7;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        }

        .language-popup-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
        }

        .language-popup-close {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .language-popup-close:hover {
          background-color: #f5f5f5;
        }

        .language-popup-body {
          padding: 8px;
        }

        .language-popup-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .language-popup-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .language-popup-item:hover {
          background-color: #f8f9ff;
        }

        .language-popup-item.active {
          background-color: #f8f9ff;
          color: #3554d1;
        }

        .language-popup-flag {
          font-size: 18px;
          line-height: 1;
          min-width: 20px;
        }

        .language-popup-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          flex: 1;
        }

        .language-popup-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
        }

        .language-popup-item.active .language-popup-name {
          color: #3554d1;
        }

        .language-popup-country {
          font-size: 11px;
          color: #666;
        }

        @keyframes popupSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .language-popup-container {
            top: 60px;
            right: 8px;
            left: 8px;
          }
          
          .language-popup-content {
            min-width: auto;
            max-width: none;
          }
          
          .language-popup-header {
            padding: 8px 12px;
          }
          
          .language-popup-body {
            padding: 6px;
          }
          
          .language-popup-item {
            padding: 8px 10px;
          }
          
          .language-popup-flag {
            font-size: 16px;
            min-width: 18px;
          }
          
          .language-popup-name {
            font-size: 12px;
          }
          
          .language-popup-country {
            font-size: 10px;
          }
          
          .language-popup-title {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .language-popup-container {
            top: 50px;
            right: 6px;
            left: 6px;
          }
          
          .language-popup-header {
            padding: 6px 10px;
          }
          
          .language-popup-body {
            padding: 4px;
          }
          
          .language-popup-item {
            padding: 6px 8px;
          }
          
          .language-popup-flag {
            font-size: 14px;
            min-width: 16px;
          }
          
          .language-popup-name {
            font-size: 11px;
          }
          
          .language-popup-country {
            font-size: 9px;
          }
          
          .language-popup-title {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
};

export default LanguageSelectionModal;
