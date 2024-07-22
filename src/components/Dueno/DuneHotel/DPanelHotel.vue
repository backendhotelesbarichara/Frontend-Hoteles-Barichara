<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreUsuarios } from '../../../stores/usuario.js';

const router = useRouter();
const useHotel = useStoreHotel();
const useUsuario = useStoreUsuarios();
const idHotel = ref();
const nombre = ref();
const descripcion = ref();
const imagenes = ref([]);
const logo = ref();
const direccion = ref();
const correo = ref();
const telefono = ref();


const hoteles = ref([]);
const loading = ref(true);

async function getHotelPorUsuario() {
  try {
    const response = await useHotel.getPorUsuario(useUsuario.usuario._id)
    console.log(response);
    hoteles.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function editarHotel(hotel) {
  const id = hotel._id;
  nombre.value = hotel.nombre
  descripcion.value = hotel.descripcion
  imagenes.value = hotel.imagen
  logo.value = hotel.logo
  






  console.log("h", hotel.nombre)
  // ...
}

function goToHabitaciones() {
  router.push('/DPanelHabitaciones')
}

onMounted(() => {
  getHotelPorUsuario();
});
</script>

<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Admistrar mi hotel</h5>
    </div>
    <div>
      <!-- Tabla de hoteles -->
      <div style="font-size: 12px" class="table-responsive">
        <table class="table table-bordered">
      <thead style="align-items: center; text-align: center">
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Descripción</th>
          <th>Dirección</th>
          <th>Pisos</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td colspan="6" style="text-align: center">
            Cargando...
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr v-for="hotel in hoteles">
          <td>{{ hotel.nombre }}</td>
          <td>{{ hotel.correo }}</td>
          <td>{{ hotel.descripcion }}</td>
          <td>{{ hotel.direccion }}</td>

          <td>{{ hotel.pisos }}</td>
          <td>
            <div class="btn-container">
              <!-- boton que abre el modal -->
              <button
                type="button"
                class="btns btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#editarDHotel"
                @click="editarHotel(hotel)"
              >
                <i class="material-icons">edit</i>
              </button>
              <!-- boton que abre el modal -->

              <!-- boton que debe redirigir a la lista de habitaciones -->
              <button
                type="button"
                class="btns btn btn-dark"
                @click="goToHabitaciones()"
              >
                <i class="material-icons">hotel</i>
              </button>
              <!-- boton que debe redirigir a la lista de habitaciones -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

    <!-- espacio para el modal -->
<div class="modal fade modal-small" id="editarDHotel" tabindex="-1" aria-labelledby="exampleModalLabel"
  aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">
          Editar datos del hotel
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <form>
          <div class="row">
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="nombre_hotel"><strong>Nombre *</strong></label>
                <input class="form-control" type="text" id="nombre_hotel" name="nombre_hotel" required="" />
              </div>
            </div>
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="descripcion_hotel"><strong>Descripción *</strong></label>
                <textarea class="form-control" id="descripcion_hotel" name="descripcion_hotel" required=""></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="imagen_hotel"><strong>Imagen *</strong></label>
                <input class="form-control" type="file" id="imagen_hotel" name="imagen_hotel" required="" />
              </div>
            </div>
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="logo_hotel"><strong>Logo *</strong></label>
                <input class="form-control" type="file" id="logo_hotel" name="logo_hotel" required="" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="direccion_hotel"><strong>Dirección *</strong></label>
                <input class="form-control" type="text" id="direccion_hotel" name="direccion_hotel" required="" />
              </div>
            </div>
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="correo_hotel"><strong>Correo *</strong></label>
                <input class="form-control" type="email" id="correo_hotel" name="correo_hotel" required="" />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="telefono_hotel"><strong>Teléfono *</strong></label>
                <input class="form-control" type="number" id="telefono_hotel" name="telefono_hotel" required="" />
              </div>
            </div>
            <div class="col-15">
              <div class="mb-3">
                <label class="form-label" for="pisos_hotel"><strong>Pisos *</strong></label>
                <input class="form-control" type="number" id="pisos_hotel" name="pisos_hotel" required="" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary"
              data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" style="background-color: #b7642d; border-style: none" class="btn btn-primary"
              @click="editarHotel()">
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
      <!-- espacio para el modal -->
    </div>
  </div>
</template>



<style scoped>
/* Estilo para el modal más pequeño */
.modal-small .modal-dialog {
  max-width: 300px;
  /* Establece el ancho deseado */
  margin: 0 auto;
  /* Centra horizontalmente el modal */
  top: 50%;
  /* Coloca el modal en el centro vertical */
  transform: translateY(-50%);
  /* Alinea verticalmente el modal */
}

.logo {
  position: relative;
  max-width: 30px;
  max-height: 40px;
  margin-top: 5px;
  transition: 1s;
}

.logo:hover {
  position: relative;
  max-width: 30px;
  max-height: 40px;
  margin-top: 5px;
  transform: scale(1.1);
  /* Cambia el tamaño al pasar el mouse */
}

.logop {
  color: #fff;
  text-align: center;
}

.foto {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.fixed-size-image {
  width: 100px;
  height: 100px;
  overflow: hidden;
  /* Para manejar el desbordamiento de la imagen */
  object-fit: cover;
  border-radius: 10px;
  border-style: solid;
  border-color: #b7642d5b;
}

.link {
  text-decoration: none !important;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  /* Espacio entre los botones */
}

.btns {
  border-radius: 50%;
  /* Redondear los botones */
  padding: 5px;
  /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icons {
  font-size: 20px;
  /* Tamaño del icono */
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

/* Estilos para la tabla */
.table {
  border-collapse: collapse;
  /* Para eliminar los espacios entre las celdas */
  width: 100%;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2;
  /* Color de fondo para las celdas del encabezado */
}

.btn-container {
  display: flex;
  gap: 5px;
  /* Espacio entre los botones */
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%;
  /* Redondear los botones */
  padding: 5px;
  /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
  /* Color de fondo de los botones */
  color: white;
  /* Color del texto de los botones */
  border: none;
  /* Eliminar el borde de los botones */
}

.material-icons {
  font-size: 20px;
  /* Tamaño del icono */
}

/* Estilos para scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 7px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #b7642d;
  border-radius: 20px;
}
</style>
