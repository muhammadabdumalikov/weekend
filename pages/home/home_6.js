import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import Seo from "../../components/common/Seo";
import PopularDestinations from "../../components/destinations/PopularDestinations";
import Footer5 from "../../components/footer/footer-5";
import Hero6 from "../../components/hero/hero-6";
import BlockGuide from "../../components/home/home-6/BlockGuide";
import AddBanner from "../../components/home/home-6/AddBanner";
import TourCategories from "../../components/home/home-6/TourCategories";
import Activity from "../../components/activity/Activity";
import Blog from "../../components/home/home-6/Blog";
import AppBanner from "../../components/home/home-6/AppBanner";
import Testimonials from "../../components/home/home-6/Testimonials";
import Activity2 from "../../components/activity/Activity2";
import Tour from "../../components/home/home-6/Tour";
import DefaultHeader from "../../components/header/default-header/index2";

const home_6 = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Seo pageTitle={t("navigation.home")} />
      {/* End Page Title */}

      <DefaultHeader />
      {/* End Header 6 */}

      <Hero6 key={i18n.language} />
      {/* End Hero 6 */}

      {/* <section className="layout-pt-md layout-pb-md bg-light-2"> */}
      {/* <div className="container"> */}
      {/* <div className="row y-gap-30"> */}
      {/* <BlockGuide /> */}
      {/* </div> */}
      {/* End .row */}
      {/* </div> */}
      {/* End .container */}
      {/* </section> */}
      {/* End Block Guide */}

      {/* <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Special Offers</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  These popular destinations have a lot to offer
                </p>
              </div>
            </div>
          </div> */}
      {/* End .row */}
      {/* <div className="row y-gap-20 pt-40">
            <AddBanner />
          </div> */}
      {/* End .row */}
      {/* </div> */}
      {/* End container */}
      {/* </section> */}
      {/* End Special Offer Section */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center is-in-view">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("tours.title")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("tours.subtitle")}
                </p>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <div className="col-12">
              <Activity key={i18n.language} />
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Trending Activity Sections */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">
                  {t("tours.adventure")} &amp; {t("navigation.activities")}
                </h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("tours.subtitle")}
                </p>
              </div>
            </div>
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <TourCategories />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Adventure and activity */}

      {/* <section className="layout-pt-lg layout-pb-md" data-aos="fade-up">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("tours.title")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("tours.subtitle")}
                </p>
              </div>
            </div> */}
            {/* End col-auto */}
{/* 
            <div className="col-auto md:d-none">
              <a
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                {t("tours.viewAll")}
                <div className="icon-arrow-top-right ml-15" />
              </a>
            </div> */}
            {/* End col-auto */}
          {/* </div> */}
          {/* End .row */}

          {/* <div className="relative pt-40 sm:pt-20 item_gap-x30">
            <div className="col-12">
              <PopularDestinations />
            </div>
          </div>
        </div> */}
        {/* End .container */}
      {/* </section> */}
      {/* End Popular Destinations */}

      <section className="section-bg layout-pt-lg layout-pb-lg bg-light-2">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("common.reviews")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("hero.subtitle")}
                </p>
              </div>
            </div>
          </div>
      {/* End .row */}

      <div className="row justify-center pt-50 md:pt-30">
            <div className="col-xl-7 col-lg-10">
              <div className="overflow-hidden">
                <Testimonials />
              </div>
            </div>
      {/* End .col */}
      </div>
      {/* End .row */}
      </div>
      {/* End .container */}
      </section>
      {/* End Testimonials Section */}

      <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row justify-center text-center is-in-view">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{t("tours.title")}</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  {t("tours.subtitle")}
                </p>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Activity2 />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* Trending Activity Sections */}

      {/* <AppBanner /> */}
      {/* End DownloadAppBanner section */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row y-gap-30 pt-40">
            <Blog />
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End blog sections */}

      <Footer5 />
      {/* End Footer Section */}
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

export default home_6;
