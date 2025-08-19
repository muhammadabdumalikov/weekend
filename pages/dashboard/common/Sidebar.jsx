import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { isActiveLink } from "../../../utils/linkActiveChecker";

const Sidebar = () => {
  const router = useRouter();
  const { t } = useTranslation("common");

  const sidebarContent = [
    {
      id: 1,
      icon: "/img/dashboard/sidebar/compass.svg",
      name: t("sidebar.createTour"),
      routePath: "/vendor-dashboard/create-tour",
    },
    {
      id: 2,
      icon: "/img/dashboard/sidebar/compass.svg",
      name: t("sidebar.myToursList"),
      routePath: "/vendor-dashboard/my-tours",
    },
    // {
    //   id: 2,
    //   icon: "/img/dashboard/sidebar/booking.svg",
    //   name: t("sidebar.bookingHistory"),
    //   routePath: "/dashboard/db-booking",
    // },
    // {
    //   id: 3,
    //   icon: "/img/dashboard/sidebar/bookmark.svg",
    //   name: t("sidebar.wishlist"),
    //   routePath: "/dashboard/db-wishlist",
    // },
    // {
    //   id: 4,
    //   icon: "/img/dashboard/sidebar/gear.svg",
    //   name: t("sidebar.settings"),
    //   routePath: "/dashboard/db-settings",
    // },
    // {
    //   id: 5,
    //   icon: "/img/dashboard/sidebar/log-out.svg",
    //   name: t("sidebar.logout"),
    //   routePath: "/others-pages/login",
    // },
  ];
  return (
    <div className="sidebar -dashboard">
      {sidebarContent.map((item) => (
        <div className="sidebar__item" key={item.id}>
          <div
            className={`${
              isActiveLink(item.routePath, router.asPath) ? "-is-active" : ""
            } sidebar__button `}
          >
            <Link
              href={item.routePath}
              className="d-flex items-center text-15 lh-1 fw-500"
            >
              <Image
                width={20}
                height={20}
                src={item.icon}
                alt="image"
                className="mr-15"
              />
              {item.name}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
