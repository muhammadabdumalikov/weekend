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

  const handlePhoneChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      contact_phone: prev.contact_phone.map((phone, i) => i === index ? value : phone)
    }));
  };

  const addPhone = () => {
    setFormData(prev => ({
      ...prev,
      contact_phone: [...prev.contact_phone, ""]
    }));
  };

  const removePhone = (index) => {
    if (formData.contact_phone.length > 1) {
      setFormData(prev => ({
        ...prev,
        contact_phone: prev.contact_phone.filter((_, i) => i !== index)
      }));
    }
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
              <label className="lh-1 text-14 text-light-1">{t("vendor.tourPrice")} <span className="text-red-1">*</span></label>
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
            <label className="lh-1 text-14 text-light-1 mb-10 d-block">Currency <span className="text-red-1">*</span></label>
            <div className="dropdown js-dropdown js-amenities-active h-full">
              <div
                className="dropdown__button d-flex items-center text-14 border-light px-20 bg-white h-full rounded-4"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
                aria-expanded="false"
                data-bs-offset="0,10"
              >
                <span className="js-dropdown-title fw-500">{formData.currency || "Select Currency"}</span>
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
              <label className="lh-1 text-14 text-light-1">{t("vendor.startDate")} <span className="text-red-1">*</span></label>
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

      {/* Contact Phones */}
      <div className="col-12 mb-20">
        <h4 className="text-18 fw-500 mb-20">{t("vendor.contactPhones")}</h4>
        <div className="row y-gap-20 align-items-center">
          {formData.contact_phone.map((phone, index) => (
            <div key={index} className="col-md-6">
              <div className="form-input bg-white position-relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="+998 90 123 45 67"
                  required
                  style={{ paddingRight: formData.contact_phone.length > 1 ? '45px' : '20px' }}
                />
                {/* <label className="lh-1 text-14 text-light-1">
                  {t("vendor.phoneNumber")} {index + 1}
                </label> */}
                {formData.contact_phone.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePhone(index)}
                    className="position-absolute d-flex items-center justify-center"
                    style={{
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#dc3545',
                      cursor: 'pointer',
                      padding: '6px',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      transition: 'all 0.2s ease',
                      zIndex: 10
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f8d7da';
                      e.target.style.color = '#721c24';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#dc3545';
                    }}
                    title={t("common.remove")}
                  >
                    <i className="icon-close text-10"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
          <div className="col-md-6">
            <button
              type="button"
              onClick={addPhone}
              className="button -md -outline-blue-1 text-blue-1"
            >
              <i className="icon-plus mr-10"></i>
              {t("vendor.addPhoneNumber")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourDetailsTab; 