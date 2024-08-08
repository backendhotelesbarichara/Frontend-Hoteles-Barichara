<script setup>
import { ref } from 'vue';
import { useStoreHabitacion } from '../../stores/habitacion.js';

const useHabitacion = useStoreHabitacion();
const habitacionDetalle = ref(useHabitacion.habitacionSelecionada);
const mostrarFormulario = ref(false);
const imagenSeleccionada = ref(''); // Reference for the selected image

console.log("hola soy h", habitacionDetalle);

const mostrarReserva = () => {
  mostrarFormulario.value = true;
};

const cancelarReserva = () => {
  mostrarFormulario.value = false;
};

const abrirModal = (url) => {
  imagenSeleccionada.value = url;
  const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
  modal.show();
};

const iconosServicios = {
  'televisor': 'bi bi-tv',
  'wi-fi': 'bi bi-wifi',
  'cocina': 'bi bi-egg-fried',
  'baño': 'bi bi-droplet',
  'ducha': 'bi bi-droplet',
  'jacuzzi': 'bi bi-droplet-half',
  'aire acondicionado': 'bi bi-snow',
  'calefacción': 'bi bi-thermometer',
  'servicio de habitación': 'bi bi-bell',
  'minibar': 'bi bi-cocktail',
  'caja fuerte': 'bi bi-safe',
  'escritorio': 'bi bi-laptop',
  'silla de ruedas': 'bi bi-wheelchair',
  'acceso a internet': 'bi bi-globe',
  'teléfono': 'bi bi-phone',
  'radio': 'bi bi-broadcast',
  'alarma de incendios': 'bi bi-alarm',
  'xbox': 'bi bi-controller',
};

const getIconClass = (servicio) => {
  return iconosServicios[servicio.toLowerCase()] || 'bi bi-info-circle';
};
</script>


<template>
  <div>
    <div class="contenedor-imagenes">
      <div class="d-flex flex-row gap-1">
        <div v-for="foto in habitacionDetalle.imagenes" :key="foto.url" class="flex-fill" @click="abrirModal(foto.url)">
          <img :src="foto.url" alt="Imagen del hotel" class="img-fluid" style="cursor: pointer;" />
        </div>
      </div>

      <main class="w-100">
        <h1 class="text-uppercase text-center">{{ habitacionDetalle.tipo_habitacion[0] }}</h1>
        <div class="galeria">
          <div class="Hoteles w-100">
            <h5>Descripción</h5>
          </div>
          <p style="padding: 10px;">
            {{ habitacionDetalle.descripcion }}
          </p>

          <div class="Hoteles w-100">
            <h5>Servicios</h5>
          </div>

          <div class="servicios text-center">
            <ul>
              <li class="fw-bold" v-for="servicio in habitacionDetalle.servicio" :key="servicio">
                <i :class="getIconClass(servicio)"></i> {{ servicio }}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
    <hr />

    <div>
      <div class="text-center">
        <button @click="mostrarReserva" class="btn btn-custom" v-if="!mostrarFormulario">
          <i class="bi bi-backpack2-fill"></i> Reservar
        </button>
      </div>

      <div v-if="mostrarFormulario" class="container">
        <form style="padding-left: 30px; padding-right: 30px">
          <div style="background-color: #b7642d14; border-radius: 10px; font-size: 12px;" class="row">
            <p class="fw-bold fs-5">Por favor digite los siguientes datos:</p>

            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="fw-bold fs-5 mb-2" for="nombre">Nombre:</label>
                <input style="height: 40px; font-size: 12px" type="text" id="nombre" name="nombre" class="form-control"
                  placeholder="Ingrese su nombre.." required />
              </div>

              <div class="col-md-6 mb-2">
                <label class="fw-bold fs-5 mb-2" for="apellido">Apellido:</label>
                <input style="height: 40px; font-size: 12px" type="text" id="apellido" name="apellido"
                  class="form-control" placeholder="Ingrese su apellido.." required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="fw-bold fs-5 mb-2" for="telefono">Teléfono:</label>
                <input style="height: 40px; font-size: 12px" type="number" id="telefono" name="telefono"
                  class="form-control" placeholder="Ingrese su teléfono.." required />
              </div>

              <div class="col-md-6 mb-2">
                <label class="fw-bold fs-5 mb-2" for="correo">Correo:</label>
                <input style="height: 40px; font-size: 12px" type="email" id="correo" name="correo" class="form-control"
                  placeholder="Ingrese su correo.." required />
              </div>
            </div>
          </div>

          <div class="text-center">
            <button style="margin-top: 15px; margin-right: 10px" type="submit" class="btn btn-customwhat">
              <i class="bi bi-whatsapp"></i> Ir a Whatsapp
            </button>

            <button style="margin-top: 15px" type="button" class="btn btn-custom" @click="cancelarReserva">
              <i class="bi bi-x-circle"></i> Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>


    <!-- Modal --> 
    <div
      class="modal fade"
      id="modalImagen"
      tabindex="-1"
      aria-labelledby="modalImagenLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalImagenLabel">Imagen</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <img
              :src="imagenSeleccionada"
              alt="Imagen del hotel"
              class="img-fluid"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
form {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
}

form label {
  font-weight: bold;
  margin-bottom: 5px;
}

form input {
  height: 40px;
  font-size: 12px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
}

form button {
  background-color: #b7642d;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

form button:hover {
  background-color: #b7642d90;
}

.form-control {
  width: 100%;
  margin-bottom: 20px;
}

.servicios ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  margin: 0;
}

.servicios li {
  width: 50%; 
  margin-bottom: 10px;
  display: flex; 
  align-items: center; 
}

.servicios li i {
  margin-right: 8px; 
}

hr {
  border: none;
  background-color: #b7642d;
  height: 2px;
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
  border: none;
  /* Quita el borde predeterminado */
  background-color: #b7642d;
  /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
  height: 2px;
  /* Define el grosor de la línea horizontal */
  margin: 20px 0;
  /* Añade margen superior e inferior para separar del contenido */
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
    width: calc(25% - 10px);
    /* Dividir en filas de 4 con espaciado */
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
    width: calc(25% - 10px);
    /* Dividir en filas de 2 con espaciado */
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
    width: calc(50% - 10px);
    /* Dividir en filas de 2 con espaciado */
  }
}
</style>
