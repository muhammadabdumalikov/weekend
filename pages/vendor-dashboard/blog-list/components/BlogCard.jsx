import React from "react";
import { useTranslation } from "next-i18next";

const BlogCard = ({ blog, onDelete }) => {
  const { t } = useTranslation("common");

  const formatDate = (dateString) => {
    if (!dateString) return t("blog.noDate");
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return t("blog.invalidDate");
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return t("blog.noDescription");
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="badge text-14 lh-14 bg-green-1 text-white">{t("blog.published")}</span>
    ) : (
      <span className="badge text-14 lh-14 bg-yellow-1 text-white">{t("blog.draft")}</span>
    );
  };

  return (
    <div className="border-top-light pt-30">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-md">
          <div className="row x-gap-10 items-center mb-10">
            <div className="col-auto">
              {getStatusBadge(blog.status)}
            </div>
            <div className="col-auto">
              <div className="size-3 rounded-full bg-light-1"></div>
            </div>
            <div className="col-auto">
              <p className="text-14 lh-14">{formatDate(blog.created_at)}</p>
            </div>
            <div className="col-auto">
              <div className="size-3 rounded-full bg-light-1"></div>
            </div>
            <div className="col-auto">
              <p className="text-14 lh-14">{blog.author}</p>
            </div>
          </div>

          <h3 className="text-18 lh-16 fw-500 mb-10">{blog.title}</h3>
          <p className="text-14 lh-14 text-light-1 mb-15">
            {truncateText(blog.content)}
          </p>

          <div className="row x-gap-20 y-gap-10">
            <div className="col-auto">
              <div className="text-14 lh-14">
                <strong>{t("blog.id")}:</strong> {blog.id}
              </div>
            </div>
            {blog.updated_at && (
              <div className="col-auto">
                <div className="text-14 lh-14">
                  <strong>{t("blog.lastUpdated")}:</strong> {formatDate(blog.updated_at)}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="col-md-auto text-right md:text-left">
          <div className="d-flex x-gap-10 justify-end md:justify-start">
            <button 
              className="button -md -outline-blue-1 text-blue-1 mr-5" 
              title={t("blog.viewBlogDetails")}
              onClick={() => window.open(`/blog/blog-details/${blog.id}`, '_blank')}
            >
              <i className="icon-eye text-16 mr-5"></i>
              {t("blog.view")}
            </button>
            <button 
              className="button -md -outline-blue-1 text-blue-1 mr-5" 
              title={t("blog.editBlog")}
              onClick={() => window.location.href = `/vendor-dashboard/edit-blog/${blog.id}`}
            >
              <i className="icon-edit text-16 mr-5"></i>
              {t("blog.edit")}
            </button>
            <button 
              className="button -md -outline-red-1 text-red-1" 
              title={t("blog.deleteBlog")}
              onClick={() => onDelete(blog.id)}
            >
              <i className="icon-trash text-16 mr-5"></i>
              {t("blog.delete")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
