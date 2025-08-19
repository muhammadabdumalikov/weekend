import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CallToActions from "../../components/common/CallToActions";
import Seo from "../../components/common/Seo";
import DefaultHeader from "../../components/header/default-header";
import DefaultFooter from "../../components/footer/default";
import LoginWithSocial from "../../components/common/LoginWithSocial";
import SignUpForm from "../../components/common/SignUpForm";

const SignUp = () => {
  const { t, i18n } = useTranslation("common");
  
  return (
    <>
      <Seo pageTitle={t("auth.register")} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <SignUpForm key={i18n.language} />
                {/* End SignUP */}

                <div className="row y-gap-20 pt-30">
                  <div className="col-12">
                    <div className="text-center">{t("auth.orSignUpWith")}</div>
                  </div>
                  <LoginWithSocial key={i18n.language} />
                  <div className="col-12">
                    <div className="text-center px-30">
                      {t("auth.termsAgreement")}
                    </div>
                  </div>
                </div>
                {/* End .row */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End login section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
      {/* End Call To Actions Section */}
    </>
  );
};

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default SignUp;
