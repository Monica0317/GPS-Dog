import React, { Suspense } from "react";
import Layout from "../components/Layout";
import { lazy } from "react";

const MapComponent = lazy(() => import("../components/MapComponent"));

const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "600px" }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

const Map = ({ usuario }) => {
  return (
    <Layout usuario={usuario}>
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <Suspense fallback={<LoadingSpinner />}>
              <MapComponent />
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
