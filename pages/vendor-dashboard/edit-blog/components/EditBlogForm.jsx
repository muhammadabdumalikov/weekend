import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

const EditBlogForm = ({ blog }) => {
    const { t } = useTranslation("common");
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        tags: []
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageError, setImageError] = useState("");
    const [originalImage, setOriginalImage] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load blog data when component mounts or blog prop changes
    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || "",
                content: blog.content || "",
                author: blog.author || "",
                tags: blog.tags || []
            });
            
            // Set original image if blog has one
            if (blog.files && blog.files.length > 0) {
                setOriginalImage(blog.files[0]);
                setImagePreview(blog.files[0].url);
            }
        }
    }, [blog]);

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image', 'blockquote'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'color', 'background', 'align',
        'link', 'image', 'blockquote'
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!formData.tags.includes(newTag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, newTag]
                }));
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
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

    const handleUpdate = async () => {
        // Validate form data
        if (!formData.title.trim()) {
            setError(t("blog.titleRequired"));
            return;
        }
        if (!formData.content.trim()) {
            setError(t("blog.contentRequired"));
            return;
        }
        if (!formData.author.trim()) {
            setError(t("blog.authorRequired"));
            return;
        }
        if (!selectedImage && !originalImage) {
            setError(t("blog.imageRequired"));
            return;
        }

        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            // Prepare the update payload
            const updatePayload = {
                id: blog.id,
                title: formData.title.trim(),
                content: formData.content.trim(),
                author: formData.author.trim(),
                tags: formData.tags
            };

            // Only include files if a new image was selected
            if (selectedImage) {
                const uploadedImage = await uploadImage(selectedImage);
                updatePayload.files = [uploadedImage];
            }

            const response = await fetch(`https://api.wetrippo.com/api/admin/blog/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify(updatePayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update blog');
            }

            const result = await response.json();
            setSuccess(t("blog.blogUpdatedSuccess"));

            console.log("Blog updated successfully:", result);
            
            // Redirect to blog list after successful update
            setTimeout(() => {
                router.push('/vendor-dashboard/blog-list');
            }, 2000);

        } catch (error) {
            console.error("Error updating blog:", error);
            setError(error.message || t("blog.blogUpdateError"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/vendor-dashboard/blog-list');
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
                        <div className="col-8">
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

                        {/* Rich Content Editor */}
                        <div className="col-8 mb-20">
                            <h4 className="text-18 fw-500 mb-20">{t("blog.blogContent")}</h4>
                            <div className="bg-white rounded-4 border-type-1">
                                <ReactQuill
                                    value={formData.content}
                                    onChange={(value) => handleInputChange("content", value)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder={t("blog.contentPlaceholder")}
                                />
                            </div>
                        </div>

                        {/* Tags Section */}
                        <div className="col-8">
                            <h4 className="text-18 fw-500 mb-20">{t("blog.blogTags")}</h4>
                            <div className="form-input bg-white">
                                <input
                                    type="text"
                                    onKeyPress={handleTagInput}
                                    placeholder={t("blog.tagsPlaceholder")}
                                />
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="d-flex flex-wrap x-gap-10 y-gap-10 mt-10">
                                    {formData.tags.map((tag, index) => (
                                        <div key={index} className="button -sm -outline-blue-1 text-blue-1">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="ml-5 text-red-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Author Section */}
                        <div className="col-8">
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
                        <div className="col-8">
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
                                                className="button -md -outline-red-1 text-red-1 mt-10"
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
                        <button
                            onClick={handleCancel}
                            className="button -md -outline-blue-1 text-blue-1 mr-10"
                        >
                            {t("blog.cancel")}
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isLoading}
                            className="button -md -dark-1 bg-blue-1 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <i className="icon-spinner text-16 mr-10" />
                                    {t("blog.updating")}
                                </>
                            ) : (
                                <>
                                    <i className="icon-save text-16 mr-10" />
                                    {t("blog.update")}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBlogForm;
