import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
// import { Gallery, Item } from "react-photoswipe-gallery";
import { useSelector } from "react-redux";
import { useState } from "react";
// import "../../styles/tailwind.scss";

const SlideGallery = () => {
  const sliderImg = useSelector((state) => state.gallery.images);
  // const sliderImg = data;
  if (!sliderImg || sliderImg.length === 0) return <p>No images found.</p>;

  // Check if device is mobile
  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  return (
    <>
      <div className="relative">
        <Swiper
          loop={true}
          spaceBetween={10}
          modules={[Navigation, Pagination]}
          className="overflow-visible"
          navigation={{
            nextEl: ".js-activity-next-active",
            prevEl: ".js-activity-prev-active",
          }}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            540: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 22,
            },
            1024: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 2,
            },
          }}
        >
          {sliderImg.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="relative w-full"
                style={{ paddingBottom: "100%" }}
              >
                <img
                  src={img?.url}
                  alt="image"
                  className="rounded-lg absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* <Gallery>
          {sliderImg?.map((slide, i) => (
            <div
              className="absolute px-10 py-10 col-12  d-flex justify-end items-end z-2 bottom-0 end-0"
              key={i}
            >
              <Item
                width={451}
                height={450}
                original={slide?.url}
                thumbnail={slide?.url}
              >
                {({ ref, open }) => (
                  <div
                    className="button -blue-1 px-24 py-15 bg-white text-dark-1 js-gallery"
                    ref={ref}
                    onClick={open}
                    role="button"
                  >
                    See All Photos
                  </div>
                )}
              </Item>
            </div>
          ))}
        </Gallery> */}

        {/* Navigation Buttons - Visible on mobile with smaller size */}
        <button className="section-slider-nav -prev flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full js-activity-prev-active"
          style={{
            position: 'absolute',
            left: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: isMobile() ? '32px' : '40px',
            height: isMobile() ? '32px' : '40px',
            opacity: isMobile() ? '0.8' : '1'
          }}>
          <i className="icon icon-chevron-left text-12" />
        </button>
        <button className="section-slider-nav -next flex-center button -blue-1 bg-white shadow-1 size-40 rounded-full js-activity-next-active"
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
            width: isMobile() ? '32px' : '40px',
            height: isMobile() ? '32px' : '40px',
            opacity: isMobile() ? '0.8' : '1'
          }}>
          <i className="icon icon-chevron-right text-12" />
        </button>

        {/* End prev nav button wrapper */}
      </div>
      {/* slider relative */}
    </>
  );
};

export default SlideGallery;
