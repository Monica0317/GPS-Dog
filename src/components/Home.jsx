import React from "react";

const Home = ({ usuario }) => {
    return (
        <div>
            <h2>Bienvenido {usuario.displayName ? usuario.displayName : usuario.email}</h2>
        </div>
    );
};

export default Home;
