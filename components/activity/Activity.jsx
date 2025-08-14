import Image from "next/image";
import Link from "next/link";
import isTextMatched from "../../utils/isTextMatched";
import { useEffect, useState } from "react";

const Activity = () => {
  const [activityData, setActivityData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://api.wetrippo.com/api/tour/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        console.log("Activity data:", data);
        setActivityData(data.data || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <>
      <div className="activity-grid">
        {activityData.slice(0, 12).map((item, index) => (
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
                    className={`py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase ${
                      isTextMatched(item?.tag, "likely to sell out*")
                        ? "bg-dark-1 text-white"
                        : ""
                    } ${
                      isTextMatched(item?.tag, "best seller")
                        ? "bg-blue-1 text-white"
                        : ""
                    }  ${
                      isTextMatched(item?.tag, "top rated")
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
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Activity;
