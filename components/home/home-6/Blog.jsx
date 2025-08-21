import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";

const Blog = () => {
  const { t } = useTranslation("common");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("https://api.wetrippo.com/api/blog/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        setBlogs(data.blogs || data.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError(t("common.error"));
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [t]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="col-12">
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-12">
        <div className="text-center py-40">
          <div className="text-20 text-red-1 fw-500 mb-10">{t("common.error")}</div>
          <div className="text-14 text-light-1">{error}</div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="col-12">
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500">{t("blog.noBlogsFound")}</div>
        </div>
      </div>
    );
  }

  // Show only the first 2 blogs
  const displayBlogs = blogs.slice(0, 2);

  return (
    <>
      {displayBlogs.map((blog, index) => (
        <div
          className="col-lg-6"
          key={blog.id}
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <Link
            href={`/blog/blog-details/${blog.id}`}
            className="row y-gap-20 items-center"
          >
            <div className="col-auto">
              <Image
                width={250}
                height={250}
                className="size-250 rounded-4"
                src="/img/blog/2.png"
                alt={blog.title || "Blog image"}
              />
            </div>
            <div className="col">
              <div className="text-15 text-light-1">{formatDate(blog.created_at)}</div>
              <h4 className="text-22 fw-600 text-dark-1 mt-10">{blog.title}</h4>
              <p className="mt-10">{truncateText(blog.description)}</p>
              <div className="text-14 text-light-1 mt-10">By {blog.author}</div>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

export default Blog;
