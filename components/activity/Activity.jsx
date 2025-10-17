import Image from "next/image";
import Link from "next/link";
import isTextMatched from "../../utils/isTextMatched";
import { useEffect, useState } from "react";
import { TourType } from "../../pages/vendor-dashboard/import-instagram/components/ImportInstagramForm";
import { useTranslation } from "next-i18next";

const Activity = () => {
  const { t, i18n } = useTranslation("common");

  const [activityData, setActivityData] = useState({ data: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  // Tour Order Types enum
  const TourOrderTypes = {
    popular: 'popular',
    newest: 'newest',
    price_low_to_high: 'price_low_to_high',
    price_high_to_low: 'price_high_to_low',
  };

  // Filter states - initialize with translated values
  const [priceValue, setPriceValue] = useState(t("common.price"));
  const [priceRange, setPriceRange] = useState({ from_price: null, to_price: null });
  const [languageValue, setLanguageValue] = useState(t("common.language"));
  const [tourTypeValue, setTourTypeValue] = useState(t("tours.tourType"));

  // Sort state
  const [sortValue, setSortValue] = useState(TourOrderTypes.newest);

  // Re-initialize filter values when language changes
  useEffect(() => {
    setPriceValue(t("common.price"));
    setLanguageValue(t("common.language"));
    setTourTypeValue(t("tours.tourType"));
  }, [i18n.language, t]);

  const fetchData = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      const offset = (pageNum - 1) * limit;

      const response = await fetch("https://api.wetrippo.com/api/tour/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-lang": i18n.language || "ru",
        },
        body: JSON.stringify({
          offset: offset,
          limit: limit,
          from_price: priceRange.from_price,
          to_price: priceRange.to_price,
          tour_type: tourTypeValue === t("tours.tourType") ? null : tourTypeValue,
          order_by: sortValue === t("common.sort") ? null : sortValue,
        }),
      });
      const data = await response.json();

      const newData = data.data || [];

      if (append) {
        setActivityData(prev => ({ ...prev, data: [...prev.data, ...newData], total: data.total }));
      } else {
        setActivityData({ data: newData, total: data.total });
      }

      // Check if there are more items to load
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData(1, false);
  }, [priceRange, tourTypeValue, sortValue, i18n.language]); // Added i18n.language dependency

  if (isLoading) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-light-1 fw-500">{t("tours.loadingMore")}</div>
      </div>
    );
  }

  if (!activityData || activityData.length === 0) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-light-1 fw-500">{t("tours.noToursAvailable")}</div>
      </div>
    );
  }

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage, true);
  };

  // Filter handlers
  const handlePriceValueChange = (value) => {
    setPriceValue(value);
    setPage(1); // Reset to first page when filter changes
    setActivityData({ data: [], total: 0 }); // Clear existing data

    switch (value) {
      case t("tours.lessThan500"):
        setPriceRange({ from_price: 0, to_price: 500 });
        break;
      case t("tours.500to1000"):
        setPriceRange({ from_price: 500, to_price: 1000 });
        break;
      case t("tours.1000to2000"):
        setPriceRange({ from_price: 1000, to_price: 2000 });
        break;
      case t("tours.2000plus"):
        setPriceRange({ from_price: 2000, to_price: null });
        break;
      default:
        setPriceRange({ from_price: null, to_price: null });
    }
  };

  const handleLanguageValueChange = (value) => {
    setLanguageValue(value);
  };

  const handleTourTypeValueChange = (value) => {
    setTourTypeValue(value);
    setPage(1); // Reset to first page when filter changes
    setActivityData({ data: [], total: 0 }); // Clear existing data
  };

  // Sort handler
  const handleSortValueChange = (value) => {
    setSortValue(value);
    setPage(1); // Reset to first page when sort changes
    setActivityData({ data: [], total: 0 }); // Clear existing data
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceValue(t("common.price"));
    setPriceRange({ from_price: null, to_price: null });
    setLanguageValue(t("common.language"));
    setTourTypeValue(t("tours.tourType"));
    setSortValue(t("common.sort"));
    setPage(1); // Reset to first page when clearing filters
    setActivityData({ data: [], total: 0 }); // Clear existing data
  };

  // Re-create dropdowns with current translations
  const dropdowns = [
    {
      title: t("common.price"),
      value: priceValue,
      options: [t("tours.lessThan500"), t("tours.500to1000"), t("tours.1000to2000"), t("tours.2000plus")],
      onChange: handlePriceValueChange,
    },
    {
      title: t("common.language"),
      value: languageValue,
      options: [t("languages.english"), t("languages.italian"), t("languages.german"), t("languages.turkish")],
      onChange: handleLanguageValueChange,
    },
    {
      title: t("tours.tourType"),
      value: tourTypeValue,
      options: Object.values(TourType),
      onChange: handleTourTypeValueChange,
    },
  ];

  // Re-create TourOrderTypesNames with current translations
  const currentTourOrderTypesNames = {
    popular: t("tours.mostPopular"),
    newest: t("tours.newestFirst"),
    price_low_to_high: t("tours.priceLowToHigh"),
    price_high_to_low: t("tours.priceHighToLow"),
  };

  return (
    <>
      {/* Filters Section */}
      <div className="row x-gap-10 y-gap-10 mb-30 justify-between items-center">
        <div className="col-auto">
          <div className="row x-gap-10 y-gap-10">
            {dropdowns.map((dropdown, index) => (
              <div className="col-auto" key={index}>
                <div className="dropdown js-dropdown js-amenities-active">
                  <div
                    className="dropdown__button d-flex items-center text-14 rounded-100 border-light px-15 h-34"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false"
                    data-bs-offset="0,10"
                  >
                    <span className="js-dropdown-title">{dropdown.value}</span>
                    <i className="icon icon-chevron-sm-down text-7 ml-10" />
                  </div>
                  {/* End dropdown__button */}

                  <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
                    <div className="text-15 y-gap-15 js-dropdown-list">
                      {dropdown.options.map((item, index) => (
                        <div key={index}>
                          <button
                            className={`${item === dropdown.value ? "text-blue-1 " : ""
                              }d-block js-dropdown-link`}
                            onClick={() => dropdown.onChange(item)}
                          >
                            {item}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* End dropdown-menu */}
                </div>
                {/* End dropdown */}
              </div>
            ))}
          </div>
        </div>

        <div className="col-auto">
          <button
            onClick={clearFilters}
            className="button -outline-blue-1 h-34 px-15 rounded-100 text-14 text-blue-1"
          >
            <i className="icon-refresh text-12 mr-8" />
            {t("common.clearFilters")}
          </button>
        </div>
      </div>

      {/* Results Count and Sort */}
      <div className="row y-gap-10 justify-between items-center mb-30">
        <div className="col-auto">
          <div className="text-18">
            <span className="fw-500">{activityData.total} {t("navigation.tours").toLowerCase()}</span> {t("common.available")}
          </div>
        </div>
        {/* End .col */}
        <div className="col-auto">
          <div className="dropdown js-dropdown js-amenities-active">
            <div
              className="dropdown__button d-flex items-center text-14 rounded-100 border-light px-15 h-40 bg-blue-1-05 text-blue-1"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
              data-bs-offset="0,10"
            >
              <i className="icon-up-down text-14 mr-10" />
              <span className="js-dropdown-title">{currentTourOrderTypesNames[sortValue]}</span>
              <i className="icon icon-chevron-sm-down text-7 ml-10" />
            </div>
            {/* End dropdown__button */}

            <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
              <div className="text-15 y-gap-15 js-dropdown-list">
                {Object.entries(TourOrderTypes).map(([key, value]) => (
                  <div key={key}>
                    <button
                      className={`${value === sortValue ? "text-blue-1 " : ""
                        }d-block js-dropdown-link`}
                      onClick={() => handleSortValueChange(value)}
                    >
                      {currentTourOrderTypesNames[value]}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* End dropdown-menu */}
          </div>
        </div>
        {/* End .col */}
      </div>

      <div className="activity-grid">
        {activityData.data.map((item, index) => (
          <div
            key={item?.id}
            className="activity-card-item"
            data-aos="fade"
            data-aos-delay={index * 100}
          >
            <Link
              href={`/activity/activity-single/${item.id}`}
              className="activityCard -type-1 rounded-4 hover-inside-slider"
            >
              <div className="activityCard__image position-relative">
                <div className="cardImage ratio ratio-1:1">
                  <div className="cardImage__content">
                    <Image
                      width={300}
                      height={300}
                      className="col-12 js-lazy"
                      src={item?.files?.find(file => file.type === "main")?.url || item?.files?.[0]?.url || "/img/placeholder.jpg"}
                      alt={item?.title || "Activity image"}
                      unoptimized
                    />
                  </div>
                </div>

                <div className="cardImage__wishlist">
                  <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                    <i className="icon-heart text-12" />
                  </button>
                </div>

                <div className="cardImage__leftBadge">
                  <div
                    className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${isTextMatched(item?.tag, "likely to sell out*")
                      ? "bg-dark-1 text-white"
                      : ""
                      } ${isTextMatched(item?.tag, "best seller")
                        ? "bg-blue-1 text-white"
                        : ""
                      }  ${isTextMatched(item?.tag, "top rated")
                        ? "bg-yellow-1 text-dark-1"
                        : ""
                      }`}
                  >
                    {item.tag}
                  </div>
                </div>
              </div>
              {/* End .tourCard__image */}

              <div className="activityCard__content mt-10">
                <h4 className="activityCard__title lh-16 fw-500 text-dark-1 text-18">
                  <span>{item?.title}</span>
                </h4>
                {/* <p className="text-light-1 text-14 lh-14 mt-5">
                  {item?.location}
                </p> */}

                <div className="row justify-between items-center pt-10">
                  <div className="col-auto">
                    <div className="d-flex items-center">
                      <div className="icon-star text-yellow-1 text-10 mr-5" />

                      <div className="text-14 text-light-1">
                        <span className="text-15 text-dark-1 fw-500">
                          {item?.ratings || "0"}
                        </span>{" "}
                        {t("common.reviews", { count: item?.numberOfReviews || "0" })}
                      </div>
                    </div>
                  </div>
                  {/* End .col-auto */}

                  <div className="col-auto">
                    <div className="text-14 text-light-1">
                      {/* {t("tours.from")}{" "} */}
                      {item?.sale_price && item?.sale_price !== item?.price ? (
                        <div className="d-flex items-center x-gap-5">
                          <span className="text-16 fw-500 text-dark-1">
                            {item.sale_price
                              ? item.sale_price.slice(0, -3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                              : ""} {item.currency || "USD"}
                          </span>
                          <span className="text-14 text-light-1 line-through">
                            {item.price
                              ? item.price.slice(0, -3)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                              : ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-16 fw-500 text-dark-1">
                          {item.price
                            ? item.price.slice(0, -3)
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                            : ""} {item.currency || "USD"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-14 lh-14 text-light-1 mb-5 d-flex justify-between items-center">
                  <span>{item?.duration || ""}</span>
                  {item?.start_date && (
                    <span>
                      {new Date(item.start_date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }).replace(/\//g, '.')}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

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

      <style jsx>{`
        .activity-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          width: 100%;
          min-height: 400px;
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

export default Activity;
