<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStoreHotel } from '../../stores/hotel.js';
import { useStoreHabitacion } from '../../stores/habitacion.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const useHotel = useStoreHotel();
const useHabitacion = useStoreHabitacion();
const hotelInfo = ref("");
const habitacionInfo = ref([]);
const imagenSeleccionada = ref("");
const mostrarModal = ref(false);
const cargando = ref(true);
const cargandoHabitaciones = ref(true);
const paginaActual = ref(1);
const numHabitacionPag = ref(5);


const totalPages = computed(() => {
  return Math.ceil(habitacionInfo.value.length / numHabitacionPag.value);
});


const paginatedHabitaciones = computed(() => {
  const start = (paginaActual.value - 1) * numHabitacionPag.value;
  const end = start + numHabitacionPag.value;
  return habitacionInfo.value.slice(start, end);
});

async function getHotelSeleccionado() {
  try {
    const response = await useHotel.getPorId(useHotel.HotelHome);
    if (useHabitacion.estatus === 200) {
      cargando.value = false;
      hotelInfo.value = response;
    }
    console.log(hotelInfo);
  } catch (error) {
    console.log(error);
  }
}

async function getHabitaciones() {
  try {
    const response = await useHabitacion.getHabitacionesPorHotel(useHotel.HotelHome);
    if (useHabitacion.estatus === 200) {
      cargandoHabitaciones.value = false;
      habitacionInfo.value = response;
    }
    console.log(habitacionInfo);
  } catch (error) {
    console.log(error);
  }
}

function abrirModal(imagen) {
  imagenSeleccionada.value = imagen;
  mostrarModal.value = true;
}

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
  'dvd': 'bi bi-disc',
};

const getIconClass = (servicio) => {
  return iconosServicios[servicio.toLowerCase()] || 'bi bi-info-circle';
};

async function irDetalleHabitacion(habitacion) {
  useHabitacion.habitacionSelecionada = habitacion
  console.log(useHabitacion.habitacionSelecionada)
  await router.push('/detallehabitaciones')
}

function nextPage() {
  if (paginaActual.value < totalPages.value) {
    paginaActual.value++;
  }
}

function prevPage() {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
}

onMounted(() => {
  getHotelSeleccionado();
  getHabitaciones();
});
</script>


<template>
  <div v-if="cargando" class="d-flex justify-content-center flex-column align-items-center">
    <div class="spinner-border" style="color: #b7642d" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
    <p>Por favor espere...</p>
  </div>
  <div v-else style="padding: 16px; margin-top: 8px; transform: 1s;">
    <div class="Hoteles">
      <h5>INFORMACION HOTEL</h5>
    </div>
    <div class="row no-gutters">
      <div v-for="foto in hotelInfo.fotos" :key="foto.url" class="col-md-4">
        <img :src="foto.url" alt="Imagen del hotel" class="img-fluid w-100 h-100" @click="abrirModal(foto.url)"
          data-bs-toggle="modal" data-bs-target="#modalImagen">
      </div>
    </div>
    <h2 class="text-center mt-4 mb-4 text-uppercase" id="h2">{{ hotelInfo.nombre }}</h2>
    <p class="text-center text-muted mb-4">{{ hotelInfo.descripcion }}</p>

    <div class="row text-center mt-3">
      <div class="col-md-6 mb-3">
        <i class="bi bi-geo-alt-fill"></i>{{ hotelInfo.direccion }}
      </div>
      <div class="col-md-6 mb-3">
        <i class="bi bi-telephone-fill"></i>{{ hotelInfo.telefono }}
      </div>
      <div class="col-md-6 mb-3">
        <i class="bi bi-envelope-fill"></i>{{ hotelInfo.correo }}
      </div>
    </div>

    <div>
      <div class="Hoteles">
        <h5>HABITACIONES</h5>
      </div>
      <div class="d-flex justify-content-center mt-4">
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
                del egreso</span>
              <input type="date" class="form-control" />
            </div>
          </div>

          <button class="btncafe ms-2">Buscar Habitaciones</button>
        </div>
      </div>

      <div v-if="cargandoHabitaciones" class="d-flex justify-content-center flex-column align-items-center">
        <div class="spinner-border" style="color: #b7642d" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando habitaciones...</p>
      </div>
      <div v-else>
        <div class="d-flex flex-column mt-5">
          <div v-for="habitacion in paginatedHabitaciones" :key="habitacion.id" class="mb-4">
            <div class="card h-100" style="overflow: hidden;">
              <div class="row no-gutters h-100">
                <div class="col-md-4 d-flex align-items-center">
                  <img :src="habitacion.imagen_principal" alt="Imagen de la habitación" class="img-fluid w-100"
                    style="object-fit: cover; height: 100%;" @click="irDetalleHabitacion(habitacion)">
                </div>
                <div class="col-md-8 d-flex flex-column justify-content-between">
                  <div class="card-body">
                    <h2 class="card-title text-uppercase">{{ habitacion.tipo_habitacion[0] }}</h2>
                    <h5 class="card-subtitle mb-2 text-muted">{{ habitacion.descripcion }}</h5>
                    <div class="servicios " style="margin-left: 20px">
                      <ul>
                        <li class="fw-bold fs-5" v-for="(servicio, index) in habitacion.servicio.slice(0, 4)" :key="servicio" >
                          <i  :class="getIconClass(servicio)"></i> {{ servicio }}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between gap-5 p-3">
                    <div class="d-flex gap-5">
                      <p class="card-text">
                        <i class="bi bi-person-fill"></i> x{{ habitacion.cantidad_personas }}
                      </p>
                      <p class="card-text"> <span class="fw-bold" style="  color: #b7642d;">$</span> {{ habitacion.precio_noche }}</p>
                    </div>
                    <button class="btn text-light" style="background-color: #b7642d"
                      @click="irDetalleHabitacion(habitacion)">
                      Ver más...
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-center mt-4 pagination-container">
          <button class="btn btn-secondary me-2" @click="prevPage" :disabled="paginaActual === 1">Anterior</button>
          <span class="pagination-info">{{ paginaActual }} / {{ totalPages }}</span>
          <button class="btn btn-secondary ms-2" @click="nextPage"
            :disabled="paginaActual === totalPages">Siguiente</button>
        </div>

      </div>
    </div>

    <!-- Modal -->
    <div class="modal fade" :class="{ 'show': mostrarModal }" id="modalImagen" tabindex="-1" role="dialog"
      aria-labelledby="modalImagenLabel" aria-hidden="true">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
.pagination-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  border: 1px solid #b7642d;
  color: #b7642d;
  background-color: #fff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  background-color: #b7642d;
  color: #fff;
}

.btn:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  border-color: #ced4da;
}

.pagination-info {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 500;
}

@media (max-width: 600px) {
  .pagination-container {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    margin-bottom: 5px;
  }
}

.Hoteles {
  background: linear-gradient(to right, #b7642d, transparent);
  align-items: center;
  border-radius: 10px;
  transition: 1s;
}

h5 {
  margin-left: 5px;
  color: #fff;
}

#h2 {
  font-size: 2rem;
  color: #b7642d;
}

p {
  font-size: 1.1rem;
}

.bi {
  color: #b7642d;
  margin-right: 3px;
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