<script setup>
import { ref, onMounted } from 'vue';
import { useStoreProveedor } from '../../stores/proveedor';
import { useStoreSitioTuristico } from '../../stores/sitio_turistico';
import { useRouter } from 'vue-router';
import 'bootstrap/dist/js/bootstrap.bundle';

// Definir variables reactivas
const useProveedor = useStoreProveedor();
const useSitioTuristico = useStoreSitioTuristico();
const nombre = ref('');
const telefono = ref();
const sitioSeleccionado = ref('');
const sitios = ref([])
const router = useRouter();
const data = ref({
  nombre: '',
  telefono: '',
  foto: '',
  idSitioTuristico: '',
})
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
const loadingProveedor = ref(false);
const loadingFotos = ref(false);
let modalInstance;

const agregarProveedor = async () => {
  if (data.value.foto.length === 0) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = 'Debe añadir una foto para el proveedor';
    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    return;
  }

  data.value.nombre = nombre.value;
  data.value.telefono = telefono.value;
  data.value.idSitioTuristico = sitioSeleccionado.value._id;

  notificacionCargando.value = true;
  mensajeCargando.value = 'Agregando proveedor';
  loadingProveedor.value = true;

  try {
    const response = await useProveedor.agregar(data.value);

    if (useProveedor.estatus === 200) {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionVisible.value = true;
      mensajeNotificacion.value = 'Proveedor agregado con éxito';

      setTimeout(() => {
        notificacionCargando.value = false;
        mensajeCargando.value = '';
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
        irPanelProveedor();
      }, 3000);
    } else {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionValidacion.value = true;
      mensajeValidacion.value = useProveedor.validacion;

      setTimeout(() => {
        notificacionValidacion.value = false;
        mensajeValidacion.value = '';
      }, 3000);
    }
  } catch (error) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = useProveedor.validacion;

    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    console.log(error);
  } finally {
    loadingProveedor.value = false;
  }
};

const subirFotoProveedor = async (event) => {
  const files = event.target.files;
  if (files.length === 0) return;

  loadingFotos.value = true;
  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo imagen del proveedor, por favor espere...';

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useProveedor.subirFoto(data.value._id, file);

      data.value.foto = imageUrl;
    }

    mensajeCargando.value = 'Imagen subida exitosamente';
    setTimeout(() => {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
    }, 6000);
  } catch (error) {
    console.error('Error al subir la foto:', error);
    notificacionCargando.value = false;
    mensajeNotificacion.value = '';
    notificacionValidacion.value = true;
    mensajeValidacion.value = 'Error al subir la imagen';
    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
  } finally {
    loadingFotos.value = false;
  }
};

async function getSitiosTuristicos() {
  try {
    const response = await useSitioTuristico.getAll();
    sitios.value = response;
  } catch (error) {
    console.log(error);
  }
}

function irPanelProveedor() {
  router.push('/PanelProveedores');
}

const abrirModal = () => {
  if (modalInstance) {
    modalInstance.show();
  }
};

const eliminarImagen = () => {
  data.value.foto = '';
};

onMounted(() => {
  getSitiosTuristicos();

  const modalElement = document.getElementById('imagenesModal');
  if (modalElement) {
    modalInstance = new bootstrap.Modal(modalElement);
  }
})

</script>

<template>
  <main>
    <div class="galeria">
      <div class="Hoteles">
        <h5>Registra un proveedor</h5>
      </div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div class="container" style="margin-top: 20px; margin-bottom: 20px">
        <form @submit.prevent="agregarProveedor">
          <div class="card shadow mb-3">
            <div class="card-header py-3">
              <p class="text-primary m-0 fw-bold">
                <span style="color:  #b7642d">Rellene los campos obligatorios *</span>
              </p>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_proveedor"><strong>Nombre <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      v-model="nombre" id="nombre_proveedor" placeholder="Ej: Sprex Aguilas" name="nombre_proveedor"
                      required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_proveedor"><strong>Telefono <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="number"
                      v-model="telefono" id="nombre_proveedor" placeholder="Ej: 3222431440" name="nombre_proveedor"
                      required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_proveedor"><strong>Sitio Turístico <span
                          class="text-danger">*</span></strong></label>
                    <select id="hotelSelector" v-model="sitioSeleccionado" class="form-select text-center fw-bold">
                      <option disabled value="" selected>Asigne un sitio turístico para el proveedor</option>
                      <option v-for="sitio in sitios" :key="sitio._id" :value="sitio">{{ sitio.nombre }}</option>
                    </select>
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <strong>Foto <span class="text-danger">*</span></strong>
                    <p>
                      Máximo 1 imagen (La imagen debe pesar como máximo 10 MB)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <br />
                      <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                        @change="subirFotoProveedor" />
                    </div>
                    <div class="mt-3">
                      <button class="btn" type="button" v-if="data.foto" @click="abrirModal"
                        style="background:  #b7642d; color: #fff;">
                        Ver foto
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mb-3">
            <button class="btn btn-outline-danger btn" type="button" style="margin-right: 5px"
              @click="irPanelProveedor()" :disabled="loadingProveedor || loadingFotos">Cancelar</button>
            <button class="btn btn-custom btn" type="submit" style="background:  #b7642d; color: #fff" :disabled="loadingProveedor || loadingFotos">
              <span v-if="loadingProveedor" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else> <i class="bi bi-floppy-fill"></i> Registrar</span>
            </button>
          </div>
        </form>
      </div>

      <div class="modal fade" id="imagenesModal" tabindex="-1" aria-labelledby="imagenesModalLabel" aria-hidden="true">
        <!-- Agregar modal-dialog-scrollable para habilitar el scroll interno -->
        <div class="modal-dialog modal-lg modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="imagenesModalLabel" style="color: black;">Foto cargada</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <!-- Modal body con contenido desplazable -->
            <div class="modal-body">
              <div class="d-flex flex-wrap gap-3 justify-content-center">
                <!-- Imágenes cargadas -->
                <div v-if="data.foto" class="position-relative">
                  <img  :src="data.foto" alt="Imagen cargada" class="img-thumbnail" />
                  <!-- Botón de eliminar -->
                  <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0"
                    @click="eliminarImagen()">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show"
        role="alert">
        {{ mensajeNotificacion }}
      </div>
      <div v-if="notificacionValidacion" class="custom-notify alert alert-danger alert-dismissible fade show"
        role="alert">
        {{ mensajeValidacion }}
      </div>
      <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show" role="alert">
        {{ mensajeCargando }}
      </div>
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

@media screen and (max-width: 400px) {
  .d-flex {
    display: flex;
    justify-content: center;
    /* Centra horizontalmente los elementos */
    align-items: center;
    /* Centra verticalmente los elementos (opcional) */
  }
}

@media screen and (min-width: 1000px) {
  .container {
    max-width: 700px;
  }
}
</style>
