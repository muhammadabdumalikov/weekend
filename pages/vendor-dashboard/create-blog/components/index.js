import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";

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
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setImageError("");

        if (!file) {
            setImageError(t("blog.imageRequired"));
            return;
        }

        // Validate file type
        if (!["image/png", "image/jpeg", "image/webp"].includes(file.type.toLowerCase())) {
            setImageError(t("blog.invalidImageType"));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setImageError(t("blog.imageSizeLimit"));
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setImageError("");
    };

    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('https://api.wetrippo.com/api/file-router/simple-upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload image');
        }

        const result = await response.json();
        return {
            type: "main",
            url: result.url,
            name: file.name,
            size: file.size
        };
    };

    const handlePublish = async () => {
        // Validate form data
        if (!formData.title.trim()) {
            setError(t("blog.titleRequired"));
            return;
        }
        if (!formData.description.trim()) {
            setError(t("blog.descriptionRequired"));
            return;
        }
        if (!formData.author.trim()) {
            setError(t("blog.authorRequired"));
            return;
        }
        if (!selectedImage) {
            setError(t("blog.imageRequired"));
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // Upload image first
            const uploadedImage = await uploadImage(selectedImage);
            
            const response = await fetch('https://api.wetrippo.com/api/admin/blog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({
                    title: formData.title.trim(),
                    description: formData.description.trim(),
                    author: formData.author.trim(),
                    files: [uploadedImage]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create blog');
            }

            const result = await response.json();
            setSuccess(t("blog.blogCreatedSuccess"));

            // Clear form after successful creation
            setFormData({
                title: "",
                description: "",
                author: ""
            });
            setSelectedImage(null);
            setImagePreview(null);

            console.log("Blog created successfully:", result);
        } catch (error) {
            console.error("Error creating blog:", error);
            setError(error.message || t("blog.blogCreateError"));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="row y-gap-30">
            <div className="col-12">
                <div className="dashboard-content">
                    {/* Error and Success Messages */}
                    {error && (
                        <div className="alert alert-danger mb-20" role="alert">
                            <i className="icon-alert-triangle text-16 mr-10" />
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="alert alert-success mb-20" role="alert">
                            <i className="icon-check text-16 mr-10" />
                            {success}
                        </div>
                    )}

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

                        {/* Image Upload Section */}
                        <div className="col-12">
                            <h4 className="text-18 fw-500 mb-20">{t("blog.blogImage")}</h4>
                            <div className="row y-gap-20">
                                <div className="col-md-6">
                                    {imagePreview ? (
                                        <div className="position-relative">
                                            <div className="d-flex ratio ratio-16:9 w-300">
                                                <Image
                                                    src={imagePreview}
                                                    alt="Blog preview"
                                                    fill
                                                    className="img-ratio rounded-4"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="button -sm -outline-red-1 text-red-1 mt-10"
                                            >
                                                <i className="icon-trash text-16 mr-5" />
                                                {t("blog.removeImage")}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-300">
                                            <label htmlFor="blogImageUpload" className="d-flex ratio ratio-16:9">
                                                <div className="flex-center flex-column text-center bg-blue-2 h-full w-1/1 absolute rounded-4 border-type-1 cursor-pointer">
                                                    <div className="icon-upload-file text-40 text-blue-1 mb-10" />
                                                    <div className="text-blue-1 fw-500">{t("blog.uploadImage")}</div>
                                                </div>
                                            </label>
                                            <input
                                                type="file"
                                                id="blogImageUpload"
                                                accept="image/png, image/jpeg, image/webp"
                                                className="d-none"
                                                onChange={handleImageUpload}
                                                required
                                            />
                                            <div className="text-start mt-10 text-14 text-light-1">
                                                {t("blog.imageRequirements")}
                                            </div>
                                        </div>
                                    )}
                                    {imageError && (
                                        <div className="text-14 text-red-1 mt-10">
                                            {imageError}
                                        </div>
                                    )}
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
                            disabled={isLoading}
                            className="button -md -dark-1 bg-blue-1 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <i className="icon-spinner text-16 mr-10" />
                                    {t("blog.creating")}
                                </>
                            ) : (
                                <>
                                    <i className="icon-publish text-16 mr-10" />
                                    {t("blog.publish")}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsTabs;
