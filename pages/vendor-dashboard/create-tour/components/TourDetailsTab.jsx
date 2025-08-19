import React from "react";
import { useTranslation } from "next-i18next";
import ToggleSwitch from "../../../../components/common/ToggleSwitch";

const CurrencyType = {
  UZS: 'UZS',
  USD: 'USD',
  EUR: 'EUR',
};

const TourDetailsTab = ({ formData, setFormData }) => {
  const { t } = useTranslation("common");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="row y-gap-20">
      {/* Basic Details */}
      <div className="col-12">
        <h4 className="text-18 fw-500 mb-20">{t("vendor.tourDetails")}</h4>
        <div className="row y-gap-20">
          <div className="col-md-3">
            <div className="form-input bg-white">
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.tourPrice")}</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-input bg-white">
              <input
                type="number"
                value={formData.sale_price}
                onChange={(e) => handleInputChange("sale_price", e.target.value)}
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.salePrice")}</label>
            </div>
          </div>
          <div className="col-md-1">
            <div className="dropdown js-dropdown js-amenities-active h-full">
              <div
                className="dropdown__button d-flex items-center text-14 border-light px-20 bg-white h-full rounded-4"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
                data-bs-offset="0,10"
              >
                <span className="js-dropdown-title fw-500">{formData.currency || CurrencyType.USD}</span>
                <i className="icon icon-chevron-sm-down text-7 ml-10" />
              </div>
              {/* End dropdown__button */}

              <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
                <div className="text-15 y-gap-15 js-dropdown-list">
                  {Object.values(CurrencyType).map((currency) => (
                    <div key={currency}>
                      <button
                        className={`${
                          currency === (formData.currency || CurrencyType.USD) ? "text-blue-1 " : ""
                        }d-block js-dropdown-link`}
                        onClick={() => handleInputChange("currency", currency)}
                      >
                        {currency}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* End dropdown-menu */}
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-input bg-white">
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                required
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.tourDuration")}</label>
            </div>
          </div>
          <div className="col-md-3">
            <div className="form-input bg-white">
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => handleInputChange("seats", parseInt(e.target.value))}
                required
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.availableSeats")}</label>
            </div>
          </div>
        </div>
      </div>

      {/* Start Date and Status */}
      <div className="col-12">
        <div className="row y-gap-20">
          <div className="col-md-6">
            <div className="form-input bg-white">
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange("start_date", e.target.value)}
                required
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.startDate")}</label>
            </div>
          </div>
          <div className="col-md-6">
            <label className="lh-1 text-14 text-light-1">{t("vendor.status")}</label>
            <div className="d-flex items-center">
              <ToggleSwitch
                checked={formData.status}
                onChange={() => handleInputChange("status", !formData.status)}
                id="status-toggle"
              />
              <span className="ml-10 text-14 text-light-1">
                {formData.status ? t("vendor.active") : t("vendor.inactive")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="col-12">
        <div className="row y-gap-20">
          <div className="col-md-6">
            <div className="form-input bg-white">
              <input
                type="number"
                value={formData.location}
                onChange={(e) => handleInputChange("location", parseInt(e.target.value))}
                required
              />
              <label className="lh-1 text-14 text-light-1">{t("vendor.locationId")}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailsTab; 