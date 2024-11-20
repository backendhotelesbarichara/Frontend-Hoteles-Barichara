<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStoreHotel } from '../../stores/hotel.js';
import { useStoreHabitacion } from '../../stores/habitacion.js';
import { useStoreReserva } from '../../stores/reserva.js'
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const useHotel = useStoreHotel();
const useHabitacion = useStoreHabitacion();
const useReserva = useStoreReserva();
const idHotel = ref('');
const hotelInfo = ref("");
const habitacionInfo = ref([]);
const fechaIngreso = ref();
const fechaEgreso = ref();
const imagenSeleccionada = ref("");
const mostrarModal = ref(false);
const mostrarTodo = ref(false);
const cargando = ref(true);
const cargandoHabitaciones = ref(true);
const paginaActual = ref(1);
const numHabitacionPag = ref(5);
const adults = ref(1);
const children = ref(0);
const totalPersona = ref();
const minDate = ref(obtenerFechaActual());

function obtenerFechaActual() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}
async function getHotelSeleccionado(id) {
  try {
    const response = await useHotel.getPorId(id);
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
      habitacionInfo.value = response;
    }
    console.log(habitacionInfo);
  } catch (error) {
    console.log(error);
  }
}

const filtrarHabitacion = async () => {

  const filters = {
    idHotel: useHotel.HotelHome || null,
    cantidad_personas: totalPersona.value || null,
  };

  try {
    console.log("filtros nav ", filters);
    const filteredHabitaciones = await useHabitacion.getHabitacionesPorCantPerson(filters);
    useHabitacion.habitacionesFiltradas = filteredHabitaciones.filter(habitacion => habitacion.disponible === true);
    console.log('Habitaciones filtrados:', filteredHabitaciones);
  } catch (error) {
    console.error("Error al filtrar habitaciones:", error);
  } finally {
    cargandoHabitaciones.value = false;
  }
}

//Abrir imagen con modal

function abrirModal(imagen) {
  imagenSeleccionada.value = imagen;
  mostrarModal.value = true;
}

//Calcular noches y formatear precio x noche

const numeroDeNoches = computed(() => {
  if (fechaIngreso.value && fechaEgreso.value) {
    useReserva.fechaIngreso = fechaIngreso.value;
    useReserva.fechaEgreso = fechaEgreso.value;

    const diffTime = Math.abs(new Date(fechaEgreso.value) - new Date(fechaIngreso.value));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

function calcularPrecioTotal(habitacion, personas) {
  const total = habitacion.precio_noche * numeroDeNoches.value * personas;
  return formatCurrency(total);
}


const formatCurrency = (amount) => {
  // Formatea el número usando locales para obtener el formato correcto sin el símbolo de dólar
  const formattedAmount = amount.toLocaleString('es-CO');
  return `COP ${formattedAmount}`;
};

//Filtrar habitaciones e incrementar/disminuir cantidad adultos y ninos

const closeDropdown = () => {
  filtrarHabitacion();
};

const incrementarAdultos = () => {
  adults.value++
};

const disminuirAdultos = () => {
  if (adults.value > 1) adults.value--
};

const aumentarNinos = () => {
  children.value++
};

const disminuirNinos = () => {
  if (children.value > 0) children.value--
};

//Funcion para los iconos

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

function toggleMostrar() {
  mostrarTodo.value = !mostrarTodo.value;
}

//Función ir detalle habitacion
async function irDetalleHabitacion(idHabitacion) {

  const url = router.resolve({ path: '/detallehabitaciones', query: { id: idHabitacion } }).href;
  window.open(url, '_blank');
}

//Funciones paginacion habitaciones

const totalPages = computed(() => {
  if (useHabitacion.habitacionesFiltradas) {
    return Math.ceil(useHabitacion.habitacionesFiltradas.length / numHabitacionPag.value);
  }
});

const paginatedHabitaciones = computed(() => {
  const start = (paginaActual.value - 1) * numHabitacionPag.value;
  const end = start + numHabitacionPag.value;
  if (useHabitacion.habitacionesFiltradas) {
    return useHabitacion.habitacionesFiltradas.slice(start, end);
  }
});


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

//Pluralizar palabra 

const pluralize = (count, singular) => {
  return count === 1 ? singular : `${singular}s`;
};

//Ver cambios en cada variable

watch([adults, children], ([newAdults, newChildren]) => {
  totalPersona.value = newAdults + newChildren;
  cargandoHabitaciones.value = true;
  filtrarHabitacion();
  useReserva.adultos = newAdults;
  useReserva.ninos = newChildren;
});

watch([fechaIngreso, fechaEgreso], ([newFechaIngreso, newFechaEgreso]) => {
  if (fechaIngreso.value && fechaEgreso.value) {
    useReserva.fechaIngreso = fechaIngreso.value;
    useReserva.fechaEgreso = fechaEgreso.value;
    const diffTime = Math.abs(new Date(fechaEgreso.value) - new Date(fechaIngreso.value));
    useReserva.numero_noche = diffTime / (1000 * 60 * 60 * 24);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

function chunkArray(array, size) {
  const chunkedArr = [];
  for (let i = 0; i < array.length; i += size) {
    chunkedArr.push(array.slice(i, i + size));
  }
  return chunkedArr;
}


onMounted(async () => {
  const Hotel = route.query.id;
  if (Hotel) {
    idHotel.value = Hotel;
    await getHotelSeleccionado(Hotel);
  }


  const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  adults.value = 1;
  children.value = 0;
  useReserva.adultos = 1;
  useReserva.ninos = 0;
  fechaIngreso.value = today;
  fechaEgreso.value = tomorrowFormatted;
  useHabitacion.fechaEgreso = fechaEgreso.value;

  getHabitaciones();
  filtrarHabitacion();
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
      <h5 id="h5">INFORMACION HOTEL</h5>
    </div>
    <div class="row no-gutters">
      <div v-for="foto in hotelInfo.fotos.slice(0,3)" :key="foto.url" class="col-md-4">
        <img :src="foto.url" alt="Imagen del hotel" class="img-fluid w-100 h-100" @click="abrirModal(foto.url)"
          data-bs-toggle="modal" data-bs-target="#modalImagen">
      </div>
    </div>
    <!-- HTML -->
    <div class="logo-title-container">
      <img v-if="hotelInfo.logo" :src="hotelInfo.logo" alt="Logo del hotel" class="logo">
      <h2 class="title">{{ hotelInfo.nombre }}</h2>
    </div>


    <p class="text-center text-muted mb-4">{{ hotelInfo.descripcion }}</p>

    <div class="text-center">
      <p class="text-h5 fw-bold text-uppercase">Servicios del hotel</p>
      <p>El Hotel {{ hotelInfo.nombre }} cuenta con los siguientes servicios:</p>

      <div class="servicios"
        style="  display: flex; flex-wrap: wrap; justify-content: center; list-style: none; padding: 0; margin: 0;">
        <ul>
          <li class="fw-bold" v-for="servicio in hotelInfo.servicio" :key="servicio">
            <i class="bi bi-check-circle-fill" id="bi"></i>{{ servicio }}
          </li>
        </ul>
      </div>
    </div>

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
        <h5 id="h5">HABITACIONES</h5>
      </div>
      <div class="d-flex justify-content-center mt-4">
        <div style="text-align: center; margin-bottom: 25px; gap: 10px;">
          <div style="display: inline-block">
            <div class="input-group">
              <span style="background-color: #b7642d; color: #fff" class="input-group-text" id="addon-wrapping">Fecha de
                ingreso</span>
              <input type="date" class="form-control" v-model="fechaIngreso" :min="minDate" />
            </div>
          </div>

          <div style="display: inline-block; margin: 0px 15px;">
            <div class="input-group">
              <span style="background-color: #b7642d; color: #fff" class="input-group-text" id="addon-wrapping">Fecha
                del egreso</span>
              <input type="date" class="form-control" v-model="fechaEgreso" :min="minDate" />
            </div>
          </div>

          <div class="form-group" style="display: inline-block;">
            <div class="input-group">
              <span style="background-color: #b7642d; color: #fff" class="input-group-text" id="addon-wrapping">
                Cantidad Personas
              </span>
              <!-- Botón que abre el dropdown -->
              <div class="btn-group">
                <button class="form-control" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  {{ adults }} {{ pluralize(adults, 'Adulto') }} · {{ children }} {{ pluralize(children, 'Niño') }}
                </button>
                <!-- Contenido del dropdown -->
                <ul class="dropdown-menu p-3" style="min-width: 15rem;">
                  <!-- Controles para adultos -->
                  <li>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span>Adultos</span>
                      <div>
                        <!-- Se añade .stop para prevenir el cierre del dropdown al hacer clic -->
                        <button class="btn btn-outline-secondary" @click.stop="disminuirAdultos">-</button>
                        <span class="mx-2">{{ adults }}</span>
                        <button class="btn btn-outline-secondary" @click.stop="incrementarAdultos">+</button>
                      </div>
                    </div>
                  </li>
                  <!-- Controles para niños -->
                  <li>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span>Niños</span>
                      <div>
                        <button class="btn btn-outline-secondary" @click.stop="disminuirNinos">-</button>
                        <span class="mx-2">{{ children }}</span>
                        <button class="btn btn-outline-secondary" @click.stop="aumentarNinos">+</button>
                      </div>
                    </div>
                  </li>
                  <!-- Botón "Listo" -->
                  <li>
                    <div class="text-center">
                      <!-- Aquí puedes permitir que el dropdown se cierre con un clic en el botón "Listo" -->
                      <button class="btn btn-primary btn-block mt-2" @click="closeDropdown">Listo</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- <button class="btncafe ms-2" @click="calcularPrecioTotal">Buscar Habitaciones</button> -->
        </div>
      </div>


      <div v-if="useHabitacion.habitacionesFiltradas.length === 0" class="no-salones">
        <p>No se encontraron habitaciones...</p>
      </div>
      <div v-if="cargandoHabitaciones" class="d-flex justify-content-center flex-column align-items-center">
        <div class="spinner-border" style="color: #b7642d" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando habitaciones...</p>
      </div>
      <div v-else>
        <div class="row mt-5">
          <div v-for="habitacion in paginatedHabitaciones" :key="habitacion.id" class="col-md-4 mb-4">
            <div class="card h-100" style="overflow: hidden;">
              <img :src="habitacion.imagenes[0].url" alt="Imagen de la habitación" class="card-img-top"
                @click="irDetalleHabitacion(habitacion._id)">
              <div class="card-body">
                <h5 class="card-title text-uppercase">{{ habitacion.tipo_habitacion[0] }}</h5>
                <p class="card-text">{{ habitacion.descripcion }}</p>
                <div class="servicios" style="margin-left: 20px">
                  <ul>
                    <li class="fw-bold fs-5" v-for="(servicio, index) in habitacion.servicio.slice(0, 4)"
                      :key="servicio">
                      <i class="bi bi-check-circle-fill"></i> {{ servicio }}
                    </li>
                  </ul>
                </div>
              </div>
              <div class="card-footer">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex gap-5">
                    <p class="card-text">
                      <i class="bi bi-person-fill"></i> Máximo {{ habitacion.cantidad_personas }}
                    </p>
                    <p class="card-text">
                      <span class="fw-bold" style="color: #b7642d;">$</span> {{ habitacion.precio_noche }} x noche
                    </p>
                  </div>
                </div>
                <div class="price-breakdown mt-3">
                  <h6>Tarifa por ocupación:</h6>
                  <ul style="margin: 0;">
                    <!-- Mostrar solo los primeros 2 elementos cuando mostrarTodo es false -->
                    <li
                      v-for="(personas, index) in Array.from({ length: habitacion.cantidad_personas }, (_, i) => i + 1)"
                      :key="personas" v-show="mostrarTodo || index < 2" style="list-style: none;">
                      <p>
                        <i class="bi bi-person"></i>
                        <span class="fw-bold" style="color: #b7642d">
                          x{{ personas }} {{ calcularPrecioTotal(habitacion, personas) }}
                        </span>
                        Total para {{ numeroDeNoches }} noche(s)
                      </p>
                    </li>
                  </ul>

                  <!-- Botón de toggle para mostrar/ocultar según el estado de mostrarTodo -->
                  <div style="display: flex; justify-content: center;">
                    <button v-if="habitacion.cantidad_personas > 2" @click="toggleMostrar" class="btn-transparent">
                      {{ mostrarTodo ? 'Ocultar tarifas' : 'Ver más tarifas...' }} <i
                        :class="mostrarTodo ? 'bi bi-arrow-up' : 'bi bi-arrow-down'"></i>
                    </button>
                  </div>

                </div>

                <div class="container-boton" style="display: flex; justify-content: end;">
                  <button class="btn btn-primary row justify-content-end mt-2"
                    @click="irDetalleHabitacion(habitacion._id)">Ver
                    más...</button>
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
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  object-fit: cover;
  height: 200px;

}

.card-title {
  font-weight: bold;
  color: #b7642d;
}

.card-text {
  color: #333;
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

/* CSS */
.logo-title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 30px;
}

.logo {
  max-width: auto;
  max-height: 150px;
}

.title {
  margin: 0;
  font-size: 2rem;
  color: #b7642d;
}

.table-servicios {
  width: 20%;
  margin: 0 auto;
  text-align: center;
}

.table-servicios td {
  padding: 10px;
  vertical-align: middle;
}


.pagination-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  border: 1px solid #b7642d;
  color: #fff;
  background-color: #b7642d;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s, color 0.3s;
}

.btn:hover {
  background-color: #fff;
  color: #b7642d;
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
  .container-boton {
    width: 100%;
    display: flex;
    justify-content: center;
  }

}

.Hoteles {
  background: linear-gradient(to right, #b7642d, transparent);
  align-items: center;
  border-radius: 10px;
  transition: 1s;
}

#h5 {
  padding: 8px;
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



.btn-transparent {
  background-color: transparent;
  border: none;
  color: #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-transparent:hover {
  font-weight: bold;
  color: #8b5a24;
}

.btn-transparent i {
  margin-left: 5px;
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

.dropdown-menu {
  width: 100%;
  max-width: 300px;
}

input.form-control {
  cursor: pointer;
}

.no-salones {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: rgb(0, 0, 0);
  text-align: center;
  font-weight: bold;
}

.no-salones p {
  font-size: 1.5em;
  margin-top: 10px;
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