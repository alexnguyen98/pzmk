export const getBoundingBox = (lat: number, lng: number, zoom: number) => {
  // Calculate the degrees per pixel based on zoom level
  // At zoom level 0, the world is 256 pixels wide and covers 360 degrees
  // Each zoom level doubles the number of pixels and halves the degrees per pixel
  const degreesPerPixel = 360 / (256 * Math.pow(2, zoom));

  // Assuming a viewport size (you can adjust this based on your needs)
  const viewportWidth = 1024;
  const viewportHeight = 768;

  // Calculate the bounding box
  const latDelta =
    (viewportHeight / 2) * degreesPerPixel * Math.cos((lat * Math.PI) / 180);
  const lngDelta = (viewportWidth / 2) * degreesPerPixel;

  return {
    north: lat + latDelta,
    south: lat - latDelta,
    east: lng + lngDelta,
    west: lng - lngDelta,
  };
};
