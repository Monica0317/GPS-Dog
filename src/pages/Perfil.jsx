import React, { useState } from "react";
import { Camera, Save, Edit2, X } from "lucide-react";
import Layout from "../components/Layout";

const Perfil = ({ usuario }) => {
  // Estado para los datos de la mascota
  const [petData, setPetData] = useState({
    nombre: "Max",
    raza: "Golden Retriever",
    edad: "3",
    fotourl: "/api/placeholder/150/150",
  });

  const [isEditing, setIsEditing] = useState(false);

  const [tempData, setTempData] = useState(petData);

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { nombre, value } = e.target;
    setTempData((prev) => ({
      ...prev,
      [nombre]: value,
    }));
  };

  // Función para manejar la subida de imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempData((prev) => ({
          ...prev,
          fotourl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para guardar cambios
  const handleSave = () => {
    setPetData(tempData);
    setIsEditing(false);
  };

  // Función para cancelar la edición
  const handleCancel = () => {
    setTempData(petData);
    setIsEditing(false);
  };

  return (
    <Layout usuario={usuario}>
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="card-title">Perfil de la Mascota</h3>
              {!isEditing ? (
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={20} className="me-2" />
                  Editar Perfil
                </button>
              ) : (
                <div className="btn-group">
                  <button className="btn btn-success" onClick={handleSave}>
                    <Save size={20} className="me-2" />
                    Guardar
                  </button>
                  <button className="btn btn-danger" onClick={handleCancel}>
                    <X size={20} className="me-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="row">
              {/* Columna de la foto */}
              <div className="col-md-4 text-center mb-4">
                <div className="position-relative d-inline-block">
                  <img
                    src={isEditing ? tempData.fotourl : petData.fotourl}
                    alt="Foto de la mascota"
                    className="rounded-circle img-thumbnail mb-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  {isEditing && (
                    <div className="position-absolute bottom-0 end-0">
                      <label
                        className="btn btn-primary rounded-circle p-2"
                        style={{ cursor: "pointer" }}
                      >
                        <Camera size={20} />
                        <input
                          type="file"
                          className="d-none"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Columna de los detalles */}
              <div className="col-md-8">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={tempData.nombre}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{petData.nombre}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Raza</label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control"
                        name="raza"
                        value={tempData.raza}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">{petData.raza}</p>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Edad (años)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="edad"
                        value={tempData.edad}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <p className="form-control-plaintext">
                        {petData.edad} años
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
