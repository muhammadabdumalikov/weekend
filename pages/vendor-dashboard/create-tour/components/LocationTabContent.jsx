import { useTranslation } from "next-i18next";
import Education from "./location/Education";
import Health from "./location/Health";
import Location from "./location/Location";
import Sorroundings from "./location/Sorroundings";
import Transportation from "./location/Transportation";

const LocationTabContent = () => {
  const { t } = useTranslation("common");

  return (
    <div className="col-xl-10">
      <div className="text-18 fw-500 mb-10">{t("vendor.location")}</div>
      <Location />

      <div className="text-18 fw-500 mb-10 mt-30">{t("vendor.surroundings")}</div>
      <Sorroundings />

      <Education />
      <Health />
      <Transportation />

      <div className="d-inline-block pt-30">
        <button
          type="submit"
          className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
        >
          {t("vendor.saveChanges")} <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </div>
  );
};

export default LocationTabContent;
