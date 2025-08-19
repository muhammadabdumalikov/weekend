import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Sidebar = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        {/* Create Tour */}
        <div className="sidebar__item">
          <Link
            href="/vendor-dashboard/create-tour"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500 ${
              isActive("/vendor-dashboard/create-tour") ? "active" : ""
            }`}
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/compass.svg"
              alt="image"
              className="mr-15"
            />
            {t("sidebar.createTour")}
          </Link>
        </div>
        {/* End sidebar__item */}

        {/* My Tours List */}
        <div className="sidebar__item">
          <Link
            href="/vendor-dashboard/my-tours"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500 ${
              isActive("/vendor-dashboard/my-tours") ? "active" : ""
            }`}
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/map.svg"
              alt="image"
              className="mr-15"
            />
            {t("sidebar.myToursList")}
          </Link>
        </div>
        {/* End sidebar__item */}

        {/* Tour (placeholder) */}
        <div className="sidebar__item">
          <Link
            href="/#"
            className={`sidebar__button d-flex items-center text-15 lh-1 fw-500 ${
              isActive("/#") ? "active" : ""
            }`}
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            {t("sidebar.tour")}
          </Link>
        </div>
        {/* End sidebar__item */}

        {/* Logout */}
        <div className="sidebar__item">
          <Link
            href="/others-pages/login"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <Image
              width={20}
              height={20}
              src="/img/dashboard/sidebar/log-out.svg"
              alt="image"
              className="mr-15"
            />
            {t("sidebar.logout")}
          </Link>
        </div>
        {/* End sidebar__item */}
      </div>
    </>
  );
};

export default Sidebar;
