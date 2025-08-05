import React, { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../../pages/dashboard/common/Pagination";
import TourCard from "./TourCard";
import LoadingSpinner from "./LoadingSpinner";

const MyToursList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch tours data
  const fetchTours = async () => {
    const response = await fetch("https://api.wetrippo.com/api/admin/tour/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      },
      body: JSON.stringify({
        page: currentPage,
        search: debouncedSearchTerm,
        status: statusFilter
      })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tours");
    }

    return response.json();
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["myTours", currentPage, debouncedSearchTerm, statusFilter],
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

  const filteredTours = data?.data?.filter(tour => {
    const matchesSearch = tour.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                         tour.description?.en?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tour.status.toString() === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-40">
        <div className="text-20 text-red-1 fw-500 mb-10">Error loading tours</div>
        <div className="text-14 text-light-1 mb-20">{error.message}</div>
        <button 
          onClick={() => refetch()}
          className="button -md -dark-1 bg-blue-1 text-white"
        >
          Try Again
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
                placeholder="Search tours..."
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
              Searching...
            </div>
          )}
        </div>
        
        <div className="col-lg-4">
          <div className="d-flex x-gap-10">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`button -md mr-5 ${statusFilter === "all" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              All
            </button>
            <button
              onClick={() => handleStatusFilter("1")}
              className={`button -md mr-5 ${statusFilter === "1" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              Active
            </button>
            <button
              onClick={() => handleStatusFilter("0")}
              className={`button -md ${statusFilter === "0" ? "-dark-1 bg-blue-1 text-white" : "-outline-blue-1"}`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {filteredTours.length > 0 && (
        <div className="d-flex justify-between items-center mb-20">
          <div className="text-14 text-light-1">
            Showing {filteredTours.length} of {data?.data?.length || 0} tours
          </div>
          {debouncedSearchTerm && (
            <div className="text-14 text-light-1">
              Search results for: "<span className="fw-500">{debouncedSearchTerm}</span>"
            </div>
          )}
        </div>
      )}

      {/* Tours List */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-40">
          <div className="text-20 text-light-1 fw-500 mb-10">No tours found</div>
          <div className="text-14 text-light-1">
            {debouncedSearchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "You haven't created any tours yet"}
          </div>
          {(debouncedSearchTerm || statusFilter !== "all") && (
            <button 
              onClick={() => {
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setStatusFilter("all");
              }}
              className="button -md -outline-blue-1 mt-15"
            >
              Clear Filters
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
      {filteredTours.length > 0 && (
        <Pagination />
      )}
    </div>
  );
};

export default MyToursList;