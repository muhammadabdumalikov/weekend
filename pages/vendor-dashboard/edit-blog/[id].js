import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../../components/common/Seo";
import Sidebar from "../common/Sidebar";
import Header from "../../../components/header/dashboard-header";
import Footer from "../common/Footer";
import EditBlogForm from "./components/EditBlogForm";

const EditBlog = () => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBlogData();
    }
  }, [id]);

  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.wetrippo.com/api/blog/get-by-id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        const blogData = await response.json();
        setBlog(blogData);
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
      setError("Failed to load blog data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Seo pageTitle="Loading..." />
        <div className="header-margin"></div>
        <Header key={i18n.language} />
        <div className="dashboard">
          <div className="dashboard__sidebar bg-white scroll-bar-1">
            <Sidebar key={i18n.language} />
          </div>
          <div className="dashboard__main">
            <div className="dashboard__content bg-light-2">
              <div className="row y-gap-20 justify-center items-center" style={{ minHeight: "400px" }}>
                <div className="col-auto">
                  <div className="text-center">
                    <div className="icon-spinner text-40 text-blue-1 mb-20"></div>
                    <h2 className="text-20 fw-500">Loading blog...</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo pageTitle="Error" />
        <div className="header-margin"></div>
        <Header key={i18n.language} />
        <div className="dashboard">
          <div className="dashboard__sidebar bg-white scroll-bar-1">
            <Sidebar key={i18n.language} />
          </div>
          <div className="dashboard__main">
            <div className="dashboard__content bg-light-2">
              <div className="row y-gap-20 justify-center items-center" style={{ minHeight: "400px" }}>
                <div className="col-auto">
                  <div className="text-center">
                    <div className="icon-alert-triangle text-40 text-red-1 mb-20"></div>
                    <h2 className="text-20 fw-500">Error</h2>
                    <p className="text-15 text-light-1 mt-10">{error}</p>
                    <button
                      onClick={() => router.back()}
                      className="button -md -outline-blue-1 text-blue-1 mt-20"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo pageTitle={t("blog.editBlog")} />
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header key={i18n.language} />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar key={i18n.language} />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">{t("blog.editBlog")}</h1>
                <div className="text-15 text-light-1">
                  {t("blog.editBlogSubtitle")}
                </div>
              </div>
              {/* End .col-12 */}
            </div>
            {/* End .row */}

            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <EditBlogForm blog={blog} key={i18n.language} />
            </div>

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
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

export default EditBlog;
