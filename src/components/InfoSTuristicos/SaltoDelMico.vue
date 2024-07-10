<template>
  <div class="contenedor-imagenes">
    <!-- Img 1 -->
    <div class="imagen">
      <img src="https://i.ibb.co/R77C9hC/1.jpg" alt="" />
    </div>

    <!-- Img 2 -->
    <div class="imagen">
      <img src="https://i.ibb.co/bWNfBGX/salto-del-mico-3.jpg" alt="" />
    </div>

    <!-- Img 3 -->
    <div class="imagen">
      <img
        src="https://i.ibb.co/2YZyyn6/salto-del-mico-portada-1280x720.jpg"
        alt=""
      />
    </div>

    <!-- Img 4 -->
    <div class="imagen">
      <img
        src="https://i.ibb.co/qkZ1NcJ/59654668-447424319135365-1355230976015611055-n.jpg"
        alt=""
      />
    </div>

    <!-- Descripción del sitio -->
    <div class="galeria">
      <div class="Hoteles"><h5>Descripción</h5></div>
      <p style="padding: 10px">
        Salto del Mico: un mirador de ensueño en Barichara. A unos kilómetros de
        Barichara se encuentra uno de los miradores naturales más importantes y
        hermosos del país, el Salto del Mico. Este es el lugar idóneo para vivir
        una aventura y experiencia única.Hoy, te invitamos a visitar este
        maravilloso mirador.
      </p>
      <div class="Hoteles"><h5>Proveedores</h5></div>
    </div>

    <div class="contenedor-proveedores">
      <div class="proveedor">
        <div class="elemento">
          <img
            src="https://th.bing.com/th/id/OIG.IkfOuRHhwhRzXmOnFN9y?pid=ImgGn"
            alt="Imagen 1"
            class="proveedor-imagen"
          />
          <div class="info-proveedor">
            <hr />
            <h6>Nombre:</h6>
            <p style="margin-bottom: 10px">HCulona Barichara</p>
            <h6>Teléfono:</h6>
            <p>3222431444</p>
          </div>
        </div>
      </div>

      <div class="proveedor">
        <div class="elemento">
          <img
            src="https://th.bing.com/th/id/OIG.CO2sHWK_IEYIwzXsC2hX?pid=ImgGn"
            alt="Imagen 1"
            class="proveedor-imagen"
          />
          <div class="info-proveedor">
            <hr />
            <h6>Nombre:</h6>
            <p style="margin-bottom: 10px">SUXpress Barichara</p>
            <h6>Teléfono:</h6>
            <p>3222431444</p>
          </div>
        </div>
      </div>

      <div class="proveedor">
        <div class="elemento">
          <img
            src="https://th.bing.com/th/id/OIG.Z1Z.XXzP91MG18xmF3dm?pid=ImgGn"
            alt="Imagen 1"
            class="proveedor-imagen"
          />
          <div class="info-proveedor">
            <hr />
            <h6>Nombre:</h6>
            <p style="margin-bottom: 10px">Recorridos BCarlos</p>
            <h6>Teléfono:</h6>
            <p>3222431444</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped>
.galeria {
  padding: 16px;
  margin-top: 8px;
}

h5 {
  padding: 5px;
  margin-left: 5px;
  color: #fff;
}

.pro {
  transition: 1s;
}

.pro:hover {
  transition: 1s;
}

.Hoteles {
  background: linear-gradient(to right, #b7642d, transparent);
  align-items: center;
  border-radius: 10px;
  transition: 1s;
}

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }
}

.btn.btn-custom {
  background-color: #b7642d;
  border-radius: 20px;
  color: #fff;
}

hr {
  border: none; /* Quita el borde predeterminado */
  background-color: #b7642d; /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
  height: 2px; /* Define el grosor de la línea horizontal */
  margin: 5px 0; /* Añade margen superior e inferior para separar del contenido */
}

body {
  margin: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

.contenedor-imagenes {
  display: flex;
  width: 100%;
  margin: auto;
  justify-content: space-around;
  flex-wrap: wrap;
  border-radius: 10px;
}

.contenedor-imagenes .imagen {
  width: 32%;
  position: relative;
  height: 250px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.contenedor-proveedores {
  display: flex;
  max-width: 1200px; /* Ancho máximo del contenedor */
  margin: auto;
  justify-content: space-around;
  /* flex-wrap: wrap; */
  border-radius: 10px;
  gap: 5px;
  margin-left: 5px;
  margin-right: 5px;
}

.proveedor {
  width: 40%;
  position: relative;
  margin-bottom: 5px;
  border-radius: 10px;
}

.elemento {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  height: 100%; /* Contenedor crecerá automáticamente para adaptarse al contenido */
}

.proveedor-imagen {
  width: 100%;
  max-height: 100px; /* Tamaño fijo para la imagen */
  object-fit: cover;
  overflow: hidden; /* Para manejar el desbordamiento de la imagen */
  border-radius: 10px;
  border-style: solid;
  border-color: #b7642d5b;
}

.info-proveedor {
  flex: 1;
  padding: 10px 0;
  overflow: hidden; /* Para manejar el desbordamiento del texto */
}

.info-proveedor h6 {
  margin: 0;
}

.info-proveedor p {
  margin: 0;
}

p {
  font-size: 15px;
}

h6 {
  font-weight: bold;
  color: #3c3c3c;
}

@media screen and (min-width: 1000px) {
  .contenedor-imagenes {
    width: 60%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px); /* Dividir en filas de 4 con espaciado */
  }

  .contenedor-proveedores {
    display: flex;

    margin: auto;
    justify-content: space-around;
    /* flex-wrap: wrap; */
    border-radius: 10px;
    gap: 20px;
    margin-left: 5px;
    margin-right: 5px;
  }
}

@media screen and (min-width: 900px) {
  .contenedor-imagenes {
    width: 90%;
  }
  .contenedor-imagenes .imagen {
    width: 48%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px);
    /* width: calc(50% - 10px); Dividir en filas de 2 con espaciado */
  }
}

@media screen and (min-width: 800px) {
  .contenedor-imagenes {
    width: 90%;
  }
  .contenedor-imagenes .imagen {
    width: 48%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px);
    /* width: calc(50% - 10px); Dividir en filas de 2 con espaciado */
  }
}

@media screen and (min-width: 600px) {
  .contenedor-imagenes {
    width: 90%;
  }
  .contenedor-imagenes .imagen {
    width: 48%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px);
    /* width: calc(50% - 10px); Dividir en filas de 2 con espaciado */
  }
}

@media screen and (max-width: 600px) {
  .contenedor-imagenes {
    width: 100%;
  }
  .contenedor-imagenes .imagen {
    width: 80%;
  }

  .contenedor-imagenes .imagen {
    /* width: calc(33.333% - 10px); Dividir en filas de 3 con espaciado */
    width: calc(50% - 10px); /* Dividir en filas de 2 con espaciado */
  }
}
</style>
