import React, { lazy, Suspense } from "react";
import Layout from "../components/Layout";

const MapComponent = lazy(() => 
  Promise.all([
    import("../components/MapComponent"),
    // Agregamos un pequeño delay para asegurar que todos los recursos se carguen
    new Promise(resolve => setTimeout(resolve, 1000))
  ]).then(([moduleExport]) => moduleExport)
);

const Map = ({ usuario }) => {
  return (
    <Layout usuario={usuario}>
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <Suspense
              fallback={
                <div className="d-flex justify-content-center align-items-center" style={{ height: "600px" }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                </div>
              }
            >
              <MapComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;