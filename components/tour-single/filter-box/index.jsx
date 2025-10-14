import GuestSearch from "./GuestSearch";
import DateSearch from "./DateSearch";
import { useTranslation } from "next-i18next";
import { useState } from "react";

const index = ({ tour }) => {
  const { t } = useTranslation("common");
  const [showContactPhones, setShowContactPhones] = useState(false);

  // Function to detect mobile devices
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  // Enhanced phone click handler
  const handlePhoneClick = (phone, e) => {
    e.preventDefault();
    
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    const greetingMessage = encodeURIComponent(`${t("contact.greeting")} ${tour?.title || ''}`);
    const telegramUrl = `https://t.me/+${cleanPhone}?text=${greetingMessage}`;
    
    if (isMobileDevice()) {
      // For mobile devices, show choice dialog
      const choice = window.confirm(
        `📞 Contact: ${phone}\n\n` +
        `Choose communication method:\n\n` +
        `✅ OK = Open Telegram\n` +
        `❌ Cancel = Make phone call`
      );
      
      if (choice) {
        // Open Telegram with the phone number and greeting
        window.open(telegramUrl, '_blank');
      } else {
        // Make phone call
        window.location.href = `tel:${phone}`;
      }
    } else {
      // For desktop, directly open Telegram with greeting
      window.open(telegramUrl, '_blank');
    }
  };
  return (
    <>
      <div className="col-12">
        <div className="searchMenu-date px-20 py-10 border-light rounded-4 -right js-form-dd js-calendar">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">{t("common.date")}</h4>
            <DateSearch />
          </div>
        </div>
        {/* End check-in-out */}
      </div>
      {/* End .col-12 */}

      <div className="col-12">
        <GuestSearch />
        {/* End guest */}
      </div>
      {/* End .col-12 */}

      {/* Book Now Button */}
      <div className="col-12">
        <button
          onClick={() => {
            if(activity.contact_phone.length > 1){
              setShowContactPhones(!showContactPhones);
            }else{
              window.location.href = `tel:${activity.contact_phone[0]}`;
            }
          }}
          className="button -dark-1 py-15 px-35 h-60 col-12 rounded-4 bg-blue-1 text-white"
        >
          {t("common.book")}
        </button>
      </div>
      {/* End .col-12 */}

      {/* Contact Phone Section - Show when Book Now is clicked */}
      {showContactPhones && tour?.contact_phone && tour.contact_phone.length > 0 && (
        <div className="col-12">
          <div className="border-top-light pt-20">
            <h5 className="text-16 fw-500 mb-15">{t("contact.contactInfo")}</h5>
            <div className="row y-gap-10">
              {tour.contact_phone.map((phone, index) => (
                <div className="col-12" key={index}>
                  <div className="d-flex items-center">
                    <div className="size-30 flex-center bg-light-2 rounded-full mr-10">
                      <i className="icon-phone text-14 text-blue-1"></i>
                    </div>
                    <div className="flex-grow-1">
                      <div className="text-12 text-light-1">{t("contact.phoneNumber")} {index + 1}</div>
                      <a 
                        href={`tel:${phone}`}
                        className={`text-14 fw-500 text-dark-1 hover:text-blue-1 transition-colors cursor-pointer ${
                          isMobileDevice() ? 'underline' : ''
                        }`}
                        onClick={(e) => handlePhoneClick(phone, e)}
                        title={isMobileDevice() ? "Tap to open Telegram or call" : "Click to open Telegram"}
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* End Contact Phone Section */}
    </>
  );
};

export default index;
