import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const SettingsTabs = () => {
  const { t, i18n } = useTranslation("common");
  
  // Debug logging
  console.log('Current language:', i18n.language);
  console.log('Current locale:', i18n.language);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would implement the API call to save the blog
      console.log("Saving blog data:", formData);
      // await saveBlog(formData);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handlePublish = async () => {
    try {
      // Here you would implement the API call to publish the blog
      console.log("Publishing blog:", formData);
      // await publishBlog(formData);
    } catch (error) {
      console.error("Error publishing blog:", error);
    }
  };

  return (
    <div className="row y-gap-30">
      <div className="col-12">
        <div className="dashboard-content">
          {/* Blog Form */}
          <div className="row y-gap-20">
            {/* Title Section */}
            <div className="col-12">
              <h4 className="text-18 fw-500 mb-20">{t("blog.blogTitle")}</h4>
              <div className="form-input bg-white">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={t("blog.titlePlaceholder")}
                  required
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="col-12">
              <h4 className="text-18 fw-500 mb-20">{t("blog.blogDescription")}</h4>
              <div className="form-input bg-white">
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={12}
                  placeholder={t("blog.descriptionPlaceholder")}
                  required
                />
              </div>
            </div>

            {/* Author Section */}
            <div className="col-12">
              <h4 className="text-18 fw-500 mb-20">{t("blog.blogDetails")}</h4>
              <div className="row y-gap-20">
                <div className="col-md-6">
                  <div className="form-input bg-white">
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      placeholder={t("blog.authorPlaceholder")}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-end x-gap-20 pt-30 border-top-light">
            {/* <button
              onClick={handleSave}
              className="button -md -outline-blue-1 text-blue-1 mr-10"
            >
              <i className="icon-save text-16 mr-10" />
              {t("blog.saveDraft")}
            </button> */}
            <button
              onClick={handlePublish}
              className="button -md -dark-1 bg-blue-1 text-white"
            >
              <i className="icon-publish text-16 mr-10" />
              {t("blog.publish")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
