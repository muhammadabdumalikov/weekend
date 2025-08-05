const API_BASE_URL = 'https://api.wetrippo.com/api';

export const getProxiedImageUrl = (originalUrl) => {
  if (!originalUrl) return "";
  return `${API_BASE_URL}/instagram/proxy-image?url=${encodeURIComponent(originalUrl)}`;
};