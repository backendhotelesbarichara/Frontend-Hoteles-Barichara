<template>
  <!-- Fecha de ingreso, fecha de salida -->

  <div style="text-align: center; margin-bottom: 25px">
    <div style="margin-bottom: 20px; display: inline-block">
      <div class="input-group">
        <span
          style="background-color: #b7642d; color: #fff"
          class="input-group-text"
          id="addon-wrapping"
          >Fecha de ingreso</span
        >
        <input type="date" class="form-control" />
      </div>
    </div>

    <div style="display: inline-block">
      <div class="input-group">
        <span
          style="background-color: #b7642d; color: #fff"
          class="input-group-text"
          id="addon-wrapping"
          >Fecha del egreso</span
        >
        <input type="date" class="form-control" />
      </div>
    </div>
    
  </div>
  <div class="row"><button class="btncafe">Buscar Habitaciones Disponibles </button></div>

  <!-- Contenedor de habitaciones -->
  <h1>GALERIA DE HABITACIONES DISPONIBLES</h1>
  <div class="contenedor-imagenes">
    <!-- Img 1 -->
    <div class="imagen">
      <img src="https://i.ibb.co/tHb1LJf/1.jpg" alt="" />
      <div class="overlay">
        <h2
          style="
            display: inline-flex;
            align-items: center;
            background-color: ##b7642d;
            border-radius: 10px;
            padding: 2px;
          "
        >
          <i
            class="material-icons"
            style="margin-top: -2.2px; margin-left: -3px"
            >person</i
          >
          2
          <i class="material-icons" style="margin-right: -1px; margin-left: 5px"
            >single_bed</i
          >

          <i class="material-icons" style="margin-right: -1px; margin-left: 5px"
            >single_bed</i
          >
        </h2>
        <h3
          style="
            display: inline-flex;
            align-items: center;
            margin-top: 15px;
            background-color: #b7642d;
            border-radius: 10px;
            padding: 2px;
          "
        >
          <i
            class="material-icons"
            style="margin-right: -5px; margin-left: -5px"
            >attach_money</i
          >
          50.000
        </h3>

        <router-link class="link" to="/detallehabitaciones">
          <button type="button" class="btn btn-light round-btn">
            <i class="material-icons">add</i>
          </button>
        </router-link>
      </div>
    </div>


  </div>
</template>

<style scoped>

.btncafe{
  margin-right: 10px;
  border-radius: 50px;
  background-color: #b7642d;
  border-style: none;
  color: #fff;
  padding: 5px;
  margin-left: 5px;
}

body {
  margin: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

/* Estilos por defecto */

/* .galeria{
          font-family:'open sans';
      } */

/* .galeria h1{
          text-align: center;
          margin: 20px 0 15px 0;
          font-weight: 300px;
      } */

/* .linea{
          border-top: 5px solid #dc7633;
          margin-bottom: 40px;
      } */

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
  box-shadow: 0px 0px 3px 0px rgb(0, 0, 0, 0.75);
  border-radius: 10px;
}

.imagen img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #b7642d72;
  width: 100%;
  height: 0%;
  transition: 0.5s ease;
  overflow: hidden;
}

.overlay button {
  color: #fff;
  font-weight: 30;
  font-size: 20px;
  position: absolute;
  top: 92%;
  right: -10px;
  text-align: center;
  transform: translate(-50%, -50%);
}

.round-btn {
  border-radius: 50%; /* Hace que el botón sea redondo */
  width: 30px; /* Define el ancho del botón */
  height: 30px; /* Define la altura del botón */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px; /* Tamaño del icono */
  background-color: #b7642d72;
  border-style: none;
}

.overlay h2 {
  color: #fff;
  font-weight: 30;
  font-size: 20px;
  position: absolute;
  top: 60%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.overlay h3 {
  color: #fff;
  font-weight: 30;
  font-size: 20px;
  position: absolute;
  top: 35%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

/* .overlay h4 {
        color: #fff;
        font-weight: 30;
        font-size: 20px;
        position: absolute;
        top: 5%;
        left: 50%;
        text-align: center;
        transform: translate(-50%, -50%);
      } */

.imagen:hover .overlay {
  height: 100%;
  cursor: pointer;
}

h2 {
  display: inline-flex;
  align-items: center;
  background-color: #b7642d;
  border-radius: 10px;
  padding: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Agrega la sombra de fondo */
}

h3 {
  display: inline-flex;
  align-items: center;
  background-color: #b7642d;
  border-radius: 10px;
  padding: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Agrega la sombra de fondo */
}

@media screen and (max-width: 2000px) {
  .contenedor-imagenes {
    width: 90%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px); /* Dividir en filas de 4 con espaciado */
  }
}

@media screen and (max-width: 800px) {
  .contenedor-imagenes {
    width: 90%;
  }
  .contenedor-imagenes .imagen {
    width: 48%;
  }

  .contenedor-imagenes .imagen {
    width: calc(33.333% - 10px);
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

  .overlay {
    height: 100%;
    background-color: #dc773300;
  }
}
</style>
