import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { Gallery, Item } from "react-photoswipe-gallery";
import "../../styles/tailwind.scss";

const SlideGallery = () => {
  const sliderImg = [
    "/img/activities/10.png",
    "/img/activities/11.png",
    "/img/activities/12.png",
    "/img/activities/13.png",
    "/img/activities/11.png",
  ];

  return (
    <>
      <div className="relative">
        <Swiper
          loop={true}
          spaceBetween={10}
          modules={[Navigation]}
          className="overflow-visible"
          navigation={{
            nextEl: ".js-activity-next-active",
            prevEl: ".js-activity-prev-active",
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
              <div className="relative w-full" style={{ paddingBottom: '70.31%' }}>
                <img src={img} alt="image" className="rounded-lg absolute inset-0 w-full h-full object-cover" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <Gallery>
          {sliderImg?.map((slide, i) => (
            <div
              className="absolute px-10 py-10 w-full flex justify-end items-end z-10 bottom-0 right-0"
              key={i}
            >
              <Item width={451} height={450} original={slide} thumbnail={slide}>
                {({ ref, open }) => (
                  <div
                    className="bg-white text-gray-900 px-6 py-4 rounded cursor-pointer hover:bg-blue-50 transition-colors duration-300"
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
        </Gallery>

        <button className="absolute top-1/2 -translate-y-1/2 left-[-20px] z-10 flex items-center justify-center bg-white text-blue-600 shadow-lg w-10 h-10 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300 sm:hidden js-activity-prev-active">
          <i className="icon icon-chevron-left text-xs" />
        </button>
        <button className="absolute top-1/2 -translate-y-1/2 right-[-20px] z-10 flex items-center justify-center bg-white text-blue-600 shadow-lg w-10 h-10 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-300 sm:hidden js-activity-next-active">
          <i className="icon icon-chevron-right text-xs" />
        </button>
      </div>
    </>
  );
};

export default SlideGallery;
