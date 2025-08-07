import React from "react";
import { getProxiedImageUrl } from "../../../../providers/helpers";

const TourFileUploadTab = ({ files, setFiles }) => {
  const handleFileUpload = (event) => {
    const fileList = event.target.files;
    const maxFiles = 10;
    const currentFileCount = files.length;

    console.log("File upload triggered:", fileList.length, "files");
    console.log("Current files count:", currentFileCount);

    // Check if adding these files would exceed the limit
    if (currentFileCount + fileList.length > maxFiles) {
      alert(`You can only upload a maximum of ${maxFiles} images. You currently have ${currentFileCount} images.`);
      return;
    }

    // Process files synchronously
    const newFiles = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      console.log("Processing file:", file.name, file.type, file.size);
      
      // Validate file type
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type.toLowerCase())) {
        alert(`Image ${file.name} is not a valid file type. Only PNG, JPEG and WebP are allowed.`);
        continue;
      }

      // Create file object
      const fileObj = {
        type: "logo",
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      };
      
      newFiles.push(fileObj);
      console.log("File object created:", fileObj);
    }

    // Update state with new files
    if (newFiles.length > 0) {
      console.log("Adding files to state:", newFiles);
      setFiles(prev => {
        const updatedFiles = [...prev, ...newFiles];
        console.log("Updated files state:", updatedFiles);
        return updatedFiles;
      });
    }

    // Clear the input
    event.target.value = '';
  };

  const handleRemoveFile = (index) => {
    console.log("Removing file at index:", index);
    // Prevent removing if only 1 image left (minimum requirement)
    if (files.length <= 1) {
      alert("You must have at least 1 image for the tour.");
      return;
    }
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      console.log("Files after removal:", newFiles);
      return newFiles;
    });
  };

  return (
    <div className="col-12">
      <h4 className="text-18 fw-500 mb-20">Tour Images</h4>
      
      <div className="row x-gap-20 y-gap-20 pt-15 bg-white">
        {/* Show uploaded images first */}
        {files.map((file, index) => (
          <div className="col-auto image-preview-container" key={index}>
            <div className="d-flex ratio ratio-1:1 w-200 position-relative">
              <img src={getProxiedImageUrl(file.url)} alt={file.name} className="img-ratio rounded-4" />
              
              {/* Enhanced Delete Button */}
              {files.length > 1 && (
                <div className="delete-button-overlay">
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="delete-image-btn"
                    title="Delete this image"
                  >
                    <i className="icon-trash text-16"></i>
                  </button>
                </div>
              )}
              
              {/* Image Counter Badge */}
              <div className="image-counter-badge ml-10 mt-10">
                {index + 1}
              </div>
            </div>
          </div>
        ))}

        {/* Show upload button only if under max limit */}
        {files.length < 10 && (
          <div className="col-auto">
            <div className="w-200">
              <label htmlFor="tourImageUpload" className="d-flex ratio ratio-1:1">
                <div className="flex-center flex-column text-center bg-blue-2 h-full w-1/1 absolute rounded-4 border-type-1">
                  <div className="icon-upload-file text-40 text-blue-1 mb-10" />
                  <div className="text-blue-1 fw-500">Upload Images</div>
                </div>
              </label>
              <input
                type="file"
                id="tourImageUpload"
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="d-none"
                onChange={handleFileUpload}
              />
              <div className="text-start mt-10 text-14 text-light-1">
                PNG, JPG or WebP no bigger than 800px wide and tall.
                <br />
                <span className="text-blue-1">
                  {files.length}/10 images uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show warning if no images */}
      {files.length === 0 && (
        <div className="col-12 mt-20">
          <div className="alert alert-warning" role="alert">
            <i className="icon-alert-triangle text-16 mr-10" />
            You must upload at least 1 image for the tour.
          </div>
        </div>
      )}

      {/* Show info when max reached */}
      {files.length >= 10 && (
        <div className="col-12 mt-20">
          <div className="alert alert-info" role="alert">
            <i className="icon-info text-16 mr-10" />
            Maximum of 10 images reached. Remove some images to upload more.
          </div>
        </div>
      )}
    </div>
  );
};

export default TourFileUploadTab; 