import React from "react";
import { useTranslation } from "next-i18next";

const LoadingSpinner = () => {
  const { t } = useTranslation("common");
  return (
    <div className="text-center py-40">
      <div className="spinner-border text-blue-1" role="status">
        <span className="visually-hidden">{t("common.loading")}</span>
      </div>
      <div className="text-16 text-light-1 mt-10">{t("blog.loadingBlogs")}</div>
    </div>
  );
};

export default LoadingSpinner; 