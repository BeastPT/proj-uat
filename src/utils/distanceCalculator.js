/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param {Object} position1 - First position with lat and lng properties
 * @param {Object} position2 - Second position with lat and lng properties
 * @param {String} unit - Unit of measurement ('km' for kilometers or 'mi' for miles)
 * @returns {Number} - Distance in the specified unit
 */
export const calculateDistance = (position1, position2, unit = 'km') => {
  if (!position1 || !position2) {
    return null;
  }

  const toRad = (value) => (value * Math.PI) / 180;
  
  const R = unit === 'mi' ? 3958.8 : 6371; // Earth radius in miles or kilometers
  
  const dLat = toRad(position2.lat - position1.lat);
  const dLng = toRad(position2.lng - position1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(position1.lat)) * Math.cos(toRad(position2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return parseFloat(distance.toFixed(2));
};

/**
 * Get the current user's geolocation
 * @returns {Promise} - Promise that resolves with the user's coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};
