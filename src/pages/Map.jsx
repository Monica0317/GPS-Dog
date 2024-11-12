import React, { Suspense } from "react";
import Layout from "../components/Layout";
import { lazy } from "react";
import { useAuth } from "../context/AuthContext";

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
  const { currentUser } = useAuth();

  return (
    <Layout usuario={usuario}>
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <Suspense fallback={<LoadingSpinner />}>
              {currentUser ? (
                <MapComponent userId={currentUser.uid} />
              ) : (
                <LoadingSpinner />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Map;
