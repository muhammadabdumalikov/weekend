import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination as SwiperPagination } from "swiper";
import { useState, useEffect } from "react";
import { getProxiedImageUrl } from "../../../providers/helpers";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const ActivityProperties = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTours, setTotalTours] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  // Fetch tours from API
  const fetchTours = async (page = 1, append = false) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * limit;
      
      const response = await fetch("https://api.wetrippo.com/api/tour/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: limit,
          offset: offset,
          search: "",
          status: [],
          from_date: null,
          to_date: null,
          location: null,
          from_price: null,
          to_price: null
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tours");
      }

      const data = await response.json();
      const newTours = data.data || [];
      
      if (append) {
        setTours(prev => [...prev, ...newTours]);
      } else {
        setTours(newTours);
      }
      
      setTotalTours(data.total || 0);
      setHasMore(newTours.length === limit);
    } catch (error) {
      console.error("Error fetching tours:", error);
      setError(t("common.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTours(1, false);
  }, [i18n.language]); // Added i18n.language dependency to refetch when language changes

  const loadMore = async () => {
    if (!isLoading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      await fetchTours(nextPage, true);
    }
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before reaching the bottom
        threshold: 0.1
      }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [hasMore, isLoading, currentPage]);

  // Get main image from files array
  const getMainImage = (files) => {
    if (!files || files.length === 0) return "/img/placeholder.jpg";
    
    const mainImage = files.find(file => file.type === "main");
    if (mainImage) return mainImage.url;
    
    // Fallback to first image if no main image
    return files[0]?.url || "/img/placeholder.jpg";
  };

  // Get all images for slider
  const getAllImages = (files) => {
    if (!files || files.length === 0) return ["/img/placeholder.jpg"];
    return files.map(file => file.url);
  };

  if (isLoading) {
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
          <div className="text-14 text-light-1 mb-20">{error}</div>
          <button 
            onClick={fetchTours}
            className="button -md -dark-1 bg-blue-1 text-white"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  if (tours.length === 0) {
    return (
      <div className="col-12">
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500 mb-10">{t("tours.noToursFound")}</div>
          <div className="text-14 text-light-1">{t("tours.noToursAvailable")}</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {tours.map((tour) => (
        <div
          className="col-12"
          key={tour?.id}
          data-aos="fade"
          data-aos-delay={100}
        >
          <div className="border-top-light pt-30">
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-auto">
                <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4">
                  <div className="cardImage__content custom_inside-slider">
                    <Swiper
                      className="mySwiper"
                      modules={[SwiperPagination, Navigation]}
                      pagination={{
                        clickable: true,
                      }}
                      navigation={true}
                    >
                      {getAllImages(tour.files).map((imageUrl, i) => (
                        <SwiperSlide key={i}>
                          <Image
                            width={300}
                            height={300}
                            className="rounded-4 col-12 js-lazy"
                            src={imageUrl}
                            alt={`Tour image ${i + 1}`}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                  {/* End .cardImage__content */}

                  <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                      <i className="icon-heart text-12" />
                    </button>
                  </div>
                  {/* End .cardImage__wishlist */}
                </div>
                {/* End cartImage */}
              </div>
              {/* End .col-auto */}
              <div className="col-md">
                <p className="text-14 lh-14 mb-5">{tour?.duration}</p>
                <h3 className="text-18 lh-16 fw-500">
                  {tour?.title}
                </h3>
                <p className="text-14 lh-14 mt-5">Location ID: {tour?.location}</p>
                <div className="text-14 lh-15 fw-500 mt-20">
                  {tour?.organizer_title}
                </div>
                <div className="text-14 text-green-2 fw-500 lh-15 mt-5">
                  {t("tours.seatsAvailable", { count: tour?.seats })}
                </div>
              </div>
              {/* End .col-md */}

              <div className="col-md-auto text-right md:text-left">
                <div className="d-flex x-gap-5 items-center justify-end md:justify-start">
                  <i className="icon-star text-10 text-yellow-1" />
                  <div className="text-15 fw-500 ml-5">{tour?.rating || "0"}</div>
                  <div className="text-14 text-light-1">
                    {t("common.reviews", { count: tour?.review_count || "0" })}
                  </div>
                </div>
                <div className="text-14 text-light-1 mt-50 md:mt-20">{t("tours.from")}</div>
                <div className="text-22 lh-12 fw-600 mt-5">
                  ${tour?.price}
                </div>
                {tour?.sale_price && (
                  <div className="text-16 text-green-2 fw-500 mt-5">
                    Sale: ${tour.sale_price}
                  </div>
                )}
                <div className="text-14 text-light-1 mt-5">{t("tours.perPerson")}</div>
                <Link
                  href={`/activity/activity-single/${tour.id}`}
                  className="button -md -dark-1 bg-blue-1 text-white mt-24"
                >
                  {t("common.viewDetail")} <div className="icon-arrow-top-right ml-15" />
                </Link>
              </div>
              {/* End .col-md-auto */}
            </div>
            {/* End .row */}
          </div>
                      {/* End border-top */}
          </div>
        ))}
        
        {/* Infinite Scroll Sentinel */}
        {tours.length > 0 && (
          <div className="col-12">
            <div id="scroll-sentinel" className="py-20">
              {isLoading && hasMore && (
                <div className="text-center">
                  <div className="text-16 text-light-1 mb-10">{t("tours.loadingMore")}</div>
                  <div className="d-flex justify-center">
                    <div className="size-20 rounded-full bg-blue-1 animate-spin"></div>
                  </div>
                </div>
              )}
              {!hasMore && tours.length > 0 && (
                <div className="text-center">
                  <div className="text-16 text-light-1">{t("tours.noMoreTours")}</div>
                </div>
              )}
            </div>
          </div>
        )}
    </>
  );
};

export default ActivityProperties;
