import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Map from './Map';
import './GpsTracker.css';

const socket = io('http://localhost:4000');

const GpsTracker = () => {
  const [gpsData, setGpsData] = useState(null);

  useEffect(() => {
    socket.on('gps-data', (data) => {
      setGpsData(data);
    });

    return () => socket.off('gps-data');
  }, []);

  return (
    <div className="gps-tracker">
      <h1>Rastreador GPS en Tiempo Real</h1>
      {gpsData ? (
        <Map gpsData={gpsData} />
      ) : (
        <p>Conectando al collar GPS...</p>
      )}
    </div>
  );
};

export default GpsTracker;
