import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

const CookieNotice = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { t } = useTranslation("common");

  // Cookie preferences state
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    const cookiePreferences = localStorage.getItem('cookiePreferences');
    
    if (!cookieConsent) {
      setIsVisible(true);
    }
    
    if (cookiePreferences) {
      setPreferences(JSON.parse(cookiePreferences));
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setIsVisible(false);
    
    // Here you would typically initialize analytics, marketing tools, etc.
    initializeCookies(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    setPreferences(onlyNecessary);
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(onlyNecessary));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setIsVisible(false);
    setShowSettings(false);
    
    initializeCookies(preferences);
  };

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const initializeCookies = (prefs) => {
    // Initialize Google Analytics if analytics cookies are accepted
    if (prefs.analytics) {
      // gtag('consent', 'update', { 'analytics_storage': 'granted' });
      console.log('Analytics cookies enabled');
    }
    
    // Initialize marketing tools if marketing cookies are accepted
    if (prefs.marketing) {
      console.log('Marketing cookies enabled');
    }
    
    // Initialize functional cookies if functional cookies are accepted
    if (prefs.functional) {
      console.log('Functional cookies enabled');
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Cookie Notice Overlay */}
      <div className="cookie-notice-overlay">
        <div className="cookie-notice-container">
          <div className="cookie-notice-content">
            {!showSettings ? (
              // Main Cookie Notice
              <>
                <div className="cookie-notice-header">
                  <div className="cookie-icon">🍪</div>
                  <h3 className="cookie-notice-title">
                    {t("cookies.title")}
                  </h3>
                </div>
                
                <div className="cookie-notice-body">
                  <p className="cookie-notice-description">
                    {t("cookies.description")}
                  </p>
                  
                  <div className="cookie-notice-actions">
                    <button 
                      className="cookie-btn cookie-btn-secondary"
                      onClick={handleRejectAll}
                    >
                      {t("cookies.rejectAll")}
                    </button>
                    
                    <button 
                      className="cookie-btn cookie-btn-outline"
                      onClick={() => setShowSettings(true)}
                    >
                      {t("cookies.customize")}
                    </button>
                    
                    <button 
                      className="cookie-btn cookie-btn-primary"
                      onClick={handleAcceptAll}
                    >
                      {t("cookies.acceptAll")}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // Cookie Settings
              <>
                <div className="cookie-notice-header">
                  <button 
                    className="cookie-back-btn"
                    onClick={() => setShowSettings(false)}
                  >
                    ← {t("common.back")}
                  </button>
                  <h3 className="cookie-notice-title">
                    {t("cookies.settings")}
                  </h3>
                </div>
                
                <div className="cookie-notice-body">
                  <p className="cookie-notice-description">
                    {t("cookies.settingsDescription")}
                  </p>
                  
                  <div className="cookie-preferences">
                    {[
                      {
                        key: 'necessary',
                        title: t("cookies.necessary.title"),
                        description: t("cookies.necessary.description"),
                        required: true
                      },
                      {
                        key: 'analytics',
                        title: t("cookies.analytics.title"),
                        description: t("cookies.analytics.description"),
                        required: false
                      },
                      {
                        key: 'marketing',
                        title: t("cookies.marketing.title"),
                        description: t("cookies.marketing.description"),
                        required: false
                      },
                      {
                        key: 'functional',
                        title: t("cookies.functional.title"),
                        description: t("cookies.functional.description"),
                        required: false
                      }
                    ].map((cookie) => (
                      <div key={cookie.key} className="cookie-preference-item">
                        <div className="cookie-preference-info">
                          <h4 className="cookie-preference-title">
                            {cookie.title}
                            {cookie.required && (
                              <span className="cookie-required">*</span>
                            )}
                          </h4>
                          <p className="cookie-preference-description">
                            {cookie.description}
                          </p>
                        </div>
                        <div className="cookie-preference-toggle">
                          <label className="cookie-toggle">
                            <input
                              type="checkbox"
                              checked={preferences[cookie.key]}
                              onChange={() => handlePreferenceChange(cookie.key)}
                              disabled={cookie.required}
                            />
                            <span className="cookie-toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="cookie-notice-actions">
                    <button 
                      className="cookie-btn cookie-btn-secondary"
                      onClick={handleRejectAll}
                    >
                      {t("cookies.rejectAll")}
                    </button>
                    
                    <button 
                      className="cookie-btn cookie-btn-primary"
                      onClick={handleSavePreferences}
                    >
                      {t("cookies.savePreferences")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookie-notice-overlay {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 10000;
          animation: slideUp 0.3s ease-out;
        }

        .cookie-notice-container {
          width: 50%;
          margin: 0 auto;
          padding: 20px;
        }

        @media (max-width: 768px) {
          .cookie-notice-container {
            width: 100%;
            margin: 0;
            padding: 8px;
          }
        }

        .cookie-notice-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
          overflow: hidden;
        }

        .cookie-notice-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px 0;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 12px;
        }

        .cookie-icon {
          font-size: 24px;
        }

        .cookie-notice-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .cookie-back-btn {
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 14px;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .cookie-back-btn:hover {
          background-color: #f5f5f5;
        }

        .cookie-notice-body {
          padding: 0 20px 16px;
        }

        .cookie-notice-description {
          color: #666;
          line-height: 1.4;
          margin-bottom: 16px;
        }

        .cookie-notice-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cookie-btn {
          padding: 10px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          min-width: 100px;
        }

        .cookie-btn-primary {
          background-color: #3554d1;
          color: white;
        }

        .cookie-btn-primary:hover {
          background-color: #2d47b8;
        }

        .cookie-btn-secondary {
          background-color: #f5f5f5;
          color: #666;
        }

        .cookie-btn-secondary:hover {
          background-color: #e5e5e5;
        }

        .cookie-btn-outline {
          background-color: transparent;
          color: #3554d1;
          border: 1px solid #3554d1;
        }

        .cookie-btn-outline:hover {
          background-color: #f8f9ff;
        }

        .cookie-preferences {
          margin: 16px 0;
        }

        .cookie-preference-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .cookie-preference-item:last-child {
          border-bottom: none;
        }

        .cookie-preference-info {
          flex: 1;
          margin-right: 16px;
        }

        .cookie-preference-title {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 4px 0;
        }

        .cookie-required {
          color: #e74c3c;
          margin-left: 4px;
        }

        .cookie-preference-description {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
          margin: 0;
        }

        .cookie-toggle {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .cookie-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .cookie-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: 0.2s;
          border-radius: 24px;
        }

        .cookie-toggle-slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: 0.2s;
          border-radius: 50%;
        }

        .cookie-toggle input:checked + .cookie-toggle-slider {
          background-color: #3554d1;
        }

        .cookie-toggle input:checked + .cookie-toggle-slider:before {
          transform: translateX(20px);
        }

        .cookie-toggle input:disabled + .cookie-toggle-slider {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .cookie-notice-header {
            padding: 8px 12px 0;
            margin-bottom: 8px;
          }
          
          .cookie-notice-body {
            padding: 0 12px 12px;
          }
          
          .cookie-notice-actions {
            flex-direction: row;
            gap: 8px;
            flex-wrap: wrap;
          }
          
          .cookie-btn {
            flex: 1;
            min-width: 0;
            padding: 10px 8px;
            font-size: 12px;
            font-weight: 500;
            border-radius: 6px;
            min-height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .cookie-notice-description {
            font-size: 12px;
            line-height: 1.4;
            margin-bottom: 12px;
          }
          
          .cookie-notice-title {
            font-size: 14px;
          }
          
          .cookie-preference-item {
            flex-direction: column;
            gap: 8px;
            padding: 12px 0;
          }
          
          .cookie-preference-info {
            margin-right: 0;
          }
          
          .cookie-preference-title {
            font-size: 14px;
          }
          
          .cookie-preference-description {
            font-size: 12px;
          }
          
          .cookie-toggle {
            width: 44px;
            height: 24px;
          }
          
          .cookie-toggle-slider:before {
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
          }
          
          .cookie-toggle input:checked + .cookie-toggle-slider:before {
            transform: translateX(20px);
          }
        }

        @media (max-width: 480px) {
          .cookie-notice-container {
            padding: 6px;
          }
          
          .cookie-notice-header {
            padding: 6px 10px 0;
            margin-bottom: 6px;
          }
          
          .cookie-notice-body {
            padding: 0 10px 10px;
          }
          
          .cookie-btn {
            padding: 8px 6px;
            font-size: 11px;
            min-height: 36px;
          }
          
          .cookie-notice-title {
            font-size: 13px;
          }
          
          .cookie-notice-description {
            font-size: 11px;
            margin-bottom: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default CookieNotice;
