import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
// import activityData from "../../data/activity";
import isTextMatched from "../../utils/isTextMatched";
import { useEffect, useState } from "react";

const Activity = () => {
  // get data from http://api.trippo.live/api/tour/list with post method

  const [activityData, setActivityData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://api.trippo.live/api/tour/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log("data", data.data);
      setActivityData(data.data);
    };
    fetchData();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  var itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // custom navigation
  function Arrow(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <>
          <i className="icon icon-chevron-right text-12"></i>
        </>
      ) : (
        <>
          <span className="icon icon-chevron-left text-12"></span>
        </>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  console.log("activityData", activityData);

  return (
    <>
      <Slider {...settings}>
        {activityData.slice(0, 4).map((item) => (
          <div
            key={item?.id}
            data-aos="fade"
            data-aos-delay={item?.delayAnimation}
          >
            <Link
              href={`/activity/activity-single/${item.id}`}
              className="activityCard -type-1 rounded-4 hover-inside-slider"
            >
              <div className="activityCard__image position-relative">
                <div className="inside-slider">
                  <Slider
                    {...itemSettings}
                    arrows={true}
                    nextArrow={<Arrow type="next" />}
                    prevArrow={<Arrow type="prev" />}
                  >
                    <div className="cardImage ratio ratio-1:1">
                      <div className="cardImage__content ">
                        <Image
                          width={300}
                          height={300}
                          className="col-12 js-lazy"
                          src={item?.files[0]?.url}
                          // src={`https://images.pexels.com/photos/2245436/pexels-photo-2245436.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`}
                          alt={"image"}
                        />
                      </div>
                    </div>
                    {/* {item?.files[0].url?.map((slide, i) => (
                      <div className="cardImage ratio ratio-1:1" key={i}>
                        <div className="cardImage__content ">
                          <Image
                            width={300}
                            height={300}
                            className="col-12 js-lazy"
                            src={slide}
                            alt="image"
                          />
                        </div>
                      </div>
                    ))} */}
                  </Slider>

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
              </div>
              {/* End .tourCard__image */}

              <div className="activityCard__content mt-10">
                <div className="text-14 lh-14 text-light-1 mb-5">
                  {item?.duration}+ hours
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
                          {item?.ratings}
                        </span>{" "}
                        {item?.numberOfReviews} reviews
                      </div>
                    </div>
                  </div>
                  {/* End .col-auto */}

                  <div className="col-auto">
                    <div className="text-14 text-light-1">
                      From{" "}
                      <span className="text-16 fw-500 text-dark-1">
                        UZS {item.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Activity;
