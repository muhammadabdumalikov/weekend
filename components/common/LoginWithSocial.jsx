import { useState } from "react";

const LoginWithSocial = () => {
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [telegramUsername, setTelegramUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTelegramClick = () => {
    setShowTelegramModal(true);
  };

  const handleTelegramSubmit = async (e) => {
    e.preventDefault();
    
    if (!telegramUsername.trim()) {
      setError("Please enter your Telegram username");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.wetrippo.com/api/client/telegram-auth/send-telegram-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: telegramUsername.trim()
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success - show OTP input
        setShowOtpInput(true);
        setError("");
      } else {
        // Handle API error
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpCode.trim()) {
      setError("Please enter the OTP code");
      return;
    }

    setIsOtpLoading(true);
    setError("");

    try {
      const response = await fetch("https://api.wetrippo.com/api/client/telegram-auth/verify-telegram-otp ", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: telegramUsername.trim(),
          otp_code: otpCode.trim()
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Success - show success modal
        setShowSuccessModal(true);
        setShowTelegramModal(false);
      } else {
        // Handle API error
        setError(data.message || "Invalid OTP code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const closeModal = () => {
    setShowTelegramModal(false);
    setTelegramUsername("");
    setOtpCode("");
    setError("");
    setIsLoading(false);
    setIsOtpLoading(false);
    setShowOtpInput(false);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    // You can redirect user or update authentication state here
  };

  const goBackToUsername = () => {
    setShowOtpInput(false);
    setOtpCode("");
    setError("");
  };

  const isSubmitDisabled = !telegramUsername.trim() || isLoading;
  const isOtpSubmitDisabled = !otpCode.trim() || isOtpLoading;

  return (
    <>
      <div className="col-md-4 col-12">
        <button className="button col-12 -outline-blue-1 text-blue-1 py-15 rounded-8 ">
          <i className="icon-apple text-15 mr-10" />
          Facebook
        </button>
      </div>

      <div className="col-md-4 col-12">
        <button className="button col-12 -outline-red-1 text-red-1 py-15 rounded-8 ">
          <i className="icon-apple text-15 mr-10" />
          Google
        </button>
      </div>

      <div className="col-md-4 col-12">
        <button 
          className="button col-12 -outline-blue-1 text-blue-1 py-15 rounded-8 "
          onClick={handleTelegramClick}
        >
          <i className="icon-apple text-15 mr-10" />
          Telegram
        </button>
      </div>

      {/* Telegram Modal */}
      {showTelegramModal && (
        <div className="telegram-modal-overlay">
          <div className="telegram-modal">
            <div className="telegram-modal-header">
              <h3>{showOtpInput ? "Enter OTP Code" : "Sign up with Telegram"}</h3>
              <button className="modal-close" onClick={closeModal}>
                <i className="icon-close"></i>
              </button>
            </div>
            
            {!showOtpInput ? (
              // Username Input Form
              <form onSubmit={handleTelegramSubmit}>
                <div className="telegram-modal-body">
                  <p className="modal-description">
                    <a href="https://t.me/my443_bot" target="_blank" rel="noopener noreferrer" className="text-blue-1">Start our bot</a> and send your Telegram username to continue with signup
                  </p>
                  <div className="form-input">
                    <input
                      type="text"
                      value={telegramUsername}
                      onChange={(e) => {
                        setTelegramUsername(e.target.value);
                        setError(""); // Clear error when user types
                      }}
                      placeholder="Enter your Telegram username"
                      required
                      disabled={isLoading}
                    />
                    <label className="lh-1 text-14 text-light-1">
                      Telegram Username
                    </label>
                  </div>
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
                <div className="telegram-modal-footer">
                  <button 
                    type="button" 
                    className="button -outline-blue-1 text-blue-1" 
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`button -dark-1 text-white ${isSubmitDisabled ? 'bg-gray-400' : 'bg-blue-1'}`}
                    disabled={isSubmitDisabled}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Code Via Telegram"
                    )}
                  </button>
                </div>
              </form>
            ) : (
              // OTP Input Form
              <form onSubmit={handleOtpSubmit}>
                <div className="telegram-modal-body">
                  <p className="modal-description">
                    We've sent a verification code to your Telegram account. Please enter the code below.
                  </p>
                  <div className="form-input">
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                        setError(""); // Clear error when user types
                      }}
                      placeholder="Enter 5-digit code"
                      required
                      disabled={isOtpLoading}
                      maxLength={6}
                    />
                    <label className="lh-1 text-14 text-light-1">
                      OTP Code
                    </label>
                  </div>
                  {error && (
                    <div className="error-message">
                      {error}
                    </div>
                  )}
                </div>
                <div className="telegram-modal-footer">
                  <button 
                    type="button" 
                    className="button -outline-blue-1 text-blue-1" 
                    onClick={goBackToUsername}
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    className={`button -dark-1 text-white ${isOtpSubmitDisabled ? 'bg-gray-400' : 'bg-blue-1'}`}
                    disabled={isOtpSubmitDisabled}
                  >
                    {isOtpLoading ? (
                      <>
                        <span className="loading-spinner"></span>
                        Verifying...
                      </>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="telegram-modal-overlay">
          <div className="telegram-modal success-modal">
            <div className="telegram-modal-header">
              <h3>Authentication Successful!</h3>
              <button className="modal-close" onClick={closeSuccessModal}>
                <i className="icon-close"></i>
              </button>
            </div>
            
            <div className="telegram-modal-body">
              <div className="d-flex flex-column items-center">
                <div className="size-80 flex-center rounded-full bg-green-2 mb-20">
                  <i className="icon-check text-30 text-white" />
                </div>
                <div className="text-22 lh-1 fw-600 text-center mb-10">
                  Welcome to GoTrip!
                </div>
                <div className="text-15 text-light-1 text-center">
                  Your Telegram account has been successfully verified. You can now enjoy all our services.
                </div>
              </div>
            </div>
            
            <div className="telegram-modal-footer">
              <button 
                type="button" 
                className="button -dark-1 bg-blue-1 text-white w-100" 
                onClick={closeSuccessModal}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .telegram-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .telegram-modal {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          animation: modalSlideIn 0.3s ease-out;
        }

        .success-modal {
          max-width: 450px;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .telegram-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .telegram-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #6b7280;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background-color: #f3f4f6;
          color: #374151;
        }

        .telegram-modal-body {
          padding: 24px;
        }

        .modal-description {
          margin: 0 0 20px 0;
          color: #6b7280;
          font-size: 14px;
          line-height: 1.5;
        }

        .error-message {
          color: #dc2626;
          font-size: 14px;
          margin-top: 8px;
          padding: 8px 12px;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 6px;
        }

        .telegram-modal-footer {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          justify-content: flex-end;
        }

        .telegram-modal-footer button {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .telegram-modal-footer button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        .telegram-modal-footer button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          background-color: #9ca3af !important;
        }

        .telegram-modal-footer button:disabled:hover {
          transform: none;
          border-color: #9ca3af !important;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 1s ease-in-out infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .telegram-modal {
            margin: 20px;
          }
          
          .telegram-modal-footer {
            flex-direction: column;
          }
          
          .telegram-modal-footer button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default LoginWithSocial;
