import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getProxiedImageUrl } from "../../../../providers/helpers";
import ToggleSwitch from "../../../../components/common/ToggleSwitch";

const CurrencyType = {
  UZS: 'UZS',
  USD: 'USD',
  EUR: 'EUR',
  KGS: 'KGS',
  RUB: 'RUB',
};

const ImportInstagramForm = () => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [instagramData, setInstagramData] = useState(null);
  const [extractedTourData, setExtractedTourData] = useState(null);
  const [editableData, setEditableData] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);

  // Update editableData when extractedTourData changes
  useEffect(() => {
    if (extractedTourData) {
      setEditableData(extractedTourData);
      // Initialize selected images with all images selected
      if (extractedTourData.files && extractedTourData.files.length > 0) {
        setSelectedImages(extractedTourData.files.map((_, index) => index));
      }
    }
  }, [extractedTourData]);

  const validateInstagramUrl = (value) => {
    return /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_\-]+/.test(value);
  };

  const handleInputChange = (field, value, language = null) => {
    if (language) {
      setExtractedTourData(prev => ({
        ...prev,
        [field]: {
          ...prev[field],
          [language]: (field === "price" || field === "sale_price") ? String(value) : value
        }
      }));
    } else {
      setExtractedTourData(prev => ({
        ...prev,
        [field]: (field === "price" || field === "sale_price") ? String(value) : value
      }));
    }
  };

  // Function to upload a single image with retry
  const uploadImage = async (imageUrl, retryCount = 0) => {
    const maxRetries = 2;

    try {
      // Use the proxied URL to avoid CORS issues
      const proxiedUrl = getProxiedImageUrl(imageUrl);

      // Fetch the image from proxied URL
      const response = await fetch(proxiedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', blob, 'instagram-image.jpg');

      // Upload to server
      const uploadResponse = await fetch('https://api.wetrippo.com/api/file-router/simple-upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult
    } catch (error) {
      console.error(`Error uploading image (attempt ${retryCount + 1}):`, error);

      // Retry logic
      if (retryCount < maxRetries) {
        console.log(`Retrying upload (attempt ${retryCount + 2}/${maxRetries + 1})...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return uploadImage(imageUrl, retryCount + 1);
      }

      throw error;
    }
  };

  // Function to upload only selected images
  const uploadSelectedImages = async (imageUrls) => {
    setIsUploadingImages(true);
    setUploadProgress(0);

    try {
      const uploadedUrls = [];
      const selectedImageUrls = selectedImages.map(index => imageUrls[index]);
      const totalImages = selectedImageUrls.length;
      const failedUploads = [];

      for (let i = 0; i < totalImages; i++) {
        try {
          const uploadedUrl = await uploadImage(selectedImageUrls[i]);
          // Set the selected main image as main, others as extra
          const originalIndex = selectedImages[i];
          const imageType = originalIndex === selectedMainImage ? 'main' : 'extra';
          uploadedUrls.push({ ...uploadedUrl, type: imageType });

          // Update progress
          const progress = ((i + 1) / totalImages) * 100;
          setUploadProgress(progress);
        } catch (error) {
          console.error(`Failed to upload image ${i + 1}:`, error);
          failedUploads.push(i + 1);
          // Continue with other images even if one fails
        }
      }

      // Show warning if some uploads failed
      if (failedUploads.length > 0) {
        setError(`Warning: Failed to upload ${failedUploads.length} images. Tour will be created with available images.`);
      }

      return uploadedUrls;
    } finally {
      setIsUploadingImages(false);
      setUploadProgress(0);
    }
  };

  // Handle image selection
  const handleImageSelection = (imageIndex) => {
    setSelectedImages(prev => {
      if (prev.includes(imageIndex)) {
        // Remove image from selection
        const newSelection = prev.filter(index => index !== imageIndex);
        // If we're removing the main image, set the first remaining image as main
        if (imageIndex === selectedMainImage && newSelection.length > 0) {
          setSelectedMainImage(newSelection[0]);
        }
        return newSelection;
      } else {
        // Add image to selection
        return [...prev, imageIndex];
      }
    });
  };

  const handleCreateTour = async () => {
    setIsCreating(true);
    setError("");
    setSuccess("");

    try {
      // Get image URLs from extracted tour data
      const imageUrls = extractedTourData.files?.map(file => file.url) || [];

      if (imageUrls.length > 0 && selectedImages.length > 0) {
        setSuccess("Uploading selected images to server...");

        // Upload only selected images
        const uploadedUrls = await uploadSelectedImages(imageUrls);

        // Update the tour data with uploaded URLs
        const updatedTourData = {
          ...editableData,
          price: editableData.price > 0 ? String(editableData.price) : null,
          sale_price: editableData.sale_price > 0 ? String(editableData.sale_price) : null,
          files: uploadedUrls
        };

        setSuccess("Images uploaded successfully! Creating tour...");

        // Create tour with uploaded image URLs
        const response = await fetch('https://api.wetrippo.com/api/admin/tour/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(updatedTourData),
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess("Tour created successfully!");
          // Clear the form after successful creation
          setTimeout(() => {
            setInstagramData(null);
            setExtractedTourData(null);
            setEditableData(null);
            setUrl("");
            setSelectedImages([]);
            setSelectedMainImage(0);
          }, 2000);
        } else {
          setError("Failed to create tour. Please try again.");
        }
      } else if (selectedImages.length === 0) {
        setError("Please select at least one image to upload.");
      } else {
        // No images to upload, create tour directly
        const response = await fetch('https://api.wetrippo.com/api/admin/tour/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify(editableData),
        });

        if (response.ok) {
          const result = await response.json();
          setSuccess("Tour created successfully!");
          // Clear the form after successful creation
          setTimeout(() => {
            setInstagramData(null);
            setExtractedTourData(null);
            setEditableData(null);
            setUrl("");
            setSelectedImages([]);
            setSelectedMainImage(0);
          }, 2000);
        } else {
          setError("Failed to create tour. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating tour:", error);
      setError("An error occurred while creating the tour.");
    } finally {
      setIsCreating(false);
    }
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
    if (!extractedTourData) {
      return (
        <div className="extractedTourCard d-block w-100 rounded-4 bg-white shadow-3">
          <div className="extractedTourCard__content p-40">
            <div className="text-center">
              <div className="size-80 rounded-full bg-light-2 d-flex items-center justify-center mx-auto mb-20">
                <i className="icon-location-2 text-light-1" style={{ fontSize: '24px' }}></i>
              </div>
              <h4 className="text-18 fw-500 text-dark-1 mb-10">No Tour Data</h4>
              <p className="text-14 text-light-1 mb-20">
                Extract tour information from an Instagram post to see the details here
              </p>
              <div className="d-flex items-center justify-center">
                <div className="size-6 rounded-full bg-light-1 mr-10"></div>
                <div className="size-6 rounded-full bg-light-1 mr-10"></div>
                <div className="size-6 rounded-full bg-light-1"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="extractedTourCard d-block w-100 rounded-4 bg-white shadow-3">
        {/* Header */}
        <div className="extractedTourCard__header p-20 mb-20">
          <div className="d-flex items-center justify-between">
            <div className="d-flex items-center">
              <div className="size-40 rounded-full bg-blue-1 d-flex items-center justify-center mr-15">
                <i className="icon-tour text-18 text-white"></i>
              </div>
              <div>
                <h4 className="text-18 fw-600">Extracted Tour</h4>
                <p className="text-14 text-light-1">Review and edit tour details</p>
              </div>
            </div>
            <div className="d-flex items-center">
              <button
                className="button -md -dark-1 bg-blue-1 text-white"
                onClick={handleCreateTour}
                disabled={isCreating || isUploadingImages || selectedImages.length === 0}
              >
                {isUploadingImages ? "Uploading Images..." : isCreating ? "Creating..." : `Create Tour (${selectedImages.length} images)`}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="extractedTourCard__content p-20">
          {/* Title Section */}
          <div className="mb-20">

            {isUploadingImages && (
              <div className="col-12">
                <div className="d-flex items-center p-15 rounded-8 bg-blue-1-light">
                  <div className="size-40 rounded-full bg-blue-1 d-flex items-center justify-center mr-15">
                    <i className="icon-upload text-18 text-white"></i>
                  </div>
                  <div className="text-14 text-dark-1">
                    Uploading {Math.round(uploadProgress)}% complete...
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploadingImages && (
              <div className="mb-15">
                <div className="d-flex items-center justify-between mb-10">
                  <span className="text-14 text-dark-1">Uploading images to server...</span>
                  <span className="text-14 text-blue-1 fw-500">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="progress-bar bg-light-2 rounded-4" style={{ height: '8px' }}>
                  <div
                    className="progress-bar-fill bg-blue-1 rounded-4"
                    style={{
                      width: `${uploadProgress}%`,
                      height: '100%',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            )}

            <h5 className="text-16 fw-500 mb-15">Title</h5>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="form-input">
                  <input
                    type="text"
                    value={extractedTourData.title?.en || ""}
                    onChange={(e) => handleInputChange('title', e.target.value, 'en')}
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">English</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <input
                    type="text"
                    value={extractedTourData.title?.ru || ""}
                    onChange={(e) => handleInputChange('title', e.target.value, 'ru')}
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">Russian</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <input
                    type="text"
                    value={extractedTourData.title?.uz || ""}
                    onChange={(e) => handleInputChange('title', e.target.value, 'uz')}
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">Uzbek</label>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-20">
            <h5 className="text-16 fw-500 mb-15">Description</h5>
            <div className="row y-gap-10">
              <div className="col-12">
                <div className="form-input">
                  <textarea
                    value={extractedTourData.description?.en || ""}
                    onChange={(e) => handleInputChange('description', e.target.value, 'en')}
                    rows="4"
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">English</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <textarea
                    value={extractedTourData.description?.ru || ""}
                    onChange={(e) => handleInputChange('description', e.target.value, 'ru')}
                    rows="4"
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">Russian</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-input">
                  <textarea
                    value={extractedTourData.description?.uz || ""}
                    onChange={(e) => handleInputChange('description', e.target.value, 'uz')}
                    rows="4"
                    required
                  />
                  <label className="lh-1 text-14 text-light-1">Uzbek</label>
                </div>
              </div>
            </div>
          </div>

          {/* Tour Details */}
          <div className="row y-gap-20">
            <div className="col-lg-6">
              <div className="form-input">
                <input
                  type="number"
                  value={extractedTourData.price || ""}
                  onChange={(e) => handleInputChange('price', String(e.target.value))}
                  required
                  min={1}
                />
                <label className="lh-1 text-14 text-light-1">Price</label>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-input">
                <input
                  type="number"
                  value={extractedTourData.sale_price || ""}
                  onChange={(e) => handleInputChange('sale_price', e.target.value === 0 ? null : String(e.target.value))}
                  min={0}
                />
                <label className="lh-1 text-14 text-light-1">Sale Price</label>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="dropdown js-dropdown js-amenities-active h-full">
                <div
                  className="dropdown__button d-flex items-center text-14 border-light px-20 bg-white h-full rounded-4"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  data-bs-offset="0,10"
                >
                  <span className="js-dropdown-title fw-500">{extractedTourData.currency || CurrencyType.USD}</span>
                  <i className="icon icon-chevron-sm-down text-7 ml-10" />
                </div>
                {/* End dropdown__button */}

                <div className="toggle-element -dropdown js-click-dropdown dropdown-menu">
                  <div className="text-15 y-gap-15 js-dropdown-list">
                    {Object.values(CurrencyType).map((currency) => (
                      <div key={currency}>
                        <button
                          className={`${currency === (extractedTourData.currency || CurrencyType.USD) ? "text-blue-1 " : ""
                            }d-block js-dropdown-link`}
                          onClick={() => handleInputChange("currency", currency)}
                        >
                          {currency}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* End dropdown-menu */}
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-input">
                <input
                  type="text"
                  value={extractedTourData.duration || ""}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  required
                />
                <label className="lh-1 text-14 text-light-1">Duration</label>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-input">
                <input
                  type="date"
                  value={extractedTourData.start_date || ""}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  required
                />
                <label className="lh-1 text-14 text-light-1">Start Date</label>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-input">
                <input
                  type="number"
                  value={extractedTourData.seats || ""}
                  onChange={(e) => handleInputChange('seats', parseInt(e.target.value))}
                  required
                />
                <label className="lh-1 text-14 text-light-1">Available Seats</label>
              </div>
            </div>
          </div>

          {/* Files Section */}
          {extractedTourData.files && extractedTourData.files.length > 0 && (
            <div className="mt-20">
              <div className="row x-gap-10 y-gap-10">
                {extractedTourData.files.map((file, i) => (
                  <div key={i} className="col-lg-4 col-md-6">
                    <div className="cardImage ratio ratio-1:1 relative">
                      <div className="cardImage__content">
                        <img
                          src={getProxiedImageUrl(file.url)}
                          alt={`Tour image ${i + 1}`}
                          className="rounded-4"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>

                      {/* Set Main Button */}
                      <div className="ml-10 mt-10">
                        <button
                          onClick={() => setSelectedMainImage(i)}
                          className={`button -sm p-10 rounded-4 ${selectedMainImage === i
                            ? 'bg-blue-1 text-white'
                            : 'bg-white text-dark-1 hover:bg-light-2 border-light-1'
                            }`}
                        >
                          {selectedMainImage === i ? 'Main' : 'Set Main'}
                        </button>
                      </div>

                      {/* Selection Checkbox */}
                      <div className="ml-10 mt-40">
                        <button
                          onClick={() => handleImageSelection(i)}
                          className={`button -sm rounded-4 ${selectedImages.includes(i)
                            ? 'bg-blue-1 text-white'
                            : 'bg-white text-dark-1 hover:bg-light-2 border-light-1'
                            }`}
                        >
                          <i className={`icon-check text-20 ${selectedImages.includes(i) ? 'text-white' : 'text-blue-1'}`}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selection Summary */}
              {selectedImages.length > 0 && (
                <div className="mt-15 p-15 rounded-8 bg-light-2">
                  <div className="d-flex items-center justify-between">
                    <span className="text-14 text-dark-1">
                      {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected for upload
                    </span>
                    {selectedMainImage !== null && selectedImages.includes(selectedMainImage) && (
                      <span className="text-14 text-blue-1 fw-500">
                        Image {selectedMainImage + 1} set as main
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
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

  return (
    <div className="row y-gap-20">
      <div className="col-12 col-lg-4">
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
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="col-12 col-lg-8">{renderExtractedTour()}</div>
    </div>
  );
};

export default ImportInstagramForm;