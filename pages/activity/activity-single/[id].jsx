import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ModalVideo from "react-modal-video";
import "photoswipe/dist/photoswipe.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
// import activityData from "../../../data/activity";
import Seo from "../../../components/common/Seo";
import DefaultHeader from "../../../components/header/default-header";
import Overview from "../../../components/activity-single/Overview";
import TourSnapShot from "../../../components/activity-single/TourSnapShot";
import TopBreadCrumb from "../../../components/activity-single/TopBreadCrumb";
import SidebarRight from "../../../components/activity-single/SidebarRight";
import ReviewProgress2 from "../../../components/activity-single/guest-reviews/ReviewProgress2";
import DetailsReview2 from "../../../components/activity-single/guest-reviews/DetailsReview2";
import CallToActions from "../../../components/common/CallToActions";
import DefaultFooter from "../../../components/footer/default";
import Tours from "../../../components/tours/Tours";
// import Faq from "../../../components/faq/Faq";
import Link from "next/link";
import ImportantInfo from "../../../components/activity-single/ImportantInfo";
import SlideGallery from "../../../components/activity-single/SlideGallery";
// import MapPropertyFinder from "../../../components/activity-single/MapPropertyFinder";
import TravelItinerary from "../../../components/itinerary/itinerary1";
import { useDispatch } from "react-redux";
import { setImages } from "../../../app/gallerySlice";
import { useI18n } from "../../../utils/useI18n";

const TourSingleV1Dynamic = () => {
  const { t } = useTranslation("common");
  const { getCurrentLanguage } = useI18n(); 
  const language = getCurrentLanguage();
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const [activity, setActivity] = useState({});
  const id = router.query.id;

  // Handle Telegram sharing
  const handleTelegramShare = () => {
    if (!activity || !activity.title) return;
    
    const currentUrl = window.location.href;
    const shareText = `🌟 ${activity.title?.[language]} 🌟\n\n` +
      `📍 ${activity.location || 'Amazing destination'}\n` +
      `💰 From $${activity.price || 'Contact for price'}\n\n` +
      `✨ ${activity.description ? activity?.description?.substring(0, 150) + '...' : 'Discover this amazing experience!'}\n\n` +
      `🔗 Check it out: ${currentUrl}\n\n` +
      `#Travel #Adventure #Experience #inMakon`;
    
    const encodedText = encodeURIComponent(shareText);
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodedText}`;
    
    window.open(telegramUrl, '_blank');
  };

  useEffect(() => {
    if (!id) {
      <h1>Loading...</h1>;
    } else {
      const fetchData = async () => {
        const response = await fetch(
          "https://api.wetrippo.com/api/tour/get-by-id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-lang": language || "ru",
            },
            body: JSON.stringify({ id: id }),
          }
        );
        const data = await response.json();
        dispatch(setImages(data.files.sort((a, b) => a.type === "main" ? -1 : 1)));
        setActivity(data);
      };
      fetchData();
    }

    return () => { };
  }, [id, dispatch, language]);

  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="oqNZOOWF8qM"
        onClose={() => setOpen(false)}
      />

      <Seo pageTitle={t("activities.single")} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <TopBreadCrumb data={activity} />
      {/* End top breadcrumb */}

      <section className="pt-40">
        <div className="container">
          <SlideGallery data={activity?.files} />
        </div>
      </section>
      {/* End gallery grid wrapper */}

      <section className="pt-40 js-pin-container">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <div className="row y-gap-20 justify-between items-end">
                <div className="col-auto">
                  <h1 className="text-26 fw-600">{activity?.title}</h1>
                  <div className="row x-gap-10 y-gap-20 items-center pt-10">
                    <div className="col-auto">
                      <div className="d-flex items-center">
                        <i className="icon-star text-10 text-yellow-1"></i>

                        <div className="text-14 text-light-1 ml-10">
                          <span className="text-15 fw-500 text-dark-1">
                            {activity?.ratings}
                          </span>
                          {t("common.reviews", { count: activity?.numberOffReviews })}
                        </div>
                      </div>
                    </div>
                    {/* End .col */}

                    <div className="col-auto">
                      <div className="row x-gap-10 items-center">
                        <div className="col-auto">
                          <div className="d-flex x-gap-5 items-center">
                            <i className="icon-location-2 text-16 text-light-1"></i>
                            <div className="text-15 text-light-1">
                              {activity?.location}
                            </div>
                          </div>
                        </div>

                        <div className="col-auto">
                          <button className="text-blue-1 text-15 underline">
                            {t("common.showOnMap")}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* End .col */}
                  </div>
                  {/* End .row */}
                </div>
                {/* End .col */}

                <div className="col-auto">
                  <div className="row x-gap-10 y-gap-10">
                    <div className="col-auto">
                      <button 
                        className="button px-15 py-10 -blue-1"
                        onClick={handleTelegramShare}
                        title="Share on Telegram"
                      >
                        <i className="icon-telegram mr-10"></i>
                        {t("common.share")}
                      </button>
                    </div>

                    <div className="col-auto">
                      <button className="button px-15 py-10 -blue-1 bg-light-2">
                        <i className="icon-heart mr-10"></i>
                        {t("common.save")}
                      </button>
                    </div>
                  </div>
                </div>
                {/* End .col */}
              </div>
              {/* End .row */}

              <h3 className="text-22 fw-500 mt-40">{t("tours.snapshot")}</h3>
              <TourSnapShot data={activity} />
              {/* End toursnapshot */}
              <div className="border-top-light mt-40 mb-40"></div>

              <Overview data={activity} language={language} t={t} />
              {/* End  Overview */}

              {/* Tour Details Section */}
              {(activity?.details?.difficulty || activity?.details?.tour_type || activity?.details?.start_location) && (
                <div className="border-top-light mt-40 pt-40 mb-40">
                  <h3 className="text-22 fw-500">{t("tours.details")}</h3>
                  <div className="row y-gap-30 pt-15">
                    {activity?.details?.tour_type && (
                      <div className="col-sm-4">
                        <div className="fw-500">{t("tours.tourType")}</div>
                        <div className="text-15">
                          {activity?.details?.tour_type}
                        </div>
                      </div>
                    )}
                    {activity?.details?.start_location && (
                      <div className="col-sm-4">
                        <div className="fw-500">{t("tours.startLocation")}</div>
                        <div className="text-15">{activity?.details?.start_location}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* End tour details */}
            </div>
            {/* End .col-xl-8 */}

            <div className="col-xl-4">
              <SidebarRight activity={activity} />
            </div>
            {/* End .col-xl-4 */}
          </div>
          {/* End .row */}
        </div>
        {/* End container */}
      </section>
      {/* End single page content */}

      {/* <section className="pt-40">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row x-gap-40 y-gap-40">
              <div className="col-auto">
                <h3 className="text-22 fw-500">{t("tours.itinerary")}</h3>
              </div>
            </div> */}
            {/* End row */}
            {/* <TravelItinerary /> */}
          {/* </div> */}
          {/* End pt-40 */}
        {/* </div> */}
        {/* End .container */}
      {/* </section> */}

      {/* <section className="border-top-light  mt-40 pt-40">
        <div className="container">
          <h3 className="text-22 fw-500 mb-20">Activity&apos;s Location</h3>
          <div className=" rounded-4 overflow-hidden map-500">
            <MapPropertyFinder />
          </div>
        </div>
      </section> */}
      {/* End Itinerary */}

      {/* <section className="mt-40 border-top-light pt-40">
        <div className="container">
          <div className="row y-gap-40 justify-between">
            <div className="col-xl-3">
              <h3 className="text-22 fw-500">{t("reviews.guestReviews")}</h3>
              <ReviewProgress2 /> */}
              {/* End review with progress */}
            {/* </div> */}
            {/* End col-xl-3 */}

            {/* <div className="col-xl-8">
              <DetailsReview2 />
            </div> */}
            {/* End col-xl-8 */}
          {/* </div> */}
          {/* End .row */}
        {/* </div> */}
        {/* End .container */}
        {/* End container */}
      {/* </section> */}
      {/* End Review section */}

      {/* <section className="layout-pt-lg layout-pb-lg mt-50 border-top-light">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("tours.mostPopular")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("tours.mostPopularSubtitle")}
                </p>
              </div>
            </div>

            <div className="col-auto">
              <Link
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                {t("common.more")} <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
          </div>

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours />
          </div>
        </div>
      </section> */}
      {/* End Tours Sections */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />

      {/* Custom styles for badges */}
      <style jsx>{`
        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
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

export default dynamic(() => Promise.resolve(TourSingleV1Dynamic), {
  ssr: false,
});
