import Seo from "../../../components/common/Seo";
import Sidebar from "../common/Sidebar";
import Header from "../../../components/header/dashboard-header";
import SettingsTabs from "./components/index";
import Footer from "../common/Footer";
import { useEffect } from "react";

const index = () => {
  useEffect(() => {
    // Check if there's Instagram tour data to pre-fill
    const instagramTourData = localStorage.getItem('instagramTourData');
    if (instagramTourData) {
      // Clear the data from localStorage
      localStorage.removeItem('instagramTourData');
      
      // You can pass this data to your SettingsTabs component
      // or handle it as needed in your form components
      console.log('Instagram tour data:', JSON.parse(instagramTourData));
      
      // Show a success message that data was imported
      // You can implement this using your preferred state management
    }
  }, []);

  return (
    <>
      <Seo pageTitle="Create Tour" />
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
          {/* End sidebar */}
        </div>

        <div className="dashboard__main bg-light-2">
          <div className="dashboard__content d-flex flex-column justify-between">
            <div className="dashboard__content-top">
              <div className="row y-gap-20 justify-between items-center pb-20 lg:pb-20 md:pb-15">
                <div className="col-lg-auto">
                  <div className="text-18 lh-12 fw-500">Create Tour</div>
                  <div className="text-14 text-light-1 lh-12">
                    Add a new tour to your portfolio
                  </div>
                </div>

                <div className="col-lg-auto">
                  <div className="d-flex x-gap-10">
                    <button 
                      className="button -md -outline-blue-1 text-blue-1 mr-5"
                      onClick={() => window.open('/vendor-dashboard/import-instagram', '_blank')}
                    >
                      <i className="icon-instagram mr-10"></i>
                      Import from Instagram
                    </button>
                    <button 
                      className="button -md -outline-gray-1 text-gray-1"
                      disabled
                    >
                      <i className="icon-telegram mr-10"></i>
                      Import from Telegram
                    </button>
                  </div>
                </div>
              </div>

              <SettingsTabs />
            </div>

            <div className="dashboard__content-bottom">
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
