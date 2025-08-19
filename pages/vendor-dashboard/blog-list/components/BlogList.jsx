import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import BlogCard from "./BlogCard";
import LoadingSpinner from "./LoadingSpinner";

const BlogList = () => {
  const { t } = useTranslation("common");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0);

  const fetchBlogs = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page: page,
        limit: 10
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await fetch(`https://api.wetrippo.com/api/admin/blog/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch blogs');
      }

      const data = await response.json();
      
      setBlogs(data.blogs || data.data || []);
      setTotalPages(data.totalPages || Math.ceil((data.total || 0) / 10));
      setTotalBlogs(data.total || 0);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message || t("blog.fetchError"));
          } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchBlogs(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs(1, searchTerm);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm(t("blog.confirmDelete"))) {
      return;
    }

    try {
      const response = await fetch(`https://api.wetrippo.com/api/admin/blog/delete/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete blog');
      }

      // Refresh the blog list
      fetchBlogs(currentPage, searchTerm);
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError(error.message || t("blog.deleteError"));
    }
  };

  if (loading && blogs.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && blogs.length === 0) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-red-1 fw-500 mb-10">{t("blog.errorLoading")}</div>
        <div className="text-14 text-light-1 mb-20">{error}</div>
        <button onClick={() => fetchBlogs(currentPage, searchTerm)} className="button -md -dark-1 bg-blue-1 text-white">
          {t("blog.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="row y-gap-20 mb-30">
        <div className="col-lg-8">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder={t("blog.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control border-light-1 rounded-4"
            />
            <button type="submit" className="button -md -dark-1 bg-blue-1 text-white">
              <i className="icon-search text-16" />
            </button>
          </form>
        </div>
        <div className="col-lg-4">
          <div className="d-flex justify-end">
            <Link href="/vendor-dashboard/create-blog" className="button -md -dark-1 bg-blue-1 text-white">
              <i className="icon-plus text-16 mr-10" />
              {t("blog.createNewBlog")}
            </Link>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {blogs.length > 0 && (
        <div className="d-flex justify-between items-center mb-20">
          <div className="text-14 text-light-1">
            {t("blog.showingBlogs", { count: blogs.length, total: totalBlogs })}
          </div>
        </div>
      )}

      {/* Blog List */}
      {blogs.length === 0 ? (
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500 mb-10">{t("blog.noBlogsFound")}</div>
          <div className="text-14 text-light-1">
            {searchTerm ? t("blog.adjustSearchCriteria") : t("blog.noBlogsCreated")}
          </div>
          {searchTerm && (
            <button onClick={() => { setSearchTerm(""); fetchBlogs(1, ""); }} className="button -md -outline-blue-1 mt-15">
              {t("blog.clearSearch")}
            </button>
          )}
        </div>
      ) : (
        <div className="row y-gap-20">
          {blogs.map((blog) => (
            <div key={blog.id} className="col-12">
              <BlogCard blog={blog} onDelete={handleDeleteBlog} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-center mt-30">
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination__item ${currentPage === page ? 'active' : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogList;
