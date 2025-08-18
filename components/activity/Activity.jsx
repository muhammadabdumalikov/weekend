import Image from "next/image";
import Link from "next/link";
import isTextMatched from "../../utils/isTextMatched";
import { useEffect, useState } from "react";
import { TourType } from "../../pages/vendor-dashboard/import-instagram/components/ImportInstagramForm";

const Activity = () => {
  const [activityData, setActivityData] = useState({data: [], total: 0});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);

  // Filter states
  const [priceValue, setPriceValue] = useState("Price");
  const [priceRange, setPriceRange] = useState({from_price: null, to_price: null});
  const [languageValue, setLanguageValue] = useState("Language");
  const [tourTypeValue, setTourTypeValue] = useState("Tour type");

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
        },
        body: JSON.stringify({
          offset: offset,
          limit: limit,
          from_price: priceRange.from_price,
          to_price: priceRange.to_price,
          tour_type: tourTypeValue === "Tour type" ? null : tourTypeValue,
        }),
      });
      const data = await response.json();
 
      const newData = data.data || [];

      if (append) {
        setActivityData(prev => ({...prev, data: [...prev.data, ...newData], total: data.total}));
      } else {
        setActivityData({data: newData, total: data.total});
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
  }, [priceRange, tourTypeValue]); // Refetch when price range changes

  if (isLoading) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-light-1 fw-500">Loading activities...</div>
      </div>
    );
  }

  if (!activityData || activityData.length === 0) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-light-1 fw-500">No activities available</div>
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
    
    switch (value) {
      case "Less than 500":
        setPriceRange({from_price: 0, to_price: 500});
        break;
      case "500 - 1000":
        setPriceRange({from_price: 500, to_price: 1000});
        break;
      case "1000 - 2000":
        setPriceRange({from_price: 1000, to_price: 2000});
        break;
      case "2000+":
        setPriceRange({from_price: 2000, to_price: null});
        break;
      default:
        setPriceRange({from_price: null, to_price: null});
    }
  };

  const handleLanguageValueChange = (value) => {
    setLanguageValue(value);
  };

  const handleTourTypeValueChange = (value) => {
    setTourTypeValue(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceValue("Price");
    setPriceRange({from_price: null, to_price: null});
    setLanguageValue("Language");
    setTourTypeValue("Tour type");
  };

  const dropdowns = [
    {
      title: "Price",
      value: priceValue,
      options: ["Less than 500", "500 - 1000", "1000 - 2000", "2000+"],
      onChange: handlePriceValueChange,
    },
    {
      title: "Language",
      value: languageValue,
      options: ["English", "Italian", "Deutsch", "Turkish"],
      onChange: handleLanguageValueChange,
    },
    {
      title: "Tour type",
      value: tourTypeValue,
      options: Object.values(TourType),
      onChange: handleTourTypeValueChange,
    },
  ];

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
                            className={`${
                              item === dropdown.value ? "text-blue-1 " : ""
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
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count and Sort */}
      <div className="row y-gap-10 justify-between items-center mb-30">
        <div className="col-auto">
          <div className="text-18">
            <span className="fw-500">{activityData.total} activities</span> available
          </div>
        </div>
        {/* End .col */}
        <div className="col-auto">
          <button className="button -blue-1 h-40 px-20 rounded-100 bg-blue-1-05 text-15 text-blue-1">
            <i className="icon-up-down text-14 mr-10" />
            Sort
          </button>
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
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="activityCard__image position-relative">
                <div className="cardImage ratio ratio-1:1">
                  <div className="cardImage__content">
                    <Image
                      width={300}
                      height={300}
                      className="col-12 js-lazy"
                      src={item?.files?.[0]?.url || "/img/placeholder.jpg"}
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
                <div className="text-14 lh-14 text-light-1 mb-5">
                  {item?.duration}
                </div>
                <h4 className="activityCard__title lh-16 fw-500 text-dark-1 text-18">
                  <span>{item?.title}</span>
                </h4>
                <p className="text-light-1 text-14 lh-14 mt-5">
                  {item?.location}
                </p>

                <div className="row justify-between items-center pt-10">
                  <div className="col-auto">
                    <div className="d-flex items-center">
                      <div className="icon-star text-yellow-1 text-10 mr-5" />

                      <div className="text-14 text-light-1">
                        <span className="text-15 text-dark-1 fw-500">
                          {item?.ratings || "0"}
                        </span>{" "}
                        {item?.numberOfReviews || "0"} reviews
                      </div>
                    </div>
                  </div>
                  {/* End .col-auto */}

                  <div className="col-auto">
                    <div className="text-14 text-light-1">
                      From{" "}
                      <span className="text-16 fw-500 text-dark-1">
                        {item.price
                          ? item.price.slice(0, -3)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                          : ""} {item.currency || "USD"}
                      </span>
                    </div>
                  </div>
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
                Loading...
              </div>
            ) : (
              <div className="d-flex items-center justify-center">
                <i className="icon-arrow-down text-18 mr-10"></i>
                Load More Activities
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
