<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreUsuarios } from '../../../stores/usuario.js';

const router = useRouter();
const useHotel = useStoreHotel();
const useUsuario = useStoreUsuarios();
const idUsuario = ref(useUsuario.usuario._id)
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
const validacion = ref("");
const loading = ref(true);
const uploadingPrincipal = ref(false); // Estado de carga para imagen principal
const uploadingFotos = ref(false); // Estado de carga para fotos
const uploadingLogo = ref(false);
const editMode = ref({
  nombre: false,
  descripcion: false,
  direccion: false,
  correo: false,
  telefono: false,
  logo: false,
  imagen: false,
  fotos: false
});


const dataHotel = ref({ ...useHotel.editarHotelSelec });

async function getHoteles() {
  try {
    const response = await useHotel.getPorUsuario(idUsuario.value)
    hoteles.value = response
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function editaHotel(hotel) {
  useHotel.editarHotelSelec = hotel;
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
  useHotel.editarHotelSelec = hotel;
  console.log("h", hotel)
}

watch(hotelSeleccionado, (value) => {
  dataHotel.value = { ...value };
  useHotel.editarHotelSelec = value;
  console.log("hotel selec", value);
})

function guardarCambios() {
  if (!dataHotel.value.nombre || !dataHotel.value.descripcion || !dataHotel.value.direccion || !dataHotel.value.correo || !dataHotel.value.telefono) {
    validacion.value = "No se pueden enviar campos vacíos";
    return;
  }

  // Prepara los datos para incluir solo las imágenes no eliminadas
  const datosParaGuardar = {
    ...dataHotel.value,
    fotos: dataHotel.value.fotos.filter(foto => !foto.eliminada),
  };

  useHotel.editar(dataHotel.value._id, datosParaGuardar)
    .then((res) => {
      console.log("soy res", res);
      useHotel.editarHotelSelec = res;
      getHoteles();
    })
    .catch((error) => {
      console.log(error);
    });
}

/* Subir imagenes cloudinary */

const cambiarLogo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadingLogo.value = true;

  try {
    const imageUrl = await useHotel.subirLogo(dataHotel.value._id, file);
    dataHotel.value.logo = imageUrl;
  } catch (error) {
    console.error("Error al cambiar el logo:", error);
  } finally {
    uploadingLogo.value = false;
  }
};


const cambiarFoto = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadingPrincipal.value = true;

  try {
    const imageUrl = await useHotel.subirFotos(dataHotel.value._id, file);
    dataHotel.value.imagen = imageUrl;
  } catch (error) {
    console.error("Error al cambiar la foto:", error);
  } finally {
    uploadingPrincipal.value = false;
  }
};

async function subirFotosHotel(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  uploadingFotos.value = true;
  const fotosAntesDeSubir = [...dataHotel.value.fotos];

  try {
    dataHotel.value.fotos = fotosAntesDeSubir.filter(foto => !foto.eliminada);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirGrupoFotos(dataHotel.value._id, file);

      const fotoObj = { url: imageUrl };
      dataHotel.value.fotos.push(fotoObj);
    }
  } catch (error) {
    console.error("Error al subir las fotos:", error);
  } finally {
    uploadingFotos.value = false;
  }
}

function eliminarLogo() {
  dataHotel.value.logo = null; // O elimina el logo según cómo manejes la eliminación en tu backend
}

function eliminarImagenPrincipal() {
  dataHotel.value.imagen = null; // O elimina la imagen principal según cómo manejes la eliminación en tu backend
  console.log(dataHotel)
}


function marcarComoEliminada(index) {
  dataHotel.value.fotos[index].eliminada = true;
}

function goToHabitaciones(hotel) {
  idHotel.value = hotel._id;
  useHotel.idHotel = idHotel.value;
  router.push('/DPanelHabitaciones')
}

function goToRegistroHotel() {
  router.push('/RegitroHotel')
}

onMounted(() => {
  getHoteles();
});

</script>

<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Administrar Hotel</h5>
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
      </div>
    </div>
    <div v-else>
      <!-- Tabla de hoteles -->
      <h1 class="text-center m-4">TUS HOTELES</h1>
      <div style="font-size: 12px" class="table-responsive">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Descripción</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hotel in hoteles" :key="hotel._id">
              <td>{{ hotel.nombre }}</td>
              <td>
                <VMenu class="vmenu">
                  <!-- Texto truncado visible en la celda -->
                  <span class="truncated-text">{{ hotel.correo }}</span>
                  <!-- Menú desplegable al hacer clic o pasar el mouse -->
                  <template #popper>
                    <div class="descripVmenu">
                      {{ hotel.correo }}
                    </div>
                  </template>
                </VMenu>
              </td>
              <td>
                <VMenu class="vmenu">
                  <!-- Texto truncado visible en la celda -->
                  <span class="truncated-text">{{ hotel.descripcion }}</span>
                  <!-- Menú desplegable al hacer clic o pasar el mouse -->
                  <template #popper>
                    <div class="descripVmenu">
                      {{ hotel.descripcion }}
                    </div>
                  </template>
                </VMenu>
              </td>
              <td>{{ hotel.telefono }}</td>
              <td>{{ hotel.direccion }}</td>
              <td>
                <div class="btn-container">
                  <button type="button" class="btns btn btn-dark" data-bs-toggle="modal" data-bs-target="#editarDHotel"
                    @click="editaHotel(hotel)">
                    <i class="material-icons">edit</i>
                  </button>
                  <button type="button" class="btns btn btn-dark" @click="goToHabitaciones(hotel)">
                    <i class="material-icons">hotel</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal editar hotel -->
      <div class="modal fade modal-large" id="editarDHotel" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Editar información del hotel</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <!-- Fila: Logo y Nombre del Hotel -->
                <div class="row mb-3 align-items-center">
                  <div class="col-md-3">
                    <label class="form-label"><strong>Logo</strong></label>
                    <div class="d-flex align-items-center">
                      <div v-if="uploadingLogo" class="loading-spinner">Cargando...</div>
                      <div v-else>
                        <img v-if="dataHotel.logo" :src="dataHotel.logo.url" alt="" class="fixed-size-image" />
                        <p v-if="!dataHotel.logo">Por favor suba un logo...</p>
                        <button v-if="editMode.logo && dataHotel.logo" type="button"
                          class="btn btn-danger btn-sm mt-2 photo-delete-btn" @click="eliminarLogo">
                          <i class="bi bi-trash"></i>
                        </button>
                        <input v-if="editMode.logo" class="form-control mt-2" type="file" @change="cambiarLogo"
                          accept="image/*" />
                      </div>
                      <button @click="editMode.logo = !editMode.logo" type="button" class="btn btn-link ms-2 p-0">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                  <div class="col-md-9">
                    <label class="form-label"><strong>Nombre Hotel</strong></label>
                    <div class="d-flex align-items-center">
                      <h2 v-if="!editMode.nombre" class="mb-0">{{ dataHotel.nombre }}</h2>
                      <input v-else class="form-control me-2" type="text" id="nombre_hotel" name="nombre_hotel"
                        v-model="dataHotel.nombre" @blur="editMode.nombre = false" required />
                      <button @click="editMode.nombre = true" type="button" class="btn btn-link ms-2 p-0">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <!--                 <!-- Imagen Principal 
                <div class="mb-3">
                  <label class="form-label"><strong>Imagen Principal</strong></label>
                  <div class="d-flex align-items-center">
                    <div v-if="uploadingPrincipal" class="loading-spinner">Cargando...</div>
                    <div v-else>
                      <img v-if="dataHotel.imagen" :src="dataHotel.imagen" alt="" class="fixed-size-image" />
                      <p v-if="!dataHotel.imagen">Por favor suba una imagen principal...</p>
                      <button v-if="editMode.imagen && dataHotel.imagen" type="button"
                        class="btn btn-danger btn-sm mt-2 photo-delete-btn" @click="eliminarImagenPrincipal">
                        <i class="bi bi-trash"></i>
                      </button>
                      <input v-if="editMode.imagen" class="form-control mt-2" type="file" @change="cambiarFoto"
                        accept="image/*" />
                    </div>
                    <button @click="editMode.imagen = !editMode.imagen" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div> -->

                <!-- Fotos del Hotel -->
                <div class="mb-3 text-center">
                  <label class="form-label"><strong>Fotos del Hotel</strong></label>
                  <div class="d-flex align-items-center">
                    <div v-if="uploadingFotos" class="loading-spinner">Cargando fotos...</div>
                    <div v-else class="gap-5">
                      <div v-for="(foto, index) in dataHotel.fotos" :key="index" class="photo-container">
                        <img v-if="!foto.eliminada" :src="foto.url" alt="" class="fixed-size-image">
                        <button v-if="!foto.eliminada && editMode.fotos" type="button"
                          class="btn btn-danger btn-sm mt-2 photo-delete-btn" @click="marcarComoEliminada(index)">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                      <input v-if="editMode.fotos" class="form-control mt-2" type="file" multiple
                        @change="subirFotosHotel" accept="image/*" />
                    </div>
                    <button @click="editMode.fotos = !editMode.fotos" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>

                <!-- Descripción del Hotel -->
                <div class="mb-3">
                  <label class="form-label" for="descripcion_hotel"><strong>Descripción *</strong></label>
                  <div class="d-flex align-items-center">
                    <p v-if="!editMode.descripcion" class="mb-0">{{ dataHotel.descripcion }}</p>
                    <textarea v-else class="form-control me-2" id="descripcion_hotel" name="descripcion_hotel"
                      v-model="dataHotel.descripcion" @blur="editMode.descripcion = false" required></textarea>
                    <button @click="editMode.descripcion = true" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>

                <!-- Dirección del Hotel -->
                <div class="mb-3">
                  <label class="form-label" for="direccion_hotel"><strong>Dirección *</strong></label>
                  <div class="d-flex align-items-center">
                    <p v-if="!editMode.direccion" class="mb-0">{{ dataHotel.direccion }}</p>
                    <input v-else class="form-control me-2" type="text" id="direccion_hotel" name="direccion_hotel"
                      v-model="dataHotel.direccion" @blur="editMode.direccion = false" required />
                    <button @click="editMode.direccion = true" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>

                <!-- Correo del Hotel -->
                <div class="mb-3">
                  <label class="form-label" for="correo_hotel"><strong>Correo *</strong></label>
                  <div class="d-flex align-items-center">
                    <p v-if="!editMode.correo" class="mb-0">{{ dataHotel.correo }}</p>
                    <input v-else class="form-control me-2" type="email" id="correo_hotel" name="correo_hotel"
                      v-model="dataHotel.correo" @blur="editMode.correo = false" required />
                    <button @click="editMode.correo = true" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>

                <!-- Teléfono del Hotel -->
                <div class="mb-3">
                  <label class="form-label" for="telefono_hotel"><strong>Teléfono *</strong></label>
                  <div class="d-flex align-items-center">
                    <p v-if="!editMode.telefono" class="mb-0">{{ dataHotel.telefono }}</p>
                    <input v-else class="form-control me-2" type="text" id="telefono_hotel" name="telefono_hotel"
                      v-model="dataHotel.telefono" @blur="editMode.telefono = false" required />
                    <button @click="editMode.telefono = true" type="button" class="btn btn-link ms-2 p-0">
                      <i class="bi bi-pencil"></i>
                    </button>
                  </div>
                </div>

                <div v-if="validacion" class="alert alert-danger mt-3" role="alert">
                  {{ validacion }}
                </div>
              </form>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-dark" @click="guardarCambios">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.modal-large .modal-dialog {
  max-width: 90%;
  /* Ancho máximo del 90% del tamaño de la pantalla */
}

.logo {
  max-width: 100%;
  max-height: 100px;
  /* Ajusta el tamaño máximo del logo */
}



.image-container,
.photos-container {
  position: relative;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  /* Ajusta el alto del spinner si es necesario */
}

.photo-container {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
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
  width: 150px;
  height: 150px;
  overflow: hidden;
  object-fit: cover;
  border-radius: 10px;
  border-style: solid;
  border-color: #b7642d5b;
}

.link {
  text-decoration: none !important;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 20%;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  animation: spin 1s linear infinite;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin-top: 20%;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 7px;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid #3498db;
  animation: spin 1s linear infinite;
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



.descripVmenu {
  padding: 1rem;
  word-wrap: break-word;
  height: fit-content;
  max-height: 250px;
  max-width: 250px;
}

/* Estilos para la tabla */
.table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
}

/* Ajusta el estilo solo para los elementos vmenu dentro de las celdas de la tabla */
.table td .vmenu {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2;
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

.btn-link i {
  font-size: 1.5rem;
  /* Tamaño del icono */
  color: #b7642d;
  /* Color del icono */
}

.btn-link {
  text-decoration: none;
  padding: 0;
  margin-left: 8px;
  /* Espacio entre el texto y el lápiz */
}

.btn-link:hover {
  background-color: #000000;
  /* Cambia el color del icono al pasar el mouse */
}

.btn-link:hover i {
  color: #ffffff;
  /* Cambia el color del icono al pasar el mouse */
}


/* Media query */
@media (max-width: 768px) {
  .photo-delete-btn {
    position: static;
    margin-top: 5px;
    display: block;
  }
}

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }
}
</style>