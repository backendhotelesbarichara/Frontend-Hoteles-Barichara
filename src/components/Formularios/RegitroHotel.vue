<script setup>
import { ref, onMounted } from 'vue';
import { useStoreHotel } from '../../stores/hotel.js';
import { useStoreUsuarios } from '../../stores/usuario.js';
import { useRouter } from 'vue-router';

const useHotel = useStoreHotel();
const useUsuario = useStoreUsuarios();
const router = useRouter();
const nombre = ref("");
const descripcion = ref("");
const direccion = ref("");
const correo = ref("");
const telefono = ref("");
const pisos = ref("");
const servicio = ref(""); // Servicio temporal
const servicios = ref([]); // Array de servicios
const idUsuario = ref(useUsuario.id)
const uploadedImages = ref([]) // Almacenar las imágenes cargadas
const imagesSelected = ref(0) // Contador de imágenes seleccionadas
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const loadingHotel = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
const loadingFotos = ref(false);
const data = ref({
  nombre: '',
  logo: '',
  fotos: [],
  servicio: [],
  descripcion: '',
  direccion: '',
  correo: '',
  telefono: '',
  pisos: '',
  idUsuario: '',
});
const selectedImage = ref(null); // Para almacenar la URL del logo seleccionado
const selectedPhotos = ref([]); // Para almacenar las fotos seleccionadas
const nuevoServicio = ref(""); // Servicio temporal
let modalInstance = null; // Instancia del modal Bootstrap
let modalFotosInstance = null; // Instancia del modal Bootstrap para las fotos
let modalServiciosInstance = null; // Instancia del modal de servicios

const agregarHotel = async () => {

  if (data.value.servicio.length === 0) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = 'Debe añadir por lo menos un servicio para el hotel';
    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    return;
  }

  data.value.nombre = nombre.value;
  data.value.descripcion = descripcion.value;
  data.value.direccion = direccion.value;
  data.value.correo = correo.value;
  data.value.telefono = telefono.value;
  data.value.pisos = pisos.value;
  data.value.idUsuario = idUsuario.value;

  notificacionCargando.value = true;
  mensajeCargando.value = 'Agregando hotel...';
  loadingHotel.value = true;

  try {
    const response = await useHotel.agregar(data.value);

    if (useHotel.estatus === 200) {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionVisible.value = true;
      mensajeNotificacion.value = 'Hotel agregado con éxito';

      setTimeout(() => {
        notificacionCargando.value = false;
        mensajeCargando.value = '';
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
        router.push('/PanelDueno')
      }, 3000);

    } else if (useHotel.estatus === 400 || useHotel.estatus === 404 || useHotel.estatus === 500) {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionValidacion.value = true;
      mensajeValidacion.value = useHotel.validacion;

      setTimeout(() => {
        notificacionValidacion.value = false;
        mensajeValidacion.value = '';
      }, 3000);
    }
  } catch (error) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = useHotel.validacion;

    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    console.log(error);
  } finally {
    loadingHotel.value = false;
  }
};

async function subirFotosHotel(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  loadingFotos.value = true;
  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo imagen del hotel, por favor espere...';

  try {
    // Bucle a través de cada archivo y sube uno a la vez
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirGrupoFotos(data.value._id, file);  // Ajustado si `data.value._id` no es necesario

      // Agregar la URL de la imagen subida a `data.value.imagen`
      data.value.fotos.push({ url: imageUrl });
    }

    mensajeCargando.value = 'Imagen subida exitosamente';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 6000);
  } catch (error) {
    console.error("Error al subir las fotos:", error);
    mensajeCargando.value = 'Error al subir las imágenes';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 3000);
  } finally {
    loadingFotos.value = false;
  }
}

async function subirLogoHotel(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  loadingFotos.value = true;
  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo logo del hotel, por favor espere...';

  try {
    // Bucle a través de cada archivo y sube uno a la vez
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirLogo(data.value._id, file);  // Ajustado si `data.value._id` no es necesario

      // Agregar la URL de la imagen subida a `data.value.imagen`
      data.value.logo = imageUrl;  // Reemplaza cualquier imagen anterior con la nueva
    }

    mensajeCargando.value = 'Logo del hotel subido exitosamente';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 6000);
  } catch (error) {
    console.error("Error al subir las fotos:", error);
    mensajeCargando.value = 'Error al subir las imágenes';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 3000);
  } finally {
    loadingFotos.value = false;
  }
}

function verLogo() {
  selectedImage.value = data.value.logo;
  if (!modalInstance) {
    const modalElement = document.getElementById('imageModal');
    modalInstance = new bootstrap.Modal(modalElement, { keyboard: true });
  }
  modalInstance.show();
}

// Elimina el logo actual
function eliminarLogo() {
  data.value.logo = ''; // Limpia el logo del objeto data
  selectedImage.value = null; // Limpia la imagen seleccionada
  if (modalInstance) modalInstance.hide(); // Cierra el modal
}

// Abre el modal para mostrar las fotos
function verFotos() {
  selectedPhotos.value = [...data.value.fotos]; // Copiar las fotos actuales
  if (!modalFotosInstance) {
    const modalElement = document.getElementById('photosModal');
    modalFotosInstance = new bootstrap.Modal(modalElement, { keyboard: true });
  }
  modalFotosInstance.show();
}

// Elimina una foto específica
function eliminarFoto(index) {
  data.value.fotos.splice(index, 1); // Eliminar de la lista principal
  selectedPhotos.value.splice(index, 1); // Eliminar del modal
}

// Función para abrir el modal de servicios
function verServicios() {
  if (!modalServiciosInstance) {
    const modalElement = document.getElementById('modalServicios');
    modalServiciosInstance = new bootstrap.Modal(modalElement, { keyboard: true });
  }
  modalServiciosInstance.show();
}

// Añadir un nuevo servicio desde el modal
function agregarServicioModal() {
  if (nuevoServicio.value.trim() !== "") {
    data.value.servicio.push(nuevoServicio.value.trim());
    nuevoServicio.value = ""; // Limpia el input
  }

  console.log(data.value.servicio)
}

// Eliminar un servicio específico desde el modal
function eliminarServicioModal(index) {
  data.value.servicio.splice(index, 1);
}


function limpiar() {
  data.value = {
    nombre: '',
    logo: '',
    fotos: [],
    servicios: [],
    descripcion: '',
    direccion: '',
    correo: '',
    telefono: '',
    pisos: '',
    idUsuario: '',
  }
  nombre.value = '';
  descripcion.value = '';
  direccion.value = '';
  correo.value = '';
  telefono.value = '';
  pisos.value = '';
  selectedImage.value = null;
  selectedPhotos.value = [];
  nuevoServicio.value = [];
}

function irPanelDueno() {
  router.push('/PanelDueno')
}

// Limpia la instancia del modal al desmontarlo
onMounted(() => {
  const modalElement = document.getElementById('imageModal');
  modalElement.addEventListener('hidden.bs.modal', () => {
    modalInstance = null;
  });

  const modalFotosElement = document.getElementById('photosModal');
  modalFotosElement.addEventListener('hidden.bs.modal', () => {
    modalFotosInstance = null;
  });

  const modalServiciosElement = document.getElementById('modalServicios');
  modalServiciosElement.addEventListener('hidden.bs.modal', () => {
    modalServiciosInstance = null;
  });
});
</script>

<template>
  <main>
    <div class="galeria">
      <div class="Hoteles">
        <h5>Registra tu hotel</h5>
      </div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div class="container" style="margin-top: 20px; margin-bottom: 20px">
        <form enctype="multipart/form-data" method="post" @submit.prevent="agregarHotel">
          <div class="card shadow mb-3">
            <div class="card-header py-3">
              <p class="text-primary m-0 fw-bold">
                <span style="color:  #b7642d">Diligencie los siguientes datos para realizar el registro del hotel
                  correctamente</span>
              </p>
            </div>
            <div class="card-body">
              <div class="row">

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_hotel"><strong>Nombre <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="nombre" type="text" id="id_price_service"
                      placeholder="Nombre del hotel" name="nombre_hotel" required="" />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_hotel"><strong>Descripción <span
                          class="text-danger">*</span></strong></label>
                    <textarea class="form-control" v-model="descripcion" type="text" id="id_price_service"
                      placeholder="Descripción del hotel" style="height: 70px;"></textarea>
                  </div>
                </div>
                <div class="col-sm-12 col-md-8 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_hotel"><strong>Dirección <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="direccion" type="text" id="id_name_service"
                      placeholder="Ej: Calle 6A #3-20 Barrio Rojo" name="direccion_hotel" required="" />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="tel_contacto"><strong>Teléfono <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="telefono" type="text" id="id_price_service-2"
                      placeholder="Teléfono de contacto" name="tel_contacto"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '')" pattern="[0-9]{10,}"
                      title="Ingresa al menos 10 números" required="" />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="email"><strong>Correo <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="correo" type="email" id="id_price_service-3"
                      placeholder="Correo valido" name="email" required="" />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="email"><strong>Pisos <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="pisos" type="number" id="id_price_service-3"
                      placeholder="Cantidad pisos del hotel" name="email" required="" />
                  </div>
                </div>
                <div class="col-12 mb-3">
                  <strong>Servicios del Hotel <span class="text-danger">*</span></strong>
                  <p>
                    (Puedes agregar, visualizar o eliminar servicios dando clic al botón "Ver Servicios"
                  </p>
                  <button class="btn btn-custom" style="background-color: #b7642d; color: #fff;" @click="verServicios">
                    <i class="bi bi-eye"></i> Ver Servicios
                  </button>
                </div>




                <hr>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Logo del Hotel</strong>
                    <p>Máximo 1 imagen (La imagen debe pesar como máximo 10 MB)</p>
                    <div style="margin-top: -15px;" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px;" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <input class="foto" style="margin-top: 13px;" type="file" ref="fileInput" accept="image/*"
                        @change="subirLogoHotel" />
                    </div>
                    <!-- Botón para ver el logo -->
                    <div style="display: flex; gap: 10px;">
                      <button v-if="data.logo" style="margin-top: 15px; background-color: #b7642d; color: #fff;"
                        type="button" class="btn btn-custom" @click="verLogo">
                        <i class="bi bi-eye"></i> Ver logo
                      </button>
                      <!-- Botón para eliminar el logo -->
                      <button v-if="data.logo" style="margin-top: 15px; background-color: #dc3545; color: #fff;"
                        type="button" class="btn btn-custom" @click="eliminarLogo">
                        <i class="bi bi-trash"></i> Eliminar logo
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Imágenes del Hotel <span class="text-danger">*</span></strong>
                    <p>
                      (La primera imagen se usará como foto
                      principal del hotel, cada imagen debe pesar como máximo 10MB)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                        @change="subirFotosHotel" required />
                    </div>
                    <!-- Botón para abrir el modal de fotos -->
                    <button v-if="data.fotos.length > 0" type="button"
                      style="background-color: #b7642d; color: #fff; margin-top: 20px;" class="btn btn-custom btn"
                      @click="verFotos">
                      <i class="bi bi-eye"></i> Ver Imágenes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mb-3">
            <button class="btn btn-outline-danger btn" type="button" style="margin-right: 5px"
              @click="irPanelDueno()">Cancelar</button>
            <button class="btn btn-outline-dark btn" type="button" style="margin-right: 5px" @click="limpiar()">
              Limpiar</button>
            <button class="btn btn-custom btn" type="submit" style="background:  #b7642d; color: #fff"
              :disabled="loadingHotel">
              <span v-if="loadingHotel" class="spinner-border spinner-border-sm" role="status"
                aria-hidden="true"></span>
              <span v-if="!loadingHotel"><i class="bi bi-floppy-fill"></i> Registrar</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para visualizar imágenes -->
    <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="imageModalLabel" style="color: black;">Vista previa del logo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img :src="selectedImage" alt="Vista previa del logo" class="img-fluid rounded" v-if="selectedImage" />
            <p v-else>No hay logo para mostrar</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="eliminarLogo">
              <i class="bi bi-trash"></i> Eliminar logo
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="photosModal" tabindex="-1" aria-labelledby="photosModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="photosModalLabel" style="color: black;">Imágenes del hotel</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <!-- Mostrar cada foto con un botón para eliminar -->
              <div v-for="(photo, index) in selectedPhotos" :key="index" class="col-6 col-md-4 mb-3">
                <div class="card">
                  <img :src="photo.url" alt="Foto del hotel" class="card-img-top"
                    style="object-fit: cover; height: 150px;" />
                  <div class="card-body text-center">
                    <button class="btn btn-danger btn-sm" @click="eliminarFoto(index)">
                      <i class="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="selectedPhotos.length === 0" class="text-center">No hay imágenes para mostrar.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalServicios" tabindex="-1" aria-labelledby="modalServiciosLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalServiciosLabel" style="color: black;">Servicios del Hotel</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Contenedor fijo para añadir un nuevo servicio -->
            <div class="d-flex mb-3">
              <input type="text" class="form-control me-2" placeholder="Añadir nuevo servicio"
                v-model="nuevoServicio" />
              <button class="btn btn-success" @click="agregarServicioModal">
                <i class="bi bi-plus-lg"></i> Añadir
              </button>
            </div>

            <!-- Contenedor desplazable para la lista de servicios -->
            <div class="overflow-auto" style="max-height: 300px;">
              <ul class="list-group">
                <li v-for="(servicio, index) in data.servicio" :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  {{ servicio }}
                  <button class="btn btn-sm btn-danger" @click="eliminarServicioModal(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </li>
                <p v-if="data.servicio.length === 0" class="text-center">No hay servicios registrados.</p>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>





    <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show" role="alert">
      {{ mensajeNotificacion }}
    </div>
    <div v-if="notificacionValidacion" class="custom-notify alert alert-danger alert-dismissible fade show"
      role="alert">
      {{ mensajeValidacion }}
    </div>
    <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show" role="alert">
      {{ mensajeCargando }}
    </div>
  </main>
</template>

<style scoped>
.logo {
  position: relative;
  max-width: 30px;
  max-height: 40px;
  margin-top: 5px;
  transition: 1s;
}

.modal-content {
  border-radius: 10px;
}

.overflow-auto {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-group-item button {
  font-size: 14px;
  padding: 5px 10px;
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

.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
}

.list-group-item button {
  font-size: 14px;
  padding: 5px 10px;
}


.custom-notify .close:hover {
  opacity: 1;
}

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }
}
</style>