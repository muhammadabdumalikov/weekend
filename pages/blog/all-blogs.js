import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Seo from "../../components/common/Seo";
import DefaultHeader from "../../components/header/default-header";
import DefaultFooter from "../../components/footer/default";
import CallToActions from "../../components/common/CallToActions";
import Image from "next/image";
import Link from "next/link";

const AllBlogs = () => {
  const { t } = useTranslation("common");

  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12); // Increased to 12 for 4 items per row (3 rows)
  const [total, setTotal] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  // const [authorFilter, setAuthorFilter] = useState("");
  // const [tagFilter, setTagFilter] = useState("");
  // const [sortBy, setSortBy] = useState("newest");

  // Available tags (you can fetch this from API)
  // const availableTags = ["Travel", "Adventure", "Culture", "Food", "Tips", "Destinations"];
  // const availableAuthors = ["Admin", "Travel Expert", "Local Guide"];

  const fetchBlogs = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const offset = (pageNum - 1) * limit;

      const response = await fetch("https://api.wetrippo.com/api/blog/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offset: offset,
          limit: limit,
          search: searchQuery || null,
          // author: authorFilter || null,
          // tag: tagFilter || null,
          // sort_by: sortBy,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blogs");
      }

      const data = await response.json();
      const newBlogs = data.blogs || data.data || [];
      const totalCount = data.total || 0;

      if (append) {
        setBlogs(prev => [...prev, ...newBlogs]);
      } else {
        setBlogs(newBlogs);
      }

      setTotal(totalCount);
      setHasMore(newBlogs.length === limit);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchBlogs(1, false);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchBlogs(nextPage, true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs(1, false);
  };

  // const clearFilters = () => {
  //   setSearchQuery("");
  //   setAuthorFilter("");
  //   setTagFilter("");
  //   setSortBy("newest");
  // };

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

  return (
    <>
      <Seo pageTitle={t("blog.allBlogs")} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h1 className="sectionTitle__title">{t("blog.allBlogs")}</h1>
              </div>
            </div>
          </div>
          {/* End .row */}

          {/* Search and Filters */}
          <div className="row y-gap-20 pt-40">
            <div className="col-12">
              <div className="bg-white p-20">
                <form onSubmit={handleSearch} className="row y-gap-20">
                  {/* Search Input */}
                  <div className="col-lg-10 col-md-6">
                    <div className="single-field relative d-flex items-center rounded-8">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("blog.searchBlogs")}
                        className="pl-50 border-light text-dark-1 h-50 rounded-8 w-100"
                      />
                      <button className="absolute d-flex items-center h-full">
                        <i className="icon-search text-20 px-15 text-dark-1"></i>
                      </button>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className="col-lg-2 col-md-6">
                    <button
                      type="submit"
                      className="button -md -dark-1 bg-blue-1 text-white w-100 h-50 rounded-8"
                    >
                      {t("common.search")}
                    </button>
                  </div>
                </form>

                {/* Clear Filters */}
                {/* {(searchQuery || authorFilter || tagFilter || sortBy !== "newest") && (
                  <div className="row pt-20">
                    <div className="col-12">
                      <button
                        onClick={clearFilters}
                        className="button -md -outline-blue-1 text-blue-1"
                      >
                        {t("common.clearFilters")}
                      </button>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
          {/* End Search and Filters */}

          {/* Results Count */}
          <div className="row pt-20">
            <div className="col-12">
              <div className="text-14 text-light-1">
                {t("blog.showing")} {blogs.length} {t("blog.of")} {total} {t("blog.blogs")}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="row pt-40">
              <div className="col-12">
                <div className="text-center py-40">
                  <div className="text-20 text-light-1 fw-500">{t("common.loading")}</div>
                </div>
              </div>
            </div>
          ) : blogs.length === 0 ? (
            <div className="row pt-40">
              <div className="col-12">
                <div className="text-center py-40">
                  <div className="text-20 text-light-1 fw-500">{t("blog.noBlogsFound")}</div>
                  <div className="text-14 text-light-1 mt-10">{t("blog.tryDifferentFilters")}</div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="activity-grid">
                {blogs.map((blog, index) => (
                  <div
                    key={blog?.id}
                    className="activity-card-item"
                    data-aos="fade"
                    data-aos-delay={index * 100}
                  >
                    <Link
                      href={`/blog/blog-details/${blog.id}`}
                      className="blogCard -type-1 d-block"
                    >
                      <div className="activityCard__image position-relative">
                        <div className="cardImage ratio ratio-1:1">
                          <div className="cardImage__content">
                            <Image
                              width={300}
                              height={200}
                              className="cover w-100 img-fluid"
                              src={blog.files?.[0]?.url || "/img/blog/1.png"}
                              alt={blog.title || "Blog image"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-15">
                        <div className="text-14 text-light-1">{formatDate(blog.created_at)}</div>
                        <h4 className="text-dark-1 text-16 fw-500 mt-5 line-clamp-2">{blog.title}</h4>
                        <p className="text-14 text-light-1 mt-10 line-clamp-3">
                          {truncateText(blog.excerpt || blog.description, 80)}
                        </p>
                        <div className="text-13 text-light-1 mt-10">By {blog.author}</div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              {/* End .row */}

              {/* Load More Button */}
              {hasMore && (
                <div className="d-flex justify-center items-center mt-40">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="load-more-btn"
                    style={{
                      minWidth: '200px',
                      padding: '16px 32px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '500',
                      border: '2px solid #3554d1',
                      backgroundColor: 'white',
                      color: '#3554d1',
                      cursor: isLoadingMore ? 'not-allowed' : 'pointer',
                      opacity: isLoadingMore ? 0.7 : 1,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {isLoadingMore ? (
                      <div className="d-flex items-center justify-center">
                        <div className="spinner mr-10"></div>
                        {t("tours.loadingMore")}
                      </div>
                    ) : (
                      <div className="d-flex items-center justify-center">
                        <i className="icon-arrow-down text-18 mr-10"></i>
                        {t("tours.loadMore")}
                      </div>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* End .container */}
      </section>
      {/* End Blog Grid */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
      {/* End Footer Section */}

      <style jsx>{`
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
        }
        
        .activity-card-item {
          width: 100%;
        }
        
        @media (max-width: 1200px) {
          .activity-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
          }
        }
        
        @media (max-width: 992px) {
          .activity-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .activity-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
        }
        
        @media (max-width: 480px) {
          .activity-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .load-more-btn {
          outline: none;
        }

        .load-more-btn:hover:not(:disabled) {
          background-color: #3554d1 !important;
          color: white !important;
        }

        .load-more-btn:hover:not(:disabled) .spinner {
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
        }

        @media (max-width: 768px) {
          .load-more-btn {
            min-width: 160px !important;
            padding: 12px 24px !important;
            font-size: 14px !important;
          }
        }

        @media (max-width: 480px) {
          .load-more-btn {
            min-width: 140px !important;
            padding: 10px 12px !important;
            font-size: 13px !important;
          }
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(53, 84, 209, 0.3);
          border-top: 2px solid #3554d1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default AllBlogs;
