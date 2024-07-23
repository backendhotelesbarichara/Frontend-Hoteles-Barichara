<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreUsuarios } from '../../../stores/usuario.js';

const router = useRouter();
const useHotel = useStoreHotel();
const useUsuario = useStoreUsuarios();
const idHotel = ref();
const hotelSeleccionado = ref();
const nombre = ref();
const descripcion = ref();
const hoteles = ref([]);
const imgPrincipal = ref();
const fotos = ref([]);
const logo = ref();
const direccion = ref();
const correo = ref();
const telefono = ref();
const piso = ref();
const loading = ref(true);

async function getHotelPorUsuario() {
  try {
    const response = await useHotel.getPorUsuario(useUsuario.usuario._id)
    hoteles.value = response
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function editaHotel(hotel) {
  console.log("id hotel componente", idHotel)
  idHotel.value = hotel._id
  nombre.value = hotel.nombre
  descripcion.value = hotel.descripcion
  imgPrincipal.value = hotel.imagen
  logo.value = hotel.logo
  fotos.value = hotel.fotos
  direccion.value = hotel.direccion
  correo.value = hotel.correo
  telefono.value = hotel.telefono
  piso.value = hotel.pisos
  hotelSeleccionado.value = hotel
  console.log("h", hotel.nombre)
}

/* async function editarHotel() {
  try {
    const response = await useHotel.getPorUsuario(useUsuario.usuario._id)
    hoteles.value = response
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
} */

const subirFotos = async (id, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'qcxzi3kl');
    const response = await axios.post(`https://api.cloudinary.com/v1_1/dep417oku/image/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    const logo = response.data.secure_url;
    const imagenPrincipal = response.data.secure_url;
    const fotos = response.data.secure_url;

    hotelSeleccionado.logo = logo;
    hotelSeleccionado.imagen = imagenPrincipal;
    hotelSeleccionado.fotos = fotos;


    const data = { logo, imagenPrincipal, fotos };
    hotelSeleccionado.logo = logo;
    hotelSeleccionado.imagen = imagenPrincipal;
    hotelSeleccionado.fotos = fotos;
    useHotel.hotelSeleccionado.logo = fotoPerfil
    return response.data.secure_url;
  } catch (error) {
    console.error('Error al subir la foto:', error);
    return null;
  }
};

const cambiarFoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  await useHotel.subirFotos(useHotel.idHotel, file);
};


function guardarCambios() {
  if (!nombre.value || !descripcion.value || !direccion.value || !correo.value || !telefono.value) {
    console.log("No se pueden enviar campos vacios");
    return;
  }

  const data = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    direccion: direccion.value,
    correo: correo.value, 
    telefono: telefono.value,
    pisos: piso.value,
    idUsuario: useUsuario.usuario._id
  };

  useHotel.editar(useHotel.idHotel, data)
    .then((res) => {
      useHotel.hotelSeleccionado = res
      getHotelPorUsuario();
    })
    .catch((error) => {
      console.log(error)
    })
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
    <div v-if="loading" class="centered">
      <div class="empty-state">
        <i class="material-icons empty-state__icon">hotel</i>
        <h3 class="empty-state__title">Cargando...</h3>
      </div>
    </div>
    <div v-else-if="hoteles.length === 0" class="centered">
      <div class="empty-state">
        <i class="material-icons empty-state__icon">hotel</i>
        <h3 class="empty-state__title">Aún no tienes un hotel registrado</h3>
        <p class="empty-state__description">¡Registra tu hotel ahora mismo para comenzar a administrarlo!</p>
        <router-link class="link" to="/RegitroHotel">
          <button class="btn btn-dark">
            Registrar Hotel
          </button>
        </router-link>
      </div>
    </div>
    <div v-else>
      <!-- Tabla de hoteles -->
      <div style="font-size: 12px" class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Descripción</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Pisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hotel in hoteles">
              <td>{{ hotel.nombre }}</td>
              <td>{{ hotel.correo }}</td>
              <td>{{ hotel.descripcion }}</td>
              <td>{{ hotel.telefono }}</td>
              <td>{{ hotel.direccion }}</td>
              <td>{{ hotel.pisos }}</td>
              <td>
                <div class="btn-container">
                  <button type="button" class="btns btn btn-dark" data-bs-toggle="modal" data-bs-target="#editarDHotel"
                    @click="editaHotel(hotel)">
                    <i class="material-icons">edit</i>
                  </button>
                  <button type="button" class="btns btn btn-dark" @click="goToHabitaciones()">
                    <i class="material-icons">hotel</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- ... resto del componente ... -->


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
                      <input class="form-control" type="text" id="nombre_hotel" name="nombre_hotel" v-model="nombre"
                        required="" />
                    </div>
                  </div>
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="descripcion_hotel"><strong>Descripción *</strong></label>
                      <textarea class="form-control" id="descripcion_hotel" name="descripcion_hotel" v-model="descripcion"
                        required=""></textarea>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="imagen_hotel"><strong>Imagen Principal</strong></label>
                      <input class="form-control" type="file" @change="cambiarFoto" accept="image/*" id="imagen_hotel"
                        name="imagen_hotel" required="" />
                    </div>
                  </div>
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="logo_hotel"><strong>Logo</strong></label>
                      <input class="form-control" type="file" @change="cambiarFoto" accept="image/*" id="logo_hotel"
                        name="logo_hotel" required="" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="pisos_hotel"><strong>Fotos hotel *</strong></label>
                      <input class="form-control" type="file" @change="cambiarFoto" accept="image/*" id="imagen_hotel"
                        name="imagen_hotel" required="" />
                    </div>
                  </div>
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="direccion_hotel"><strong>Dirección *</strong></label>
                      <input class="form-control" type="text" id="direccion_hotel" name="direccion_hotel"
                        v-model="direccion" required="" />
                    </div>
                  </div>
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="correo_hotel"><strong>Correo *</strong></label>
                      <input class="form-control" type="email" id="correo_hotel" name="correo_hotel" v-model="correo"
                        required="" />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-15">
                    <div class="mb-3">
                      <label class="form-label" for="telefono_hotel"><strong>Teléfono *</strong></label>
                      <input class="form-control" type="number" id="telefono_hotel" name="telefono_hotel"
                        v-model="telefono" required="" />
                    </div>
                  </div>

                </div>
                <div class="modal-footer">
                  <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary"
                    data-bs-dismiss="modal">
                    Cancelar
                  </button>
                  <button type="button" style="background-color: #b7642d; border-style: none" class="btn btn-primary"
                    @click="guardarCambios">
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
  max-width: 500px;
  /* Establece el ancho deseado */
  margin: 0 auto;
  /* Centra horizontalmente el modal */
  top: 50%;
  /* Coloca el modal en el centro vertical */
  transform: translateY(-40%);
  max-height: auto;
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.empty-state__icon {
  font-size: 64px;
  color: #b7642d;
  margin-bottom: 20px;
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 10px;
}

.empty-state__description {
  font-size: 1rem;
  color: #343a40;
  margin-bottom: 20px;
}

.btns {
  background-color: #b7642d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btns:hover,
.btn:hover {
  background-color: #a8521c;
}

.btn {
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
