<template>
  <div class="contenedor-imagenes">
    <!-- Img 1 -->
    <div class="imagen">
      <img src="https://i.ibb.co/tHb1LJf/1.jpg" alt="" />
    </div>

    <!-- Img 2 -->
    <div class="imagen">
      <img src="https://i.ibb.co/pJ6qLXF/2.jpg" alt="" />
    </div>

    <!-- Img 3 -->
    <div class="imagen">
      <img src="https://i.ibb.co/Wc2V1GJ/3.jpg" alt="" />
    </div>

    <!-- Img 4 -->
    <div class="imagen">
      <img src="https://i.ibb.co/G2ys4Pv/4.jpg" alt="" />
    </div>

    <!-- Descripción de la habitación -->
    <main>
      <h1>Detalle de habitacion</h1>
      <div class="galeria">
        <div class="Hoteles"><h5>Descripción</h5></div>
        <p style="padding: 10px">
          Esta es una habitación espaciosa con todas las comodidades que
          necesitas para una estancia confortable. Cuenta con una cama
          king-size, baño privado, televisión de pantalla plana y minibar.
          Además, ofrece hermosas vistas al jardín.
        </p>

        <div class="Hoteles"><h5>Servicios</h5></div>

        <div style="margin-top: 20px; margin-bottom: -20px" class="container">
          <div class="Lista">
            <div class="row">
              <div class="col-md-3 col-6">
                <ul class="list-unstyled">
                  <li><i class="bi bi-lock-fill"></i> Baño privado</li>
                  <li><i class="bi bi-wind"></i> Ventiladores</li>
                </ul>
              </div>
              <div class="col-md-3 col-6">
                <ul class="list-unstyled">
                  <li><i class="bi bi-backpack4-fill"></i> Closet</li>
                  <li><i class="bi bi-wifi"></i> WiFi</li>
                </ul>
              </div>
              <div class="col-md-3 col-6">
                <ul class="list-unstyled">
                  <li><i class="bi bi-tv-fill"></i> TV</li>
                  <li>
                    <i class="bi bi-thermometer-snow"></i> Aire AC
                  </li>
                </ul>
              </div>
              <div class="col-md-3 col-6">
                <ul class="list-unstyled">
                  <li><i class="bi bi-trash3-fill"></i> Servicio de aseo</li>
                  <li><i class="bi-currency-dollar"></i> 50.000</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <hr />

  <div>
    <center>
      <button
        @click="mostrarReserva"
        class="btn btn-custom"
        v-if="!mostrarFormulario"
      >
        <i class="bi bi-backpack2-fill"></i> Reservar
      </button>
    </center>

    <!-- Sección de reserva que se muestra u oculta con v-if -->
    <div v-if="mostrarFormulario" class="mt-3">
      <form style="padding-left: 30px; padding-right: 30px">
        <div
          style="
            background-color: #b7642d14;
            border-radius: 10px;
            font-size: 12px;
          "
          class="row"
        >
          <div class="col-4 mb-2">
            <label for="nombre">Nombre:</label>
            <input
              style="height: 30px; font-size: 12px"
              type="text"
              id="nombre"
              name="nombre"
              class="form-control"
              required
            />
          </div>

          <div class="col-4 mb-2">
            <label for="numero">Número:</label>
            <input
              style="height: 30px; font-size: 12px"
              type="text"
              id="numero"
              name="numero"
              class="form-control"
              required
            />
          </div>

          <div class="col-4 mb-2">
            <label for="correo">Correo:</label>
            <input
              style="height: 30px; font-size: 12px"
              type="email"
              id="correo"
              name="correo"
              class="form-control"
              required
            />
          </div>
        </div>
        <center>
          <button
            style="margin-top: 15px; margin-right: 10px"
            type="submit"
            class="btn btn-customwhat"
          >
            <i class="bi bi-whatsapp"></i>
            Ir a Whatsapp
          </button>

          <button
            style="margin-top: 15px"
            type="button"
            class="btn btn-custom"
            @click="cancelarReserva"
          >
            <i class="bi bi-x-circle"></i>
            Cancelar
          </button>
        </center>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mostrarFormulario: false,
    };
  },
  methods: {
    mostrarReserva() {
      this.mostrarFormulario = true;
    },
    cancelarReserva() {
      this.mostrarFormulario = false;
    },
  },
};
</script>

<style scoped>
hr {
  border: none; /* Quita el borde predeterminado */
  background-color: #b7642d; /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
  height: 2px; /* Define el grosor de la línea horizontal */
}

.galeria {
  padding: 16px;
  margin-top: 8px;
}

h5 {
  padding: 5px;
  margin-left: 5px;
  color: #fff;
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

h6 {
  color: #000000;
}

h6 p {
  color: #000000a7;
}

.btn.btn-custom {
  background-color: #b7642d;
  border-radius: 20px;
  color: #fff;
}

.btn.btn-customwhat {
  background-color: #10bd10;
  border-radius: 20px;
  color: #fff;
}

hr {
  border: none; /* Quita el borde predeterminado */
  background-color: #b7642d; /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
  height: 2px; /* Define el grosor de la línea horizontal */
  margin: 20px 0; /* Añade margen superior e inferior para separar del contenido */
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

.imagen:hover .overlay {
  height: 100%;
  cursor: pointer;
}

@media screen and (min-width: 1000px) {
  .contenedor-imagenes {
    width: 60%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px); /* Dividir en filas de 4 con espaciado */
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
    /* width: calc(33.333% - 10px); Dividir en filas de 3 con espaciado */
    width: calc(25% - 10px); /* Dividir en filas de 2 con espaciado */
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
