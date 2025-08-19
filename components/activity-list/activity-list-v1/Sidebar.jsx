import { useTranslation } from "next-i18next";
import ActivityTypes from "../sidebar/ActivityTypes";
import OthersFilter from "../sidebar/OthersFilter";
import Duration from "../sidebar/Duration";
import Languages from "../sidebar/Languages";
import PirceSlider from "../sidebar/PirceSlider";
import PopularAttractions from "../sidebar/PopularAttractions";

const Sidebar = () => {
  const { t } = useTranslation("common");

  return (
    <>
      <div className="sidebar__item -no-border">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.activityTypes")}</h5>
        <div className="sidebar-checkbox">
          <ActivityTypes />
        </div>
        {/* End Sidebar-checkbox */}
      </div>
      {/* End popular filter */}

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.other")}</h5>
        <div className="sidebar-checkbox">
          <OthersFilter />
        </div>
        {/* End Sidebar-checkbox */}
      </div>
      {/* End Aminities filter */}

      <div className="sidebar__item pb-30">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.price")}</h5>
        <div className="row x-gap-10 y-gap-30">
          <div className="col-12">
            <PirceSlider />
          </div>
        </div>
      </div>
      {/* End Nightly priceslider */}

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.duration")}</h5>
        <div className="sidebar-checkbox">
          <Duration />
        </div>
      </div>
      {/* End style filter */}

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.languages")}</h5>
        <div className="sidebar-checkbox">
          <Languages />
        </div>
        {/* End Sidebar-checkbox */}
      </div>
      {/* End Aminities filter */}

      <div className="sidebar__item">
        <h5 className="text-18 fw-500 mb-10">{t("sidebar.popularAttractions")}</h5>
        <div className="sidebar-checkbox">
          <PopularAttractions />
        </div>
        {/* End Sidebar-checkbox */}
      </div>
      {/* End Popular Attractions */}
    </>
  );
};

export default Sidebar;
