import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../../pages/dashboard/common/Pagination";
import TourCard from "./TourCard";
import LoadingSpinner from "./LoadingSpinner";

const MyToursList = () => {
  const { t } = useTranslation("common");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [location, setLocation] = useState("");
  const [fromPrice, setFromPrice] = useState("");
  const [toPrice, setToPrice] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch tours data
  const fetchTours = async () => {
    const requestBody = {
      limit: 10, // You can adjust this
      offset: (currentPage - 1) * 10,
      search: debouncedSearchTerm,
      status: statusFilter === "all" ? [] : [statusFilter],
      from_date: fromDate || null,
      to_date: toDate || null,
      location: location ? parseInt(location) : null,
      from_price: fromPrice ? parseFloat(fromPrice) : null,
      to_price: toPrice ? parseFloat(toPrice) : null
    };

    // Remove null values
    Object.keys(requestBody).forEach(key => {
      if (requestBody[key] === null || requestBody[key] === "") {
        delete requestBody[key];
      }
    });

    const response = await fetch("https://api.wetrippo.com/api/admin/tour/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(t("myTours.fetchError"));
    }

    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["myTours", currentPage, debouncedSearchTerm, statusFilter, fromDate, toDate, location, fromPrice, toPrice],
    queryFn: fetchTours,
    refetchOnWindowFocus: false,
  });

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  }, [refetch]);

  const handleStatusFilter = useCallback((status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  }, []);

  const handleSearchInputChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setStatusFilter("all");
    setFromDate("");
    setToDate("");
    setLocation("");
    setFromPrice("");
    setToPrice("");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = searchTerm || statusFilter !== "all" || fromDate || toDate || location || fromPrice || toPrice;

  const filteredTours = data?.data || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-red-1 fw-500 mb-10">{t("myTours.errorLoading")}</div>
        <div className="text-14 text-light-1 mb-20">{error.message}</div>
        <button 
          onClick={() => refetch()}
          className="button -md -dark-1 bg-blue-1 text-white"
        >
          {t("myTours.tryAgain")}
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filter Section */}
      <div className="row y-gap-20 mb-30">
        <div className="col-lg-8">
          <form onSubmit={handleSearch} className="search-form">
            <div className="input-group">
              <input
                type="text"
                placeholder={t("myTours.searchPlaceholder")}
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="form-control border-light-1 rounded-4"
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3554d1";
                  e.target.style.boxShadow = "0 0 0 3px rgba(53, 84, 209, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e8e8e8";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button 
                type="submit" 
                className="button -md -dark-1 bg-blue-1 text-white"
                style={{
                  marginLeft: "8px",
                  borderRadius: "8px",
                  padding: "12px 20px",
                  border: "none",
                  fontWeight: "500",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 4px 8px rgba(53, 84, 209, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <i className="icon-search text-16" />
              </button>
            </div>
          </form>
          
          {/* Search Status Indicator */}
          {searchTerm !== debouncedSearchTerm && (
            <div className="text-12 text-light-1 mt-5">
              <i className="icon-clock text-10 mr-5"></i>
              {t("myTours.searching")}
            </div>
          )}
        </div>
        
        <div className="col-lg-4">
          <div className="d-flex x-gap-10">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`button -md mr-5 ${statusFilter === "all" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              {t("myTours.all")}
            </button>
            <button
              onClick={() => handleStatusFilter("1")}
              className={`button -md mr-5 ${statusFilter === "1" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              {t("myTours.active")}
            </button>
            <button
              onClick={() => handleStatusFilter("0")}
              className={`button -md ${statusFilter === "0" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              {t("myTours.inactive")}
            </button>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`button -md -outline-blue-1 ml-10 ${showAdvancedFilters ? 'bg-blue-1 text-white' : ''}`}
            >
              {t("myTours.filters")}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="row y-gap-20 mb-30 p-20 bg-light-2 rounded-8">
          <div className="col-lg-3 col-md-6">
            <label className="text-14 fw-500 text-dark-1 mb-10">{t("myTours.fromDate")}</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control border-light-1 rounded-4"
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "15px"
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="text-14 fw-500 text-dark-1 mb-10">{t("myTours.toDate")}</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control border-light-1 rounded-4"
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "15px"
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="text-14 fw-500 text-dark-1 mb-10">{t("myTours.locationId")}</label>
            <input
              type="number"
              placeholder={t("myTours.locationIdPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control border-light-1 rounded-4"
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "15px"
              }}
            />
          </div>
          <div className="col-lg-3 col-md-6">
            <label className="text-14 fw-500 text-dark-1 mb-10">{t("myTours.priceRange")}</label>
            <div className="d-flex x-gap-10">
              <input
                type="number"
                placeholder={t("myTours.from")}
                value={fromPrice}
                onChange={(e) => setFromPrice(e.target.value)}
                className="form-control border-light-1 rounded-4"
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  flex: 1
                }}
              />
              <input
                type="number"
                placeholder={t("myTours.to")}
                value={toPrice}
                onChange={(e) => setToPrice(e.target.value)}
                className="form-control border-light-1 rounded-4"
                style={{
                  border: "1px solid #e8e8e8",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  fontSize: "15px",
                  flex: 1
                }}
              />
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex x-gap-10">
              <button
                onClick={() => {
                  setCurrentPage(1);
                  refetch();
                }}
                className="button -md -dark-1 bg-blue-1 text-white"
              >
                {t("myTours.applyFilters")}
              </button>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="ml-5 button -md -outline-blue-1"
                >
                  {t("myTours.clearAll")}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {filteredTours.length > 0 && (
        <div className="d-flex justify-between items-center mb-20">
          <div className="text-14 text-light-1">
            {t("myTours.showingTours", { count: filteredTours.length })}
          </div>
          {hasActiveFilters && (
            <div className="text-14 text-light-1">
              <i className="icon-filter text-12 mr-5"></i>
              {t("myTours.filtersApplied")}
            </div>
          )}
        </div>
      )}

      {/* Tours List */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500 mb-10">{t("myTours.noToursFound")}</div>
          <div className="text-14 text-light-1">
            {hasActiveFilters 
              ? t("myTours.adjustSearchCriteria") 
              : t("myTours.noToursCreated")}
          </div>
          {hasActiveFilters && (
            <button 
              onClick={handleClearFilters}
              className="button -md -outline-blue-1 mt-15"
            >
              {t("myTours.clearFilters")}
            </button>
          )}
        </div>
      ) : (
        <div className="row y-gap-20">
          {filteredTours.map((tour) => (
            <div key={tour.id} className="col-12">
              <TourCard tour={tour} onUpdate={refetch} />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredTours.length > 0 && data?.total && (
        <Pagination 
          currentPage={currentPage}
          totalPages={Math.ceil(data.total / 10)}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default MyToursList;