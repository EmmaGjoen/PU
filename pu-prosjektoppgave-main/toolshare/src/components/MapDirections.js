import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, LoadScript } from '@react-google-maps/api';

function MapDirections({ origin, destination }) {
  const [response, setResponse] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapLoaded) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(origin.latitude, origin.longitude),
        destination: new window.google.maps.LatLng(destination.latitude, destination.longitude),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setResponse(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  }, [origin, destination, mapLoaded]);

  return (
    <div style={{ height: '400px', width: '500px' }}>
      <LoadScript
        googleMapsApiKey="AIzaSyBKXlCyDtY8AFdGRZneVPR47ojuokkGcb8"
        onLoad={() => setMapLoaded(true)}
      >
        {mapLoaded && (
          <GoogleMap
            mapContainerStyle={{ height: '100%', width: '100%' }}
            zoom={14}
            center={new window.google.maps.LatLng(origin.latitude, origin.longitude)}
          >
            {response && (
              <DirectionsRenderer
                options={{
                  directions: response,
                }}
              />
            )}
          </GoogleMap>
        )}
      </LoadScript>
    </div>
  );
}

export default MapDirections;