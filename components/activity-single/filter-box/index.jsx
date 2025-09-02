import GuestSearch from "./GuestSearch";
import DateSearch from "./DateSearch";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const index = () => {
  const { t } = useTranslation("common");

  const contactInfo = [
    {
      id: 1,
      title: t("contact.customerCare"),
      action: "tel:+998937377793",
      text: "+998937377793",
      icon: "icon-phone",
      type: "phone"
    },
    {
      id: 2,
      title: t("contact.liveSupport"),
      action: "mailto:trippolive@gmail.com",
      text: "trippolive@gmail.com",
      icon: "icon-mail",
      type: "email"
    }
  ];

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

      <div className="col-12">
        <Link
          href="/hotel/booking-page"
          className="button -dark-1 py-15 px-35 h-60 col-12 rounded-4 bg-blue-1 text-white"
        >
          {t("common.book")}
        </Link>
      </div>
      {/* End .col-12 */}

      {/* Contact Information Section */}
      <div className="col-12">
        <div className="border-top-light pt-20">
          <h5 className="text-16 fw-500 mb-15">{t("contact.contactInfo")}</h5>
          <div className="row y-gap-10">
            {contactInfo.map((item) => (
              <div className="col-12" key={item.id}>
                <div className="d-flex items-center">
                  <div className="size-30 flex-center bg-light-2 rounded-full mr-10">
                    <i className={`${item.icon} text-14 text-blue-1`}></i>
                  </div>
                  <div className="flex-grow-1">
                    <div className="text-12 text-light-1">{item.title}</div>
                    <a 
                      href={item.action}
                      className={`text-14 fw-500 text-dark-1 hover:text-blue-1 transition-colors ${
                        item.type === 'phone' ? 'cursor-pointer' : ''
                      }`}
                      onClick={(e) => {
                        if (item.type === 'phone') {
                          // For mobile devices, this will open the phone app
                          // For desktop, it will show a confirmation dialog
                          if (window.confirm(`${t("contact.callConfirm")} ${item.text}?`)) {
                            window.location.href = item.action;
                          } else {
                            e.preventDefault();
                          }
                        }
                      }}
                    >
                      {item.text}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End Contact Information Section */}
    </>
  );
};

export default index;
