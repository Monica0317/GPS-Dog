import React, { useEffect, useState } from 'react';

const LocationTracker = () => {
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("La geolocalización no es compatible con este navegador.");
            return;
        }

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        };

        const handleError = (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setError("Permiso denegado para acceder a la ubicación.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    setError("Ubicación no disponible.");
                    break;
                case error.TIMEOUT:
                    setError("Tiempo de espera excedido.");
                    break;
                case error.UNKNOWN_ERROR:
                    setError("Error desconocido.");
                    break;
            }
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    }, []);

    return (
        <div>
            <h2>Ubicación Actual</h2>
            {error && <p>Error: {error}</p>}
            {location.latitude && location.longitude ? (
                <p>
                    Latitud: {location.latitude}<br />
                    Longitud: {location.longitude}
                </p>
            ) : (
                <p>Cargando ubicación...</p>
            )}
        </div>
    );
};

export default LocationTracker;
