import React from "react";
import Image from "next/image";

const TourCard = ({ tour, onUpdate }) => {

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return status === 1 ? (
      <span className="badge text-14 lh-14 bg-blue-1 text-white">Active</span>
    ) : (
      <span className="badge text-14 lh-14 bg-red-1 text-white">Inactive</span>
    );
  };

  return (
    <div className="border-top-light pt-30">
      <div className="row x-gap-20 y-gap-20">
        {/* Tour Image */}
        <div className="col-md-auto">
          <div className="cardImage ratio ratio-1:1 w-250 md:w-1/1 rounded-4">
            <div className="cardImage__content">
              {tour.files && tour.files.length > 0 ? (
                <Image
                  width={250}
                  height={250}
                  className="rounded-4 col-12 js-lazy"
                  src={tour.files[0].url}
                  alt={tour.title}
                />
              ) : (
                <div className="bg-light-1 rounded-4 col-12 d-flex items-center justify-center">
                  <i className="icon-image text-40 text-light-1"></i>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tour Details */}
        <div className="col-md">
          <div className="row x-gap-10 items-center mb-10">
            <div className="col-auto">
              {getStatusBadge(tour.status)}
            </div>
            <div className="col-auto">
              <div className="size-3 rounded-full bg-light-1"></div>
            </div>
            <div className="col-auto">
              <p className="text-14 lh-14">{tour.duration}</p>
            </div>
            <div className="col-auto">
              <div className="size-3 rounded-full bg-light-1"></div>
            </div>
            <div className="col-auto">
              <p className="text-14 lh-14">{tour.seats} seats</p>
            </div>
          </div>

          <h3 className="text-18 lh-16 fw-500 mb-10">
            {tour.title}
          </h3>
          
          <p className="text-14 lh-14 text-light-1 mb-15">
            {tour.description?.en?.substring(0, 150)}...
          </p>

          <div className="row x-gap-20 y-gap-10">
            <div className="col-auto">
              <div className="text-14 lh-14">
                <strong>Price:</strong> {formatPrice(tour.price)}
              </div>
            </div>
            <div className="col-auto">
              <div className="text-14 lh-14">
                <strong>Sale Price:</strong> {formatPrice(tour.sale_price)}
              </div>
            </div>
            <div className="col-auto">
              <div className="text-14 lh-14">
                <strong>Start Date:</strong> {formatDate(tour.start_date)}
              </div>
            </div>
          </div>

          {tour.organizer_title && (
            <div className="text-14 lh-14 mt-10">
              <strong>Organizer:</strong> {tour.organizer_title.en}
            </div>
          )}

          {tour.includes && tour.includes.length > 0 && (
            <div className="mt-15">
              <div className="text-14 fw-500 mb-5">Includes:</div>
              <div className="row x-gap-10 y-gap-5">
                {tour.includes.map((item, index) => (
                  <div key={index} className="col-auto">
                    <span className={`text-12 ${item.included ? 'text-green-2' : 'text-light-1'}`}>
                      {item.title} {item.included ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="col-md-auto text-right md:text-left">
          <div className="d-flex x-gap-10 justify-end md:justify-start">
            {/* View Button */}
            <button 
              className="button -md -outline-blue-1 text-blue-1 mr-5"
              title="View Tour Details"
            >
              <i className="icon-eye text-16 mr-5"></i>
              View
            </button>
            
            {/* Edit Button */}
            <button 
              className="button -md -outline-blue-1 text-blue-1"
              title="Edit Tour"
            >
              <i className="icon-edit text-16 mr-5"></i>
              Edit
            </button>
          </div>

          {tour.rating && (
            <div className="d-flex x-gap-5 items-center justify-end md:justify-start mt-10">
              <i className="icon-star text-10 text-yellow-1"></i>
              <span className="text-14 lh-14">{tour.rating}</span>
              <span className="text-14 lh-14 text-light-1">({tour.review_count} reviews)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourCard; 