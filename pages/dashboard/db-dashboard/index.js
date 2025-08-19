import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Seo from "../../../components/common/Seo";
import DashboardCard from "./components/DashboardCard";
import Sidebar from "../../vendor-dashboard/common/Sidebar";
import Header from "../../../components/header/dashboard-header";
import ChartSelect from "./components/ChartSelect";
import ChartMain from "./components/ChartMain";
import Link from "next/link";
import RercentBooking from "./components/RercentBooking";
import Footer from "../common/Footer";

const index = () => {
  const { t, i18n } = useTranslation("common");
  
  return (
    <>
      <Seo pageTitle={t("dashboard.title")} />
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header key={i18n.language} />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar key={i18n.language} />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">{t("dashboard.title")}</h1>
                <div className="text-15 text-light-1">
                  {t("dashboard.subtitle")}
                </div>
              </div>
              {/* End .col-12 */}
            </div>
            {/* End .row */}

            <DashboardCard key={i18n.language} />

            <div className="row y-gap-30 pt-20 chart_responsive">
              <div className="col-xl-7 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">{t("dashboard.earningStatistics")}</h2>
                    <ChartSelect key={i18n.language} />
                  </div>
                  {/* End .d-flex */}

                  <div className="pt-30">
                    <ChartMain />
                  </div>
                </div>
              </div>
              {/* End .col */}

              <div className="col-xl-5 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">{t("dashboard.recentBookings")}</h2>
                    <div>
                      <Link
                        href="#"
                        className="text-14 text-blue-1 fw-500 underline"
                      >
                        {t("dashboard.viewAll")}
                      </Link>
                    </div>
                  </div>
                  {/* End d-flex */}

                  <RercentBooking key={i18n.language} />
                </div>
                {/* End py-30 */}
              </div>
              {/* End .col */}
            </div>
            {/* End .row */}

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
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

export default index;
