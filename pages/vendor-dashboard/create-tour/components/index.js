import React, { useState, useEffect } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import TourContentTab from "./TourContentTab";
import TourDetailsTab from "./TourDetailsTab";
import TourFileUploadTab from "./TourFileUploadTab";

const Index = () => {
  const [formData, setFormData] = useState({
    title: { en: "", uz: "", ru: "" },
    description: { en: "", uz: "", ru: "" },
    status: 1,
    location: 0,
    price: 0,
    sale_price: 0,
    duration: "",
    start_date: "",
    seats: 0,
    route_json: [{ title: "", description: "" }],
    includes: [{ title: "", included: true }]
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentTab, setCurrentTab] = useState(0);

  // Check for Instagram data on component mount
  useEffect(() => {
    const instagramData = localStorage.getItem('instagramTourData');
    if (instagramData) {
      try {
        const parsedData = JSON.parse(instagramData);
        
        // Pre-fill form with Instagram data
        setFormData(prev => ({
          ...prev,
          title: {
            en: parsedData.title || "",
            uz: parsedData.title || "",
            ru: parsedData.title || ""
          },
          description: {
            en: parsedData.description || "",
            uz: parsedData.description || "",
            ru: parsedData.description || ""
          },
          duration: parsedData.duration || "",
          price: parsedData.price || 0,
          seats: parsedData.max_people || 10
        }));

        // If there are images, add them to files
        if (parsedData.images && parsedData.images.length > 0) {
          // Convert image URLs to file objects (you might need to fetch them)
          setFiles(prev => [...prev, ...parsedData.images]);
        }

        // Clear the localStorage after pre-filling
        localStorage.removeItem('instagramTourData');
        
        // Show success message
        setSuccess("Tour data imported from Instagram successfully!");
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
        
      } catch (error) {
        console.error("Error parsing Instagram data:", error);
        localStorage.removeItem('instagramTourData');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const requestBody = {
        ...formData,
        files: files
      };

      const response = await fetch("https://api.wetrippo.com/api/admin/tour/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Tour created successfully!");
        // Optionally reset form or redirect
      } else {
        setError(data.message || "Failed to create tour");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTab < 2) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleCreateTour = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e);
  };

  const isLastTab = currentTab === 2;

  return (
    <div>
      <Tabs 
        className="tabs -underline-2 js-tabs" 
        selectedIndex={currentTab}
        onSelect={(index) => setCurrentTab(index)}
      >
        <TabList className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
          <Tab className="col-auto">
            <button 
              type="button" 
              className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button"
            >
              1. Content
            </button>
          </Tab>
          <Tab className="col-auto">
            <button 
              type="button" 
              className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button"
            >
              2. Details
            </button>
          </Tab>
          <Tab className="col-auto">
            <button 
              type="button" 
              className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button"
            >
              3. File Upload
            </button>
          </Tab>
        </TabList>
        <div className="tabs__content pt-30 js-tabs-content">
          <TabPanel>
            <TourContentTab formData={formData} setFormData={setFormData} />
          </TabPanel>
          <TabPanel>
            <TourDetailsTab formData={formData} setFormData={setFormData} />
          </TabPanel>
          <TabPanel>
            <TourFileUploadTab files={files} setFiles={setFiles} />
          </TabPanel>
        </div>
      </Tabs>
      
      {error && (
        <div className="col-12">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}
      {success && (
        <div className="col-12">
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="col-12 border-top-light pt-30">
        <div className="d-flex justify-content-between align-items-center">
          {/* Previous Button */}
          {currentTab > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="button h-50 px-24 -outline-blue-1 text-blue-1"
            >
              <div className="icon-arrow-left mr-15" />
              Previous
            </button>
          )}
          
          {/* Next/Create Tour Button */}
          <div className="ml-auto">
            {isLastTab ? (
              <button
                type="button"
                onClick={handleCreateTour}
                disabled={isLoading}
                className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Tour...
                  </>
                ) : (
                  <>
                    Create Tour <div className="icon-arrow-top-right ml-15" />
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
              >
                Next <div className="icon-arrow-right ml-15" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
