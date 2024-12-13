<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreUsuarios } from '../../../stores/usuario.js';
import 'bootstrap/dist/js/bootstrap.bundle';

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
const loading = ref(true);
const uploadingFotos = ref(false);
const uploadingLogo = ref(false);
const loadingEditar = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const notificacionCargando = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
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
const nuevoServicio = ref('');
let editarModalInstance; // Instancia del modal editarp
let imagenesModalInstance; // Instancia del modal imagenesModal
let serviciosModalInstance; // Instancia del modal modalVerServicios
let logoModalInstance; // Instancia del modal modalVerServicios


const dataHotel = ref({
  ...useHotel.editarHotelSelec,
  servicio: useHotel.editarHotelSelec.servicio || [], // Asegura que sea un array
});

const abrirModalImagenes = () => {
  if (imagenesModalInstance) {
    imagenesModalInstance.show();
    if (editarModalInstance) editarModalInstance.hide(); // Cierra editarp
  }
};

const abrirModalServicios = () => {
  if (serviciosModalInstance) {
    serviciosModalInstance.show();
    if (editarModalInstance) editarModalInstance.hide(); // Cierra editarp
  }
};

const abrirModalLogo = () => {
  if (logoModalInstance) {
    logoModalInstance.show();
    if (editarModalInstance) editarModalInstance.hide(); // Cierra editarp
  }
};

async function getHoteles() {
  try {
    const response = await useHotel.getAll()
    hoteles.value = response.map(hotel => ({
      ...hotel,
      loadingActInac: false // Agregamos el estado de carga por plato
    }));
    /* console.log(response); */
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
  /* console.log("h", hotel) */
  if (editarModalInstance) editarModalInstance.show();
}

watch(hotelSeleccionado, (value) => {
  dataHotel.value = { ...value };
  useHotel.editarHotelSelec = value;
  /* console.log("hotel selec", value); */
})

async function guardarCambios() {
  if (!dataHotel.value.nombre || !dataHotel.value.descripcion || !dataHotel.value.direccion || !dataHotel.value.correo || !dataHotel.value.telefono) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = "No se pueden enviar campos vacíos";
    setTimeout(() => {
      notificacionValidacion.value = false;
      return;
    }, 3000);
  }
  loadingEditar.value = true;
  // Prepara los datos para incluir solo las imágenes no eliminadas
  const datosParaGuardar = {
    ...dataHotel.value,
    fotos: dataHotel.value.fotos.filter(foto => !foto.eliminada),
  };

  try {
    const res = await useHotel.editar(dataHotel.value._id, datosParaGuardar);
    /* console.log("soy res", res); */
    if (useHotel.estatus === 200) {
      notificacionVisible.value = true;
      useHotel.editarHotelSelec = res;
      getHoteles();
      setTimeout(() => {
        notificacionVisible.value = false;
      }, 4500);
    } else if (useHotel.estatus === 400) {
      notificacionValidacion.value = true;
      mensajeValidacion.value = useHabitacion.validacion;
      setTimeout(() => {
        notificacionValidacion.value = false;
        mensajeValidacion.value = '';
      }, 3000);
    }
  } catch (error) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = useHabitacion.validacion;
    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    console.log(error);
  } finally {
    loadingEditar.value = false;
  }
}

/* Subir imagenes cloudinary */
const cambiarLogo = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  uploadingLogo.value = true;
  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo logo del hotel, por favor espere...';

  try {
    const imageUrl = await useHotel.subirLogo(dataHotel.value._id, file);
    dataHotel.value.logo = imageUrl;

    mensajeCargando.value = 'Logo del hotel subido exitosamente';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 6000);

  } catch (error) {
    console.error("Error al cambiar el logo:", error);
    mensajeCargando.value = 'Error al subir el logo';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 3000);
  } finally {
    uploadingLogo.value = false;
  }
};

async function subirFotosHotel(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  uploadingFotos.value = true;
  const fotosAntesDeSubir = [...dataHotel.value.fotos];

  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo imagen, por favor espere...';

  try {
    dataHotel.value.fotos = fotosAntesDeSubir.filter(foto => !foto.eliminada);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirGrupoFotos(dataHotel.value._id, file);

      const fotoObj = { url: imageUrl };
      dataHotel.value.fotos.push(fotoObj);

      mensajeCargando.value = 'Imagen subida exitosamente';
      setTimeout(() => {
        notificacionCargando.value = false;
        mensajeCargando.value = '';
      }, 6000);
    }
  } catch (error) {
    console.error("Error al subir las fotos:", error);
    mensajeCargando.value = 'Error al subir la imagen';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 3000);
  } finally {
    uploadingFotos.value = false;
  }
}

async function cambiarEstadoHotel(hotel) {
  const Hotel = hoteles.value.find(hoteles => hoteles._id === hotel._id);
  if (!Hotel) return;

  Hotel.loadingActInac = true;

  const estadoAnterior = Hotel.estado;
  Hotel.estado = !Hotel.estado;

  try {
    if (estadoAnterior) {
      await useHotel.inactivar(hotel._id);
    } else {
      await useHotel.activar(hotel._id);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del sitio", error);
    Hotel.estado = estadoAnterior;
  } finally {
    Hotel.loadingActInac = false;
  }
}

// Función para agregar nuevo servicio
const agregarServicio = () => {
  if (nuevoServicio.value.trim() !== '') {
    // Añadir directamente la cadena al array de servicios
    dataHotel.value.servicio = [...(dataHotel.value.servicio || []), nuevoServicio.value.trim()];
    nuevoServicio.value = ''; // Limpia el campo de entrada
  }
};

// Función para eliminar un servicio
const eliminarServicio = (index) => {
  dataHotel.value.servicio.splice(index, 1); // Elimina el servicio por índice
};

function eliminarLogo() {
  dataHotel.value.logo = null;
}

function marcarComoEliminada(index) {
  dataHotel.value.fotos[index].eliminada = true;
}

function goToHabitaciones(hotel) {
  idHotel.value = hotel._id;
  useHotel.idHotel = idHotel.value;
  const url = router.resolve({ path: '/DPanelHabitaciones', query: { id: hotel._id } }).href;
  window.open(url, '_blank');
}

function goToRegistroHotel() {
  router.push('/RegitroHotel')
}

onMounted(async () => {
  await getHoteles();

  const editarModalElement = document.getElementById('editarDHotel');
  if (editarModalElement) {
    editarModalInstance = new bootstrap.Modal(editarModalElement);
  }

  const imagenesModalElement = document.getElementById('modalVerImagenes');
  if (imagenesModalElement) {
    imagenesModalInstance = new bootstrap.Modal(imagenesModalElement);

    // Al cerrar imagenesModal, abrir editarp
    imagenesModalElement.addEventListener('hidden.bs.modal', () => {
      if (editarModalInstance) {
        editarModalInstance.show();
      }
    });
  }

  const serviciosModalElement = document.getElementById('modalVerServicios');
  if (serviciosModalElement) {
    serviciosModalInstance = new bootstrap.Modal(serviciosModalElement);

    // Al cerrar imagenesModal, abrir editarp
    serviciosModalElement.addEventListener('hidden.bs.modal', () => {
      if (editarModalInstance) {
        editarModalInstance.show();
      }
    });
  }

  const logoModalElement = document.getElementById('modalVerLogo');
  if (logoModalElement) {
    logoModalInstance = new bootstrap.Modal(logoModalElement);

    // Al cerrar imagenesModal, abrir editarp
    logoModalElement.addEventListener('hidden.bs.modal', () => {
      if (editarModalInstance) {
        editarModalInstance.show();
      }
    });
  }
});
</script>

<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Administrar Hoteles</h5>
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
      <div style="font-size: 12px" class="table-responsive mt-5">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Descripción</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
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
                  <span class="truncated-text">{{ hotel.descripcion }}</span>
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
                <button :class="['btn', hotel.estado ? 'btn-success' : 'btn-danger']" @click="cambiarEstadoHotel(hotel)"
                  style="margin-left: 10px; font-weight: bold;" :disabled="hotel.loadingActInac">
                  <span v-if="hotel.loadingActInac" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
                  <span v-if="!hotel.loadingActInac"> {{ hotel.estado ? 'Activo' : 'Inactivo'
                    }}</span>
                </button>
              </td>
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

      <div style="display: flex; justify-content: end;">
        <button class="btn top-bar__button" id="btns" style="margin-top: 6px;" @click="goToRegistroHotel()">
          Agregar Hotel
        </button>
      </div>

      <!-- Modal editar hotel -->
      <div class="modal fade" id="editarDHotel" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Editar Información del Hotel</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <!-- Nombre del Hotel -->
                <div class="mb-3">
                  <label class="form-label"><strong>Nombre Hotel <span class="text-danger">*</span></strong></label>
                  <input class="form-control" type="text" v-model="dataHotel.nombre" required />
                </div>

                <!-- Dirección del Hotel -->
                <div class="mb-3">
                  <label class="form-label"><strong>Dirección <span class="text-danger">*</span></strong></label>
                  <input class="form-control" type="text" v-model="dataHotel.direccion" required />
                </div>

                <!-- Correo del Hotel -->
                <div class="mb-3">
                  <label class="form-label"><strong>Correo <span class="text-danger">*</span></strong></label>
                  <input class="form-control" type="email" v-model="dataHotel.correo" required />
                </div>

                <!-- Teléfono del Hotel -->
                <div class="mb-3">
                  <label class="form-label"><strong>Teléfono <span class="text-danger">*</span></strong></label>
                  <input class="form-control" type="text" v-model="dataHotel.telefono" required />
                </div>

                <!-- Botón para Ver Logo -->
                <div class="mb-3" style="display: flex; flex-direction: column;">
                  <label class="form-label"><strong>Logo del Hotel</strong></label>
                  <div style="width: 30%">
                    <button type="button" class="btn btn-dark" @click="abrirModalLogo">Ver Logo</button>
                  </div>
                </div>

                <!-- Fotos del Hotel -->
                <div class="mb-3" style="display: flex; flex-direction: column;">
                  <label class="form-label"><strong>Fotos del Hotel</strong></label>
                  <div style="width: 30%">
                    <button type="button" class="btn btn-dark" @click="abrirModalImagenes()">Ver
                      Imágenes</button>
                  </div>
                </div>

                <!-- Servicios del Hotel -->
                <div class="mb-3" style="display: flex; flex-direction: column;">
                  <label class="form-label"><strong>Servicios del Hotel</strong></label>
                  <div style="width: 30%">
                    <button type="button" class="btn btn-dark" @click="abrirModalServicios">Ver Servicios</button>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" data-bs-dismiss="modal" style="background-color: gray;">Cerrar</button>
              <button type="button" class="btn btn-dark" @click="guardarCambios" :disabled="loadingEditar">
                <span v-if="loadingEditar" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal para ver y editar imágenes -->
      <div class="modal fade modal-large" id="modalVerImagenes" tabindex="-1" aria-labelledby="modalImagenesLabel"
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalImagenesLabel" style="color: black;">Imágenes del Hotel</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Mostrar las imágenes actuales -->
              <div class="d-flex flex-wrap gap-3">
                <div v-for="(foto, index) in dataHotel.fotos" :key="index" class="photo-container">
                  <img v-if="!foto.eliminada" :src="foto.url" alt="Foto del hotel" class="fixed-size-image">
                  <button v-if="!foto.eliminada" class="btn btn-danger btn-sm mt-2 photo-delete-btn"
                    style="background-color: red;" @click="marcarComoEliminada(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div style="display: flex; flex-direction: column; width: 100%; justify-content: start;">
                <label class="form-label"><strong>Agregar nuevas imágenes</strong></label>
                <input type="file" class="form-control" multiple @change="subirFotosHotel" accept="image/*">
                <label>(Debe haber mínimo 1 foto, cada foto debe pesar menos de 10MB, la primera foto será utilizada
                  como foto
                  principal del hotel)</label>
              </div>
              <button type="button" class="btn" data-bs-dismiss="modal">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade modal-large" id="modalVerLogo" tabindex="-1" aria-labelledby="modalLogoLabel"
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLogoLabel" style="color: black;">Gestión del Logo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                :disabled="uploadingLogo"></button>
            </div>
            <div class="modal-body text-center">
              <!-- Mostrar Logo Actual -->
              <div v-if="dataHotel.logo">
                <img :src="dataHotel.logo" alt="Logo del Hotel" class="img-thumbnail mb-3"
                  style="width: 25%; height: auto;" />
                <button class="btn btn-danger mb-3" style="margin-left: 20px; background-color: red; font-weight: bold;"
                  @click="eliminarLogo"><i class="bi bi-trash"></i></button>
              </div>
              <div v-else>
                <p>No hay un logo actualmente.</p>
              </div>

              <!-- Subir Nuevo Logo -->
              <label for="nuevoLogo" class="form-label fw-bold">Subir Nuevo Logo ↓</label>
              <input type="file" id="nuevoLogo" class="form-control" @change="cambiarLogo" accept="image/*" />
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-dark" data-bs-dismiss="modal"
                :disabled="uploadingLogo">Aceptar</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal para ver y editar servicios -->
      <div class="modal fade modal-large" id="modalVerServicios" tabindex="-1" aria-labelledby="modalServiciosLabel"
        aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="modalServiciosLabel">Servicios que dispone el hotel</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Mostrar los servicios actuales -->
              <div class="mb-3">
                <ul>
                  <li v-for="(servicio, index) in dataHotel.servicio" :key="index" style="list-style-type: none;">
                    <div style="display: flex; align-items: center; gap: 10px; width: 100%; margin-bottom: 10px;">
                      <!-- Muestra y permite editar directamente la cadena -->
                      <input type="text" v-model="dataHotel.servicio[index]" class="form-control" style="flex: 1;" />
                      <button type="button" class="btn btn-danger btn-sm" @click="eliminarServicio(index)"
                        style="flex-shrink: 0; background-color: red;">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="modal-footer">
              <div style="display: flex; flex-direction: column; width: 100%; justify-content: start;">
                <label for="nuevoServicio" class="form-label fw-bold">Agregar nuevo servicio</label>
                <div style="width: 50%;">
                  <textarea type="text" v-model="nuevoServicio" class="form-control"
                    placeholder="Nuevo servicio"></textarea>
                  <button type="button" class="btn mt-2 botonservicio" style="background-color: #a8521c;"
                    @click="agregarServicio">Añadir Servicio</button>
                </div>
              </div>
              <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show" role="alert">
      Hotel editado exitosamente
    </div>

    <div v-if="notificacionValidacion" class="custom-notify alert alert-danger alert-dismissible fade show"
      role="alert">
      {{ mensajeValidacion }}
    </div>

    <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show" role="alert">
      {{ mensajeCargando }}
    </div>
  </div>
</template>

<style scoped>
.modal-large .modal-dialog {
  max-width: 80%;
  height: 80vh;
  width: 80vw;
}

.modal-large .modal-content {
  height: 100%;
}

.fixed-size-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #b7642d;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: grey #f1f1f1;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: black;
  border-radius: 10px;
}

.modal-body::-webkit-scrollbar-thumb {
  background-color: black;
  border-radius: 10px;
  border: 2px solid #f1f1f1;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background-color: grey;
}

.modal-body::-webkit-scrollbar-thumb:active {
  background-color: black;
}

.modal-large .modal-dialog {
  max-width: 90%;
}

.modal-backdrop.show {
  z-index: 1040 !important;
}

/* Asegurarse de que el modal de servicios tenga un z-index mayor que el modal editar */
#modalVerServicios {
  z-index: 1060 !important;
}

/* Asegurar que el modal Ver Servicios tenga la misma altura */
#modalVerServicios .modal-dialog {
  max-width: 90%;
}


.logo {
  max-width: 100%;
  max-height: 100px;
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
  width: 200px;
  height: 200px;
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

.btn-success {
  background-color: green !important;
}

.btn-danger {
  background-color: #bb2d3b !important;
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

.btns:hover {
  background-color: #a8521c;
}

.btn {
  color: white;
  background-color: #a8521c;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btne {
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

.btns {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
  color: white;
  border: none;
}

.material-icons {
  font-size: 20px;
}

.btn-link i {
  font-size: 1.5rem;
  color: #b7642d;
}

.btn-link {
  text-decoration: none;
  padding: 0;
  margin-left: 8px;
}

.btn-link:hover {
  background-color: #000000;
}

.btn-link:hover i {
  color: #ffffff;
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
  color: rgb(0, 0, 0);
  font-weight: bold;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.custom-notify .close:hover {
  opacity: 1;
}

.photo-delete-btn {
  margin-left: 8px;
}


.botonservicio:hover {
  background-color: black;
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