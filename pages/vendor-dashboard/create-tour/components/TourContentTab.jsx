import React, { useState, useEffect } from "react";
import ToggleSwitch from "../../../../components/common/ToggleSwitch";

const TourContentTab = ({ formData, setFormData }) => {
  const handleInputChange = (field, value, language = null) => {
    if (language) {
      setFormData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [language]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="row y-gap-20">
      {/* Title Section */}
      <div className="col-12">
        <h4 className="text-18 fw-500 mb-20">Tour Title</h4>
        <div className="row y-gap-20">
          <div className="col-md-4">
            <div className={`form-input ${formData.title.en ? 'has-value' : ''}`}>
              <input
                type="text"
                value={formData.title.en}
                onChange={(e) => handleInputChange("title", e.target.value, "en")}
                required
              />
              <label className="lh-1 text-14 text-light-1">Title (English)</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`form-input ${formData.title.uz ? 'has-value' : ''}`}>
              <input
                type="text"
                value={formData.title.uz}
                onChange={(e) => handleInputChange("title", e.target.value, "uz")}
                required
              />
              <label className="lh-1 text-14 text-light-1">Title (Uzbek)</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`form-input ${formData.title.ru ? 'has-value' : ''}`}>
              <input
                type="text"
                value={formData.title.ru}
                onChange={(e) => handleInputChange("title", e.target.value, "ru")}
                required
              />
              <label className="lh-1 text-14 text-light-1">Title (Russian)</label>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="col-12">
        <h4 className="text-18 fw-500 mb-20">Tour Description</h4>
        <div className="row y-gap-20">
          <div className="col-md-4">
            <div className={`form-input ${formData.description.en ? 'has-value' : ''}`}>
              <textarea
                value={formData.description.en}
                onChange={(e) => handleInputChange("description", e.target.value, "en")}
                rows={4}
                required
              />
              <label className="lh-1 text-14 text-light-1">Description (English)</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`form-input ${formData.description.uz ? 'has-value' : ''}`}>
              <textarea
                value={formData.description.uz}
                onChange={(e) => handleInputChange("description", e.target.value, "uz")}
                rows={4}
                required
              />
              <label className="lh-1 text-14 text-light-1">Description (Uzbek)</label>
            </div>
          </div>
          <div className="col-md-4">
            <div className={`form-input ${formData.description.ru ? 'has-value' : ''}`}>
              <textarea
                value={formData.description.ru}
                onChange={(e) => handleInputChange("description", e.target.value, "ru")}
                rows={4}
                required
              />
              <label className="lh-1 text-14 text-light-1">Description (Russian)</label>
            </div>
          </div>
        </div>
      </div>

      {/* Route JSON */}
      <div className="col-12">
        <div className="form-section">
          <div className="section-header">
            <h4 className="text-18 fw-500">Tour Route</h4>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  route_json: [...prev.route_json, { title: "", description: "" }]
                }));
              }}
              className="action-button -add"
            >
              Add Route Item
            </button>
          </div>
          
          {formData.route_json.map((route, index) => (
            <div key={index} className="form-item">
              <div className="item-header">
                <div className="item-number">{index + 1}</div>
                <button
                  type="button"
                  onClick={() => {
                    const newRouteJson = formData.route_json.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, route_json: newRouteJson }));
                  }}
                  className="action-button -remove-ghost"
                  title="Remove this route item"
                >
                  Remove
                </button>
              </div>
              
              <div className="row y-gap-20">
                <div className="col-md-6">
                  <div className="form-input">
                    <input
                      type="text"
                      value={route.title}
                      onChange={(e) => {
                        const newRouteJson = [...formData.route_json];
                        newRouteJson[index] = { ...newRouteJson[index], title: e.target.value };
                        setFormData(prev => ({ ...prev, route_json: newRouteJson }));
                      }}
                      placeholder="Route title"
                    />
                    <label className="lh-1 text-14 text-light-1">Route Title</label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-input">
                    <input
                      type="text"
                      value={route.description}
                      onChange={(e) => {
                        const newRouteJson = [...formData.route_json];
                        newRouteJson[index] = { ...newRouteJson[index], description: e.target.value };
                        setFormData(prev => ({ ...prev, route_json: newRouteJson }));
                      }}
                      placeholder="Route description"
                    />
                    <label className="lh-1 text-14 text-light-1">Route Description</label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Includes */}
      <div className="col-12">
        <div className="form-section">
          <div className="section-header">
            <h4 className="text-18 fw-500">What's Included</h4>
            <button
              type="button"
              onClick={() => {
                setFormData(prev => ({
                  ...prev,
                  includes: [...prev.includes, { title: "", included: true }]
                }));
              }}
              className="action-button -add"
            >
              Add Include Item
            </button>
          </div>
          
          {formData.includes.map((include, index) => (
            <div key={index} className="form-item">
              <div className="item-header">
                <div className="item-number">{index + 1}</div>
                <button
                  type="button"
                  onClick={() => {
                    const newIncludes = formData.includes.filter((_, i) => i !== index);
                    setFormData(prev => ({ ...prev, includes: newIncludes }));
                  }}
                  className="action-button -remove-ghost"
                  title="Remove this include item"
                >
                  Remove
                </button>
              </div>
              
              <div className="row y-gap-20">
                <div className="col-md-6">
                  <div className="form-input">
                    <input
                      type="text"
                      value={include.title}
                      onChange={(e) => {
                        const newIncludes = [...formData.includes];
                        newIncludes[index] = { ...newIncludes[index], title: e.target.value };
                        setFormData(prev => ({ ...prev, includes: newIncludes }));
                      }}
                      placeholder="Include item"
                    />
                    <label className="lh-1 text-14 text-light-1">Include Item</label>
                  </div>
                </div>
                <div className="col-md-4 d-flex align-items-center">
                  <ToggleSwitch
                    checked={include.included}
                    onChange={(e) => {
                      const newIncludes = [...formData.includes];
                      newIncludes[index] = { ...newIncludes[index], included: e.target.checked };
                      setFormData(prev => ({ ...prev, includes: newIncludes }));
                    }}
                    id={`include-toggle-${index}`}
                  />
                  <span className="ml-10 text-14 text-light-1">
                    {include.included ? "Included" : "Not included"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourContentTab; 