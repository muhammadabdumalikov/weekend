// import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LanguageMegaMenu = ({ textClass }) => {
  const [click, setClick] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  
  const handleCurrency = () => setClick((prevState) => !prevState);

  const languageContent = useMemo(() => [
    { id: 1, language: t("languages.english"), country: "United States", code: "en" },
    { id: 2, language: t("languages.russian"), country: "Russia", code: "ru" },
    { id: 3, language: t("languages.uzbek"), country: "Uzbekistan", code: "uz" },
  ], [t]);

  const [selectedLanguage, setSelectedLanguage] = useState(
    languageContent.find(lang => lang.code === router.locale) || languageContent[0]
  );

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
    
    // Change the language
    const { pathname, asPath, query } = router;
    console.log('Changing language to:', item.code);
    router.push({ pathname, query }, asPath, { locale: item.code });
  };

  return (
    <>
      {/* Start language currency Selector */}
      <div className="col-auto">
        <button
          className={`d-flex items-center text-14 ${textClass}`}
          onClick={handleCurrency}
        >
          <span className="js-language-mainTitle">
            {selectedLanguage.language}
          </span>
          <i className="icon-chevron-sm-down text-7 ml-15" />
        </button>
      </div>
      {/* End language currency Selector */}

      <div className={`langMenu js-langMenu ${click ? "" : "is-hidden"}`}>
        <div className="currencyMenu__bg" onClick={handleCurrency}></div>
        <div className="langMenu__content bg-white rounded-4">
          <div className="d-flex items-center justify-between px-30 py-20 sm:px-15 border-bottom-light">
            <div className="text-20 fw-500 lh-15">Select your language</div>
            {/* End title */}
            <button className="pointer" onClick={handleCurrency}>
              <i className="icon-close" />
            </button>
            {/* End colse button */}
          </div>
          {/* Emd flex-wrapper */}
          <ul className="modalGrid px-30 py-30 sm:px-15 sm:py-15">
            {languageContent.map((item) => (
              <li
                className={`modalGrid__item js-item ${
                  selectedLanguage.code === item.code ? "active" : ""
                }`}
                key={item.id}
                onClick={() => handleItemClick(item)}
              >
                <div className="py-10 px-15 sm:px-5 sm:py-5">
                  <div className="text-15 lh-15 fw-500 text-dark-1">
                    {item.language}
                  </div>
                  <div className="text-14 lh-15 mt-5 js-title">
                    {item.country}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {/* End langMenu */}
      </div>
    </>
  );
};

export default LanguageMegaMenu;
