import MainFilterSearchBox from "./MainFilterSearchBox";
import { useTranslation } from "next-i18next";

const index = () => {
  const { t } = useTranslation("common");
  return (
    <section className="masthead -type-6">
      <div className="masthead__bg bg-dark-3">
        <img alt="image" src="/img/masthead/6/bg2.jpg" className="js-lazy" />
      </div>

      <div className="container">
        <div className="row justify-center">
          <div className="col-xl-9">
            <div className="text-center">
              <h1
                className="text-60 lg:text-40 md:text-30 text-white"
                data-aos="fade-up"
              >
                {t("hero.title")}
              </h1>
              <p
                className="text-white mt-5"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {t("hero.subtitle")}
              </p>
            </div>
            {/* End hero title */}
            <MainFilterSearchBox />
          </div>
        </div>
      </div>
    </section>
  );
};

export default index;
