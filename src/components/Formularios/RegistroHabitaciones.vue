<script setup>
import { ref, onMounted } from 'vue';
import { useStorePiso } from '../../stores/piso.js';
import { useStoreHabitacion } from '../../stores/habitacion.js';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const usePiso = useStorePiso();
const useHabitacion = useStoreHabitacion();
const num_habitacion = ref("");
const descripcion = ref("");
const capacidad_max = ref("");
const servicios = ref([]);
const servicioInput = ref("");
const precio = ref("");
const tipo_habitacion = ref([]);
const tipoInput = ref("");
const mensajeNotificacion = ref('');
const mensajeValidacion = ref('');
const uploadedImages = ref([]);
const data = ref({
  tipo_habitacion: [],
});
const loading = ref(false);
const loadingHabitacion = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const modalImagenesVisible = ref(false);
const numPiso = ref(usePiso.numPisoSelec);
const idPiso = ref(usePiso.idPisoSeleccionado);
const idHotel = ref();

const agregarHabitacion = async () => {
  data.value = {
    numero_habitacion: num_habitacion.value,
    descripcion: descripcion.value,
    imagenes: uploadedImages.value,
    cantidad_personas: capacidad_max.value,
    tipo_habitacion: data.value.tipo_habitacion,
    servicio: servicios.value,
    precio_noche: precio.value,
    idPiso: idPiso.value,
  };

  loadingHabitacion.value = true;

  try {
    const response = await useHabitacion.agregar(data.value);

    if (useHabitacion.estatus === 200) {
      notificacionVisible.value = true;
      mensajeNotificacion.value = 'Habitación creada exitosamente'
      setTimeout(() => {
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
        goToHabitaciones();
      }, 3000);
/*       console.log(response) */
      console.log("Habitación añadida");
    } else if (useHabitacion.estatus === 400 || useHabitacion.estatus === 404 || useHabitacion.estatus === 500) {
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
    console.log('Error al agregar habitación:', error);
  } finally {
    loadingHabitacion.value = false;
  }
};

// Función para abrir el modal
const abrirModalImagenes = () => {
  modalImagenesVisible.value = true;
};

// Función para cerrar el modal
const cerrarModalImagenes = () => {
  modalImagenesVisible.value = false;
};

// Modificamos la función para que al subir las fotos se habilite el botón de visualización de imágenes
async function subirFotosHabitacion(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  loading.value = true;

  if (!data.value.imagenes) {
    data.value.imagenes = [];
  }

  const fotosAntesDeSubir = [...data.value.imagenes];

  try {
    data.value.imagenes = fotosAntesDeSubir.filter(foto => !foto.eliminada);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHabitacion.subirGrupoFotos(data.value._id, file);

      const fotoObj = { url: imageUrl };
      data.value.imagenes.push(fotoObj);
      /* console.log("soy data fotos", data.value) */
    }

    uploadedImages.value = data.value.imagenes;
    notificacionVisible.value = true;
    mensajeNotificacion.value = '¡Imagen subida exitosamente!'
    setTimeout(() => {
      notificacionVisible.value = false;
      mensajeNotificacion.value = '';
    }, 3000);
  } catch (error) {
    console.error('Error al subir las fotos:', error);
  } finally {
    loading.value = false;
  }
}

const addServicio = () => {
  if (servicioInput.value.trim() !== "") {
    servicios.value.push(servicioInput.value.trim());
    servicioInput.value = "";
  }
};

const removeServicio = (index) => {
  servicios.value.splice(index, 1);
};

// Función para eliminar una imagen tanto del array 'uploadedImages' como de 'data.value.imagenes'
const eliminarImagen = (index) => {
  uploadedImages.value.splice(index, 1);

  if (data.value.imagenes && data.value.imagenes.length > 0) {
    data.value.imagenes.splice(index, 1);
  }
};

const addTipo = () => {
  if (tipoInput.value.trim() !== "") {
    data.value.tipo_habitacion.push(tipoInput.value.trim());
    tipoInput.value = "";
/*     console.log(tipo_habitacion);
    console.log(data.value.tipo_habitacion); */
  }
};

const removeTipo = (index) => {
  data.value.tipo_habitacion.splice(index, 1);
};

function goToHabitaciones() {
  router.push({ path: '/DPanelHabitaciones', query: { id: idHotel.value } });
}

onMounted(() => {
  const Hotel = route.query.id;
  if (Hotel) {
    idHotel.value = Hotel;
  }
})
</script>

<template>
  <main>
    <div class="galeria">
      <div class="Hoteles">
        <h5>Registra tus habitaciones</h5>
      </div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div class="container" style="margin-top: 20px; margin-bottom: 20px">
        <form enctype="multipart/form-data" method="post" @submit.prevent="agregarHabitacion">
          <div class="card shadow mb-3">
            <div class="card-header py-3 d-flex justify-content-between">
              <p class="text-primary m-0 fw-bold">
                <span style="color: #b7642d">Rellene los campos obligatorios <span class="text-danger">*</span></span>
              </p>
              <p class="fw-bold">Añadir habitación al PISO {{ numPiso }}</p>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"><strong>Número habitación <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="num_habitacion" type="text" id="alias_habitacion"
                      placeholder="Num habitación..." name="alias_habitacion" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="descripcionSitio"><strong>Descripción <span
                          class="text-danger">*</span></strong></label>
                    <textarea class="form-control" v-model="descripcion" id="descripcionSitio"
                      placeholder="Describa la habitación..." name="descripcionSitio" rows="1" required></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="tipo_habitacion"><strong>Tipo de habitación <span
                          class="text-danger">*</span></strong></label>
                    <div class="input-group">
                      <input class="form-control" v-model="tipoInput" type="text" id="tipo_habitacion"
                        placeholder="Ej: Habitación cama sencilla" name="tipo_habitacion" />
                      <button type="button" class="btn" @click="addTipo"
                        style="background: #b7642d; color: white;">Agregar</button>
                    </div>
                    <div v-if="data.tipo_habitacion.length > 0">
                      <button type="button" class="btn btn-secondary mt-2" data-bs-toggle="modal"
                        data-bs-target="#tipoModal">Ver tipos añadidos</button>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="servicios"><strong>Servicios <span
                          class="text-danger">*</span></strong></label>
                    <div class="input-group">
                      <input class="form-control" v-model="servicioInput" type="text" id="servicios"
                        placeholder="Ej: Wifi, TV" name="servicios" />
                      <button type="button" class="btn" @click="addServicio"
                        style="background: #b7642d; color: white;">Agregar</button>
                    </div>
                    <div v-if="servicios.length > 0">
                      <button type="button" class="btn btn-secondary mt-2" data-bs-toggle="modal"
                        data-bs-target="#serviciosModal">Ver servicios añadidos</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="capacidad_maxima"><strong>Capacidad máxima <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="capacidad_max" type="number" id="capacidad_maxima"
                      placeholder="Máximo de personas..." name="capacidad_maxima" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="precio"><strong>Precio <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" v-model="precio" type="number" id="precio"
                      placeholder="Precio por noche por persona..." name="precio" required />
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <strong>Imágenes de la habitación <span class="text-danger">*</span></strong>
                    <p>(Debe haber mínimo 1 foto, cada foto debe como máximo 10MB)</p>

                    <div class="logo">
                      <p class="logop">
                        <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <input class="foto" style="margin-top: 13px" type="file" accept="image/*" multiple
                        @change="subirFotosHabitacion" required />
                    </div>

                    <!-- Spinner de carga -->
                    <div v-if="loading" class="loading-spinner fw-bold">Subiendo imágenes, por favor espere...</div>
                  </div>
                  <div v-if="uploadedImages.length > 0">
                    <button type="button" class="btn btn-secondary mt-2" @click="abrirModalImagenes">
                      Ver imágenes subidas
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
          <div class="text-center mb-3">
            <button class="btn btncancelar" type="button" :disabled="loading"
              style="margin-right: 5px; background-color: #dc3545; color: white;"
              @click="goToHabitaciones()">Cancelar</button>
            <button class="btn btn-custom" type="submit" style="background: #b7642d; color: #fff" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span v-else> <i class="bi bi-floppy-fill"></i> Registrar</span>
            </button>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->

      <!-- Modal para ver los servicios -->
      <div class="modal fade" id="serviciosModal" tabindex="-1" aria-labelledby="serviciosModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-dark" id="serviciosModalLabel">Servicios añadidos</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li v-for="(servicio, index) in servicios" :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  {{ servicio }}
                  <button type="button" class="btn btn-danger btn-sm" style="margin-left: 10px;"
                    @click="removeServicio(index)">Eliminar</button>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para ver los tipos de habitación -->
      <div class="modal fade" id="tipoModal" tabindex="-1" aria-labelledby="tipoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-dark" id="tipoModalLabel">Tipos de habitación añadidos</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li v-for="(tipo, index) in data.tipo_habitacion" :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  {{ tipo }}
                  <button type="button" class="btn btn-danger btn-sm" style="margin-left: 10px;"
                    @click="removeTipo(index)">Eliminar</button>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="modalImagenesVisible" class="modal fade show" tabindex="-1"
      style="display: block; background: rgba(0, 0, 0, 0.5);">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Imágenes Subidas</h1>
            <button type="button" class="btn-close" @click="cerrarModalImagenes"></button>
          </div>
          <div class="modal-body">
            <div class="d-flex flex-wrap gap-2">
              <div v-for="(image, index) in uploadedImages" :key="index" class="image-preview position-relative">
                <!-- Imagen -->
                <img class="fixed-size-image" :src="image.src || image.url" :alt="image.alt" />
                <!-- Botón para eliminar la imagen -->
                <button @click="eliminarImagen(index)" class="btn btn-danger btn-sm position-absolute" id="btn-danger"
                  style="top: 5px; right: 5px;">Eliminar</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cerrarModalImagenes">Cerrar</button>
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

.position-relative {
  position: relative;
}

.fixed-size-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 10px;
  border: 2px solid #b7642d5b;
}

#btn-danger {
  position: absolute;
  top: 5px;
  right: 5px;
}


.modal-body {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
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

.btncancelar:hover {
  background-color: white;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-spinner {
  font-size: 16px;
  color: #b7642d;
  margin-top: 10px;
  margin-left: 30px;
  animation: pulse 1s infinite ease-in-out;
  /* Pulsing animation */
}


/* Estilos para la notificación */
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
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: bold;
}

.custom-notify .close:hover {
  opacity: 1;
}

/* Estilos para resoluciones de 1000px o más */
@media screen and (min-width: 1000px) {
  .row .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }

  .d-flex {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>