import { useTranslation } from "next-i18next";

const PricingTabContent = () => {
  const { t } = useTranslation("common");

  return (
    <div className="col-xl-9 col-lg-11">
      <div className="row x-gap-20 y-gap-20">
        <div className="col-12">
          <div className="text-18 fw-500 mb-10">{t("vendor.pricing")}</div>
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">{t("vendor.hotelPrice")}</label>
          </div>

          <div className="d-flex mt-20">
            <div className="form-checkbox ">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
            </div>
            <div className="text-15 lh-11 ml-10">{t("vendor.enableExtraPrice")}</div>
          </div>

          <div className="fw-500 mt-30">{t("vendor.enableServiceFee")}</div>

          <div className="d-flex mt-10">
            <div className="form-checkbox ">
              <input type="checkbox" name="name" />
              <div className="form-checkbox__mark">
                <div className="form-checkbox__icon icon-check" />
              </div>
            </div>
            <div className="text-15 lh-11 ml-10">{t("vendor.enableExtraPrice")}</div>
          </div>
        </div>
        {/* End .col-12 */}
      </div>
      {/* End .row */}

      <div className="text-18 fw-500 mb-10 pt-30">
        {t("vendor.checkInCheckOutTime")}
      </div>

      <div className="row x-gap-20 y-gap-20">
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t("vendor.timeForCheckIn")}
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t("vendor.timeForCheckOut")}
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t("vendor.minimumAdvanceReservations")}
            </label>
          </div>
        </div>
        {/* End col-6 */}
        <div className="col-md-6">
          <div className="form-input ">
            <input type="text" required />
            <label className="lh-1 text-16 text-light-1">
              {t("vendor.minimumDayStayRequirements")}
            </label>
          </div>
        </div>
        {/* End col-6 */}
      </div>
      {/* End row */}

      <div className="col-md-12 d-inline-block mt-30">
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

export default PricingTabContent;
