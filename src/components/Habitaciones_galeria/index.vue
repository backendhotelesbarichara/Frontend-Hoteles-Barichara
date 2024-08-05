<script setup>
import { ref, onMounted } from 'vue';
import { useStoreHotel } from '../../stores/hotel.js';
import { useStoreHabitacion } from '../../stores/habitacion.js';

const useHotel = useStoreHotel();
const useHabitacion = useStoreHabitacion();
const hotelInfo = ref("");
const habitacionInfo = ref([])
const imagenSeleccionada = ref("");
const mostrarModal = ref(false);
const cargando = ref(true);

async function getHotelSeleccionado() {
  try {
    const response = await useHotel.getPorId(useHotel.HotelHome);
    cargando.value = false;
    hotelInfo.value = response;
    console.log(hotelInfo);
  } catch (error) {
    console.log(error);
  }
}

async function getHabitaciones() {
  try {
    const response = await useHabitacion.getHabitacionesPorHotel(useHotel.HotelHome);
    habitacionInfo.value = response;
    console.log(habitacionInfo);
  } catch (error) {
    console.log(error);
  }
}

function abrirModal(imagen) {
  imagenSeleccionada.value = imagen;
  mostrarModal.value = true;
}



onMounted(() => {
  getHotelSeleccionado();
  getHabitaciones();
});
</script>

<template>
  <div v-if="cargando" class="d-flex justify-content-center flex-column align-items-center">
    <div class="spinner-border" style="color: #b7642d " role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p>Por favor espere...</p>
  </div>
  <div v-else class="container my-5">
    <h2 class="text-center mb-4 text-uppercase">{{ hotelInfo.nombre }}</h2>
    <p class="text-center text-muted mb-4">{{ hotelInfo.descripcion }}</p>
    <div class="row no-gutters">
      <div v-for="foto in hotelInfo.fotos" :key="foto.url" class="col-md-4">
        <img :src="foto.url" alt="Imagen del hotel" class="img-fluid w-100 h-100" @click="abrirModal(foto.url)"
          data-bs-toggle="modal" data-bs-target="#modalImagen">
      </div>
    </div>
    <div class="row text-center mt-3">
      <div class="col-md-6 mb-3">
        <i class="bi bi-geo-alt-fill"></i> Dirección: {{ hotelInfo.direccion }}
      </div>
      <div class="col-md-6 mb-3">
        <i class="bi bi-telephone-fill"></i> Teléfono: {{ hotelInfo.telefono }}
      </div>
      <div class="col-md-6 mb-3">
        <i class="bi bi-envelope-fill"></i> Correo: {{ hotelInfo.correo }}
      </div>
    </div>

    <div>
      <h2 class="text-center mb-4">HABITACIONES</h2>
      <div class="d-flex justify-content-center">
        <div style="text-align: center; margin-bottom: 25px">
          <div style="margin-bottom: 20px; display: inline-block">
            <div class="input-group">
              <span style="background-color: #b7642d; color: #fff" class="input-group-text" id="addon-wrapping">Fecha de
                ingreso</span>
              <input type="date" class="form-control" />
            </div>
          </div>

          <div style="display: inline-block">
            <div class="input-group">
              <span style="background-color: #b7642d; color: #fff" class="input-group-text" id="addon-wrapping">Fecha
                del
                egreso</span>
              <input type="date" class="form-control" />
            </div>
          </div>

          <button class="btncafe ms-2">Buscar Habitaciones</button>
          <!-- Added the 'ms-2' class for margin -->
        </div>
      </div>
      <div>

        <div class="d-flex flex-column mt-5">
          <div v-for="habitacion in habitacionInfo" :key="habitacion.id" class="mb-4">
            <div class="card">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img :src="habitacion.foto_principal" alt="Imagen de la habitación" class="img-fluid w-100 h-100">
                </div>
                <div class="col-md-8">
                  <div class="card-body">
                    <h4 class="card-title">{{ habitacion.tipo_habitacion[0] }}</h4>
                    <h5 class="card-subtitle mb-2 text-muted"> {{ habitacion.descripcion }}</h5>
                    <p class="card-text">
                      <i class="bi bi-person-fill"></i> x{{ habitacion.cantidad_personas }}
                    </p>
                    <p class="card-text">$ {{ habitacion.precio_noche }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="contenedor-imagenes">
          <!-- Img 1 -->
          <div class="imagen">
            <img src="https://i.ibb.co/tHb1LJf/1.jpg" alt="" />
            <div class="overlay">
              <h2>
                <i class="material-icons" style="margin-top: -2.2px; margin-left: -3px">person</i>
                2
                <i class="material-icons" style="margin-right: -1px; margin-left: 5px">single_bed</i>

                <i class="material-icons" style="margin-right: -1px; margin-left: 5px">single_bed</i>
              </h2>
              <h3 style="
            display: inline-flex;
            align-items: center;
            margin-top: 15px;
            background-color: #b7642d;
            border-radius: 10px;
            padding: 2px;
          ">
                <i class="material-icons" style="margin-right: -5px; margin-left: -5px">attach_money</i>
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
      </div>
    </div>

    <!-- Modal -->
    <!-- Modal -->
    <div class="modal fade" :class="{ 'how': mostrarModal }" id="modalImagen" tabindex="-1" role="dialog"
      aria-labelledby="modalImagenLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <!-- Cambiamos modal-lg por modal-xl para que el modal sea más grande -->
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">

            </button>
          </div>
          <div class="modal-body">
            <img :src="imagenSeleccionada" alt="Imagen del hotel" class="img-fluid w-100">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-size: 2rem;
  color: #b7642d;
}

p {
  font-size: 1.1rem;
}

.bi {
  color: #b7642d;
  margin-right: 8px;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.no-gutters {
  margin-right: 0;
  margin-left: 0;
}

.no-gutters>.col,
.no-gutters>[class*="col-"] {
  padding-right: 0;
  padding-left: 0;
}

.img-fluid {
  object-fit: cover;
  cursor: pointer;
}

.w-100 {
  width: 100%;
}

.h-100 {
  height: 100%;
}

.modal {
  display: none;
}

.modal.show {
  display: block;
}

.btncafe {
  margin-right: 10px;
  border-radius: 50px;
  background-color: #b7642d;
  border-style: none;
  color: #fff;
  padding: 5px;
  margin-left: 5px;
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
  border-radius: 50%;
  /* Hace que el botón sea redondo */
  width: 30px;
  /* Define el ancho del botón */
  height: 30px;
  /* Define la altura del botón */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  /* Tamaño del icono */
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

h3 {
  display: inline-flex;
  align-items: center;
  background-color: #b7642d;
  border-radius: 10px;
  padding: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  /* Agrega la sombra de fondo */
}

@media screen and (max-width: 2000px) {
  .contenedor-imagenes {
    width: 90%;
  }

  .contenedor-imagenes .imagen {
    width: calc(25% - 10px);
    /* Dividir en filas de 4 con espaciado */
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
    width: calc(50% - 10px);
    /* Dividir en filas de 2 con espaciado */
  }

  .overlay {
    height: 100%;
    background-color: #dc773300;
  }
}
</style>