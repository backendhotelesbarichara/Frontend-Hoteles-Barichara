<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStoreHabitacion } from '../../stores/habitacion.js';
import { useStoreReserva } from '../../stores/reserva.js';
import { useRouter, useRoute } from 'vue-router';

const useHabitacion = useStoreHabitacion();
const useReserva = useStoreReserva();
const habitacionDetalle = ref();
const imagenSeleccionada = ref('');
const idHabitacion = ref('');
const nombre = ref('');
const identificacion = ref('');
const telefono = ref('');
const email = ref('');
const noches = ref('');
const cantidad_adulto = ref(useReserva.adultos);
const cantidad_nino = ref(useReserva.ninos);
const fechaEntrada = ref(useReserva.fechaIngreso);
const fechaSalida = ref(useReserva.fechaEgreso);
const totalReserva = ref('');
const tituloForm = ref('Formulario de Reserva');
const mensaje = ref("Hola, vi su hotel en Hoteles Barichara y estoy interesado en hospedarme allí. ¿Podrían enviarme más información sobre la habitación que escogí y sus respectivas tarifas? Muchas gracias.");
const minDate = ref(obtenerFechaActual());
const router = useRouter();
const route = useRoute();
const loading = ref(false);
const notificacionVisible = ref(false);
console.log("hola soy h", habitacionDetalle);


const abrirModal = (url) => {
  imagenSeleccionada.value = url;
  const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
  modal.show();
};

const enviarFormulario = async () => {
  loading.value = true;
  const data = {
    nombre_cliente: nombre.value,
    cedula_cliente: identificacion.value,
    telefono_cliente: telefono.value,
    correo_cliente: email.value,
    fecha_entrada: fechaEntrada.value,
    fecha_salida: fechaSalida.value,
    cantidad_noches: numeroDeNoches.value,
    cantidad_adulto: cantidad_adulto.value,
    cantidad_nino: cantidad_nino.value,
    costo_total: totalReserva.value,
    mensaje: mensaje.value,
    idHabitacion: habitacionDetalle.value._id,
  };

  console.log("soy data a enviar", data);
  try {
    const response = await useReserva.crearReserva(data);
    if (useReserva.estatus === 200) {
      console.log("Reserva enviada");
      notificacionVisible.value = true;
      setTimeout(() => {
        notificacionVisible.value = false;
      }, 9000);
      const modalReserva = bootstrap.Modal.getInstance(document.getElementById('modalReserva'));
      if (modalReserva) {
        modalReserva.hide();
      }
      limpiar();
    }
    else if (useReserva.estatus === 400) {
      console.log(useReserva.validacion);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
};

const limpiar = () => {
  nombre.value = '';
  identificacion.value = '';
  email.value = '';
  telefono.value = '';
  mensaje.value = 'Hola, vi su hotel en Hoteles Barichara y estoy interesado en hospedarme allí. ¿Podrían enviarme más información sobre la habitación que escogí y sus respectivas tarifas? Muchas gracias.';
}

function obtenerFechaActual() {
  const today = new Date();
  return today.toISOString().split('T')[0];
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
};

const getIconClass = (servicio) => {
  return iconosServicios[servicio.toLowerCase()] || 'bi bi-info-circle';
};

async function cargarHabitacion(id) {
  try {
    const response = await useHabitacion.getPorId(id);

    if (response) {
      habitacionDetalle.value = response;
    }
  } catch (error) {
    notificar('negative', 'Error al cargar el servicio');
    console.error('Error al cargar', error);
  }
}

const numeroDeNoches = computed(() => {
  if (fechaEntrada.value && fechaSalida.value) {
    const diffTime = Math.abs(new Date(fechaSalida.value) - new Date(fechaEntrada.value));
    noches.value = diffTime / (1000 * 60 * 60 * 24);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

function calcularPrecioTotal() {
  const total = habitacionDetalle.value.precio_noche * numeroDeNoches.value * cantidad_adulto.value;
  totalReserva.value = total;
  return total;
}

watch(numeroDeNoches, () => {
  calcularPrecioTotal();
})

onMounted(async () => {
  const Habitacion = route.query.id;
  if (Habitacion) {
    idHabitacion.value = Habitacion;
    await cargarHabitacion(Habitacion);
  }

  calcularPrecioTotal()
  console.log("adultos", useReserva.adultos);
  console.log("ninos", useReserva.ninos);
  console.log("total", totalReserva.value);
  console.log("noches", useReserva.numero_noche);
});
</script>


<template>
  <div v-if="habitacionDetalle">
    <div class="contenedor-imagenes">
      <div class="d-flex flex-row gap-1">
        <div v-if="habitacionDetalle.imagenes" v-for="foto in habitacionDetalle.imagenes" :key="foto.url"
          class="flex-fill" @click="abrirModal(foto.url)">
          <img :src="foto.url" alt="Imagen del hotel" class="img-fluid" style="cursor: pointer;" />
        </div>
      </div>

      <main class="w-100">
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px;">
          <h1 class="text-uppercase text-center">{{ habitacionDetalle.tipo_habitacion[0] }}</h1>
          <div class="">
            <button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#modalReserva">
              <i class="bi bi-backpack2-fill"></i> RESERVAR
            </button>
          </div>
        </div>

        <div class="galeria">
          <div class="Hoteles w-100">
            <h5>Descripción</h5>
          </div>
          <p style="padding: 10px;">
            {{ habitacionDetalle.descripcion }}
          </p>

          <div class="detalles-habitacion">
            <div class="info-container d-flex gap-5">
              <div class="info-item">
                <i class="bi bi-person-fill" style="  color: #b7642d; margin-right: 3px;"></i> Hasta {{
                  habitacionDetalle.cantidad_personas }} personas
              </div>
              <div class="info-item">
                <i class="bi bi-cash" style="  color: #b7642d; margin-right: 3px;"></i> x Noche: {{
                  habitacionDetalle.precio_noche.toLocaleString('es-CO') }} COP
              </div>
            </div>
          </div>

          <hr />

          <div class="Hoteles w-100">
            <h5>Servicios</h5>
          </div>

          <div class="servicios text-center">
            <ul>
              <li class="fw-bold" v-for="servicio in habitacionDetalle.servicio" :key="servicio">
                <i class="bi bi-check-circle-fill" id="bi"></i>{{ servicio }}
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
    <hr />

    <div>
      <!-- Modal de Reserva Unificado -->
      <div class="modal fade" id="modalReserva" tabindex="-1" aria-labelledby="modalReservaLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content">
            <!-- Encabezado del Modal -->
            <div class="modal-header">
              <h5 class="modal-title text-dark fw-bold" id="modalReservaLabel">{{ tituloForm }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <!-- Cuerpo del Modal -->
            <div class="modal-body">
              <form style="padding-left: 30px; padding-right: 30px" @submit.prevent="enviarFormulario">
                <!-- Información del Cliente y Reserva en un solo paso -->
                <p style="font-size: 20px;">
                  Por favor digite los siguientes datos para que <strong>{{ habitacionDetalle.idPiso.idHotel.nombre
                    }}</strong> se ponga en contacto contigo en breves.
                </p>

                <!-- Mensaje Adicional -->
                <div class="row">
                  <div class="col-md-12 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="mensaje">Mensaje:</label>
                    <textarea id="mensaje" v-model="mensaje" class="form-control form-control-xl"
                      placeholder="Digite cualquier información adicional..."></textarea>
                  </div>
                </div>

                <!-- Nombre y Apellido -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="nombre">Nombre <span
                        class="text-danger fw-bold">*</span></label>
                    <input type="text" id="nombre" v-model="nombre" class="form-control form-control-lg"
                      placeholder="Ingrese su nombre aquí..." required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="apellido">Identificación <span
                        class="text-danger fw-bold">*</span></label>
                    <input type="number" id="apellido" v-model="identificacion" class="form-control form-control-lg"
                      placeholder="Ingrese su número de identificación aquí..." required />
                  </div>
                </div>

                <!-- Teléfono y Correo -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="telefono">Teléfono <span
                        class="text-danger fw-bold">*</span></label>
                    <input type="number" id="telefono" v-model="telefono" class="form-control form-control-lg"
                      placeholder="Ingrese su teléfono..." required />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="correo">Correo <span
                        class="text-danger fw-bold">*</span></label>
                    <input type="email" id="correo" v-model="email" class="form-control form-control-lg"
                      placeholder="Ingrese su correo aquí..." required />
                  </div>
                </div>
                <!-- Fecha de Ingreso y Egreso -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="fechaIngreso">Fecha de Ingreso:</label>
                    <input type="date" id="fechaIngreso" class="form-control form-control-lg" :min="minDate"
                      v-model="fechaEntrada" />
                  </div>

                  <div class="col-md-6 mb-3">
                    <label class="fw-bold fs-6 mb-2" for="fechaEgreso">Fecha de Egreso:</label>
                    <input type="date" id="fechaEgreso" class="form-control form-control-lg" :min="minDate"
                      v-model="fechaSalida" />
                  </div>
                </div>

                <!-- Botones para enviar o cancelar -->
                <div class="text-center mt-4">
                  <button type="submit" class="btn btn-custom me-3 fw-bold" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm" role="status"
                      aria-hidden="true"></span>
                    <span v-else>Reservar</span>
                  </button>



                  <button type="button" class="btn btn-custom" style="background-color: black;" data-bs-dismiss="modal"
                    :disabled="loading">
                    <i class="bi bi-x-circle"></i> Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>


    <!-- Modal -->
    <div class="modal fade" id="modalImagen" tabindex="-1" aria-labelledby="modalImagenLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalImagenLabel" style="color: black;">Imagen Habitación</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <img :src="imagenSeleccionada" alt="Imagen del hotel" class="img-fluid" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show" role="alert">
      Reserva enviada con éxito, por favor revise su correo electrónico.
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

#bi {
  color: #b7642d;
  margin-right: 3px;
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

.contenedor-imagenes img {
  width: 100%;
  position: relative;
  height: 250px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.custom-notify {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 300px;
  text-align: center;
  padding: 15px;
  background-color: #4caf50;
  color: white;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.custom-notify .close:hover {
  opacity: 1;
}


/* @media screen and (min-width: 1000px) {
  .contenedor-imagenes {
    width: 100%;
  }

  .contenedor-imagenes  img{
    width: calc(50% - 50px);
  }
}

@media screen and (min-width: 900px) {
  .contenedor-imagenes {
    width: 90%;
  }

  .contenedor-imagenes img{
    width: 48%;
  }

  .contenedor-imagenes img{
    width: calc(25% - 10px);
  }
}

@media screen and (min-width: 800px) {
  .contenedor-imagenes {
    width: 90%;
  }

  .contenedor-imagenes img{
    width: 48%;
  }

  .contenedor-imagenes img{
    width: calc(25% - 10px);
  }
}

@media screen and (min-width: 600px) {
  .contenedor-imagenes {
    width: 90%;
  }

  .contenedor-imagenes img{
    width: 48%;
  }

  .contenedor-imagenes img{
    width: calc(25% - 10px);
  }
}

@media screen and (max-width: 600px) {
  .contenedor-imagenes {
    width: 100%;
  }

  .contenedor-imagenes img{
    width: 80%;
  }

  .contenedor-imagenes img{
    width: calc(50% - 10px);
  }
} */
</style>