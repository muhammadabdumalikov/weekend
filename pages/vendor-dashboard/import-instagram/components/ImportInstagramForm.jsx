import React, { useState } from "react";
import { useRouter } from "next/router";
import { getProxiedImageUrl } from "../../../../providers/helpers";
import ToggleSwitch from "../../../../components/common/ToggleSwitch";

const ImportInstagramForm = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [instagramData, setInstagramData] = useState(null);
  const [extractedTourData, setExtractedTourData] = useState(null);

  const validateInstagramUrl = (value) => {
    return /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_\-]+/.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setInstagramData(null);
    setExtractedTourData(null);

    if (!url) {
      setError("Please enter an Instagram post URL");
      return;
    }

    if (!validateInstagramUrl(url)) {
      setError("Please enter a valid Instagram post URL");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://api.wetrippo.com/api/instagram/fetch-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postUrl: url,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setInstagramData(data.data);
      setSuccess("Instagram post fetched successfully!");
      setUrl("");
    } catch (error) {
      console.error("Error fetching Instagram post:", error);
      setError("Failed to fetch Instagram post. Please check the URL and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Extract all media URLs (carousel or single)
  const getMediaUrls = () => {
    const mediaUrls = [];
    if (instagramData?.edge_sidecar_to_children?.edges) {
      instagramData.edge_sidecar_to_children.edges.forEach((edge) => {
        if (edge.node.display_resources && edge.node.display_resources.length > 0) {
          mediaUrls.push(edge.node.display_resources[0].src);
        }
      });
    } else if (instagramData?.display_resources && instagramData.display_resources.length > 0) {
      mediaUrls.push(instagramData.display_resources[0].src);
    } else if (instagramData?.display_url) {
      mediaUrls.push(instagramData.display_url);
    }
    return mediaUrls;
  };

  // Render images in 3 columns
  const renderMediaGallery = () => {
    const mediaUrls = getMediaUrls();
    if (mediaUrls.length === 0) {
      return (
        <div className="instagramCard__image">
          <div className="cardImage">
            <div className="border-light rounded-4 overflow-hidden">
              <div className="cardImage ratio ratio-1:1">
                <div className="cardImage__content bg-light-2 d-flex items-center justify-center">
                  <div className="text-center">
                    <i className="icon-image text-48 text-light-1 mb-10"></i>
                    <div className="text-14 text-light-1">No image available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="instagramCard__image">
        <div className="row x-gap-10 y-gap-10" style={{ margin: 0 }}>
          {mediaUrls.map((src, idx) => (
            <div key={idx} className="col-4" style={{ padding: 0 }}>
              <div
                className="border-light rounded-4 overflow-hidden"
                style={{
                  aspectRatio: "1/1",
                  width: "100%",
                  background: "#f8f8f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={getProxiedImageUrl(src)}
                  alt={`Instagram media ${idx + 1}`}
                  className="w-100 h-100 object-fit-cover"
                  crossOrigin="anonymous"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Extracted tour component - improved with template's custom components and toggle switches
  const renderExtractedTour = () => {
    if (!extractedTourData) return null;
    
    return (
      <div className="extractedTourCard d-block rounded-4 bg-white shadow-3">
        {/* Header */}
        <div className="extractedTourCard__header p-20 border-bottom-light">
          <div className="d-flex items-center justify-between">
            <div className="d-flex items-center">
              <div className="size-40 rounded-full bg-blue-1 d-flex items-center justify-center mr-15">
                <i className="icon-tour text-18 text-white"></i>
              </div>
              <div>
                <h4 className="text-18 fw-600 text-dark-1">Extracted Tour</h4>
                <div className="text-14 text-light-1">AI Generated Content</div>
              </div>
            </div>
            <div className="text-12 text-light-1">
              <i className="icon-ai mr-5"></i>
              AI Generated
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="extractedTourCard__content p-20">
          
          {/* Title Section */}
          <div className="mb-20">
            <h5 className="text-16 fw-500 mb-15">Tour Title</h5>
            <div className="row y-gap-15">
              <div className="col-12">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.title?.en || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">English</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.title?.ru || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Russian</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.title?.uz || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Uzbek</label>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-20">
            <h5 className="text-16 fw-500 mb-15">Description</h5>
            <div className="row y-gap-15">
              <div className="col-12">
                <div className="form-input">
                  <textarea 
                    rows={3}
                    value={extractedTourData.description?.en || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">English</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <textarea 
                    rows={3}
                    value={extractedTourData.description?.ru || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Russian</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <textarea 
                    rows={3}
                    value={extractedTourData.description?.uz || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Uzbek</label>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="mb-20">
            <h5 className="text-16 fw-500 mb-15">Tour Details</h5>
            <div className="row y-gap-15">
              <div className="col-md-6">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.duration || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Duration</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={`$${extractedTourData.price || 0}`} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Price</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={`$${extractedTourData.sale_price || 0}`} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Sale Price</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.seats || 'Unlimited'} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Seats</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <input 
                    type="text" 
                    value={extractedTourData.start_date || ''} 
                    readOnly 
                  />
                  <label className="lh-1 text-14 text-light-1">Start Date</label>
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          {extractedTourData.files && extractedTourData.files.length > 0 && (
            <div className="mb-20">
              <h5 className="text-16 fw-500 mb-15">
                Images ({extractedTourData.files.length})
              </h5>
              <div className="d-flex x-gap-10 y-gap-10 flex-wrap">
                {extractedTourData.files.map((file, i) => (
                  <div key={i} className="position-relative">
                    <div className="cardImage ratio ratio-1:1" style={{ width: 100, height: 100 }}>
                      <div className="cardImage__content rounded-4 overflow-hidden">
                        <img
                          src={getProxiedImageUrl(file.url)}
                          alt={`Tour image ${i + 1}`}
                          className="w-100 h-100 object-fit-cover"
                        />
                      </div>
                    </div>
                    {file.type === 'main' && (
                      <div className="position-absolute top-5 right-5">
                        <div className="size-16 rounded-full bg-blue-1 d-flex items-center justify-center">
                          <i className="icon-star text-8 text-white"></i>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes Section - Improved with ToggleSwitch */}
          {extractedTourData.includes && extractedTourData.includes.length > 0 && (
            <div className="mb-20">
              <h5 className="text-16 fw-500 mb-15">What's Included</h5>
              <div className="row y-gap-15">
                {extractedTourData.includes.map((item, i) => (
                  <div key={i} className="col-12">
                    <div className="d-flex items-center justify-between p-15 rounded-4 border-light">
                      <div className="d-flex items-center">
                        <div className="size-40 rounded-full bg-light-2 d-flex items-center justify-center mr-15">
                          <i className="icon-check text-16 text-green-1"></i>
                        </div>
                        <span className="text-14 fw-500 text-dark-1">{item.title}</span>
                      </div>
                      <div className="d-flex items-center">
                        <ToggleSwitch
                          checked={item.included}
                          onChange={() => {}} // Read-only, no onChange needed
                          id={`extracted-include-toggle-${i}`}
                        />
                        <span className="ml-10 text-12 text-light-1">
                          {item.included ? "Included" : "Not included"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-flex x-gap-10 pt-20 border-top-light">
            <button
              className="button -md -outline-blue-1 text-blue-1"
              onClick={() => {
                localStorage.setItem('instagramTourData', JSON.stringify(extractedTourData));
                router.push('/vendor-dashboard/create-tour');
              }}
            >
              <i className="icon-edit mr-10"></i>
              Use This Tour
            </button>
            <button
              className="button -md -outline-green-1 text-green-1"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(extractedTourData, null, 2));
                setSuccess("Tour data copied to clipboard!");
              }}
            >
              <i className="icon-copy mr-10"></i>
              Copy Data
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Extract tour from API
  const handleExtractTour = async (mainImageIndex = 0) => {
    if (!instagramData?.post_id) {
      setError("Instagram post ID not found.");
      return;
    }
    setIsProcessingAI(true);
    setError("");
    setSuccess("");
    setExtractedTourData(null);

    try {
      const response = await fetch("https://api.wetrippo.com/api/instagram/create-tour-from-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: instagramData.post_id,
          mainImageIndex,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setExtractedTourData(data.data);
      setSuccess("Tour extracted successfully!");
    } catch (error) {
      console.error("Error extracting tour:", error);
      setError("Failed to extract tour. Please try again.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Use as template (uses all images)
  const handleUseAsTemplate = () => {
    if (!instagramData) return;
    const captionText =
      instagramData.edge_media_to_caption.edges.length > 0
        ? instagramData.edge_media_to_caption.edges[0].node.text
        : "";
    const title =
      captionText.split("\n")[0] || `Tour from ${instagramData.owner.username}`;
    const images = getMediaUrls();
    const tourData = {
      title: title,
      description: captionText,
      images: images,
      location: "Location from Instagram",
      duration: "1 day",
      price: "0",
      max_people: "10",
      category: "Instagram Import",
    };
    localStorage.setItem("instagramTourData", JSON.stringify(tourData));
    router.push("/vendor-dashboard/create-tour");
  };

  return (
    <div className="row y-gap-20" style={{ maxWidth: 1100 }}>
      <div className="col-12 col-lg-6">
        <form onSubmit={handleSubmit}>
          <label className="text-16 fw-500 mb-10">Instagram Post URL</label>
          <div className="input-group mb-20">
            <input
              type="text"
              placeholder="https://instagram.com/p/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-control border-light-1 rounded-4"
              style={{
                border: "1px solid #e8e8e8",
                borderRadius: "8px",
                padding: "12px 16px",
                fontSize: "15px",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
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
                transition: "all 0.3s ease",
              }}
              disabled={isLoading}
            >
              {isLoading ? "Fetching..." : "Import"}
            </button>
          </div>
        </form>

        {success && (
          <div className="col-12">
            <div className="d-flex items-center p-15 rounded-8 bg-blue-1-light">
              <div className="size-40 rounded-full bg-blue-1 d-flex items-center justify-center mr-15">
                <i className="icon-check text-18 text-white"></i>
              </div>
              <div className="text-14 text-dark-1">{success}</div>
            </div>
          </div>
        )}

        {error && (
          <div className="col-12">
            <div className="d-flex items-center p-15 rounded-8 bg-red-1-light">
              <div className="size-40 rounded-full bg-red-1 d-flex items-center justify-center mr-15">
                <i className="icon-alert text-18 text-white"></i>
              </div>
              <div className="text-14 text-dark-1">{error}</div>
            </div>
          </div>
        )}

        {instagramData && (
          <div className="instagramCard -type-1 d-block rounded-4 bg-white shadow-3 mt-20">
            <div className="instagramCard__header p-20 border-bottom-light">
              <div className="d-flex items-center justify-between">
                <div className="d-flex items-center">
                  <div
                    className="size-40 rounded-full overflow-hidden mr-15"
                    style={{
                      border: "2px solid #3554d1",
                    }}
                  >
                    <img
                      src={getProxiedImageUrl(instagramData.owner.profile_pic_url)}
                      alt={instagramData.owner.username}
                      className="w-100 h-100 object-fit-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  <div>
                    <h5 className="text-16 fw-500 text-dark-1">
                      {instagramData.owner.full_name}
                    </h5>
                    <div className="text-14 text-light-1">
                      @{instagramData.owner.username}
                    </div>
                  </div>
                </div>
                <div className="text-12 text-light-1">
                  <i className="icon-instagram mr-5"></i>
                  Instagram Post
                </div>
              </div>
            </div>
            {renderMediaGallery()}
            <div className="instagramCard__content p-20">
              {instagramData.edge_media_to_caption.edges.length > 0 && (
                <div className="border-top-light pt-15">
                  <h6 className="text-14 fw-500 text-dark-1 mb-10">Caption</h6>
                  <p className="text-14 lh-20 text-dark-1">
                    {instagramData.edge_media_to_caption.edges[0].node.text}
                  </p>
                </div>
              )}
              <div className="d-flex x-gap-10 mt-20 pt-20 border-top-light">
                <button
                  className="button -md -outline-blue-1 text-blue-1"
                  onClick={() => handleExtractTour(0)}
                  disabled={isProcessingAI}
                >
                  <i className="icon-ai mr-10"></i>
                  {isProcessingAI ? "Extracting..." : "Extract Tour"}
                </button>
                <button
                  className="button -md -outline-green-1 text-green-1"
                  onClick={handleUseAsTemplate}
                >
                  <i className="icon-edit mr-10"></i>
                  Use as Template
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="col-12 col-lg-6">{renderExtractedTour()}</div>
    </div>
  );
};

export default ImportInstagramForm;