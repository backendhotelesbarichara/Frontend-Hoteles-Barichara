<script setup>
import { ref } from 'vue';
import { useStorePiso } from '../../stores/piso.js';
import { useStoreHabitacion } from '../../stores/habitacion.js';
import { useRouter } from 'vue-router';

const router = useRouter();
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
const uploadedImages = ref([]);
const imagesSelected = ref(0);
const numPiso = ref(usePiso.numPisoSelec);
const idPiso = ref(usePiso.idPisoSeleccionado);

const agregarHabitacion = async () => {
  const data = {
    numero_habitacion: num_habitacion.value,
    descripcion: descripcion.value,
    tipo_habitacion: tipo_habitacion.value,
    cantidad_personas: capacidad_max.value,
    servicio: servicios.value,
    precio_noche: precio.value,
    idPiso: idPiso.value,
  };

  try {
    const response = await useHabitacion.agregar(data);

    if (useHabitacion.estatus === 200) {
      router.push('/DPanelHabitaciones')
      console.log("Habitación añadida");
    } else if (useHabitacion.estatus === 400) {
      return;
    }
  } catch (error) {
    console.log('Error al agregar habitación:', error);
  }
};

const handleFileUpload = (event) => {
  if (imagesSelected.value >= 4) {
    // Límite de 4 imágenes alcanzado, no permitir más
    return;
  }

  const fileInput = event.target;
  const files = fileInput.files;

  // Recorrer los archivos seleccionados
  for (let i = 0; i < files.length; i++) {
    if (imagesSelected.value >= 4) {
      // Límite de 4 imágenes alcanzado, no permitir más
      break;
    }

    const file = files[i];
    const imageURL = URL.createObjectURL(file);

    uploadedImages.value.push({ src: imageURL, alt: "Imagen" });
    imagesSelected.value++;
  }

  // Limpiar el campo de entrada de archivos si es necesario
  fileInput.value = "";
};

const clearImages = () => {
  // Restablecer el array de imágenes cargadas y el contador
  uploadedImages.value = [];
  imagesSelected.value = 0;
};

const addServicio = () => {
  if (servicioInput.value.trim() !== "") {
    servicios.value.push(servicioInput.value.trim());
    servicioInput.value = "";
  }
};

const removeServicio = (index) => {
  servicios.value.splice(index, 1);
};

const addTipo = () => {
  if (tipoInput.value.trim() !== "") {
    tipo_habitacion.value.push(tipoInput.value.trim());
    tipoInput.value = "";
  }
};

const removeTipo = (index) => {
  tipo_habitacion.value.splice(index, 1);
};
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
                <span style="color: #b7642d">Rellene los campos obligatorios *</span>
              </p>
              <p class="fw-bold">Añadir habitación al PISO {{ numPiso }}</p>
            </div>

            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"><strong>Número habitación *</strong></label>
                    <input class="form-control" v-model="num_habitacion" type="text" id="alias_habitacion"
                      placeholder="Num habitación..." name="alias_habitacion" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="descripcionSitio"><strong>Descripción *</strong></label>
                    <textarea class="form-control" v-model="descripcion" id="descripcionSitio"
                      placeholder="Describa la habitación..." name="descripcionSitio" rows="1" required></textarea>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="tipo_habitacion"><strong>Tipo de habitación *</strong></label>
                    <div class="input-group">
                      <input class="form-control" v-model="tipoInput" type="text" id="tipo_habitacion"
                        placeholder="Ej: Simple, Doble" name="tipo_habitacion" />
                      <button type="button" class="btn btn-primary" @click="addTipo"
                        style="background: #b7642d">Agregar</button>
                    </div>
                    <div v-if="tipo_habitacion.length > 0">
                      <button type="button" class="btn btn-secondary mt-2" data-bs-toggle="modal"
                        data-bs-target="#tipoModal">Ver tipos añadidos</button>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="servicios"><strong>Servicios *</strong></label>
                    <div class="input-group">
                      <input class="form-control" v-model="servicioInput" type="text" id="servicios"
                        placeholder="Ej: Wifi, TV" name="servicios" />
                      <button type="button" class="btn btn-primary" @click="addServicio"
                        style="background: #b7642d">Agregar</button>
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
                    <label class="form-label" for="capacidad_maxima"><strong>Capacidad máxima *</strong></label>
                    <input class="form-control" v-model="capacidad_max" type="number" id="capacidad_maxima"
                      placeholder="Máximo de personas..." name="capacidad_maxima" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="precio"><strong>Precio *</strong></label>
                    <input class="form-control" v-model="precio" type="number" id="precio"
                      placeholder="Precio por noche..." name="precio" required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Imagen principal *</strong>
                    <p>(Máximo 4)</p>
                    <div class="logo">
                      <p class="logop">
                        <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <br />
                      <input class="foto" style="margin-top: 13px"  type="file"
                        accept="image/*" multiple @change="handleFileUpload" />
                    </div>
                    <!-- Contenedor de las imágenes con margen -->
                    <div style="margin-top: 15px; display: flex" class="d-flex flex-wrap gap-1">
                      <div v-for="(image, index) in uploadedImages" :key="index" class="image-preview">
                        <img class="fixed-size-image" :src="image.src" :alt="image.alt" />
                      </div>
                    </div>
                    <button style="background-color: #b7642d; color: #fff; margin-top: 20px;" class="btn btn-custom"
                      @click="clearImages" v-if="uploadedImages.length > 0">
                      <i class="bi bi-trash3-fill"></i> Limpiar Imágenes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mb-3">
            <a class="btn btn-outline-danger" role="button" href="#" style="margin-right: 5px">Cancelar</a>
            <button class="btn btn-outline-dark" type="reset" style="margin-right: 5px">Limpiar</button>
            <button class="btn btn-custom" type="submit" style="background: #b7642d; color: #fff">
              <i class="bi bi-floppy-fill"></i> Registrar
            </button>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->

      <!-- Modal para ver los servicios -->
      <div class="modal fade" id="serviciosModal" tabindex="-1" aria-labelledby="serviciosModalLabel" aria-hidden="true">
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
                  <button type="button" class="btn btn-danger btn-sm" @click="removeServicio(index)">Eliminar</button>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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
                <li v-for="(tipo, index) in tipo_habitacion" :key="index"
                  class="list-group-item d-flex justify-content-between align-items-center">
                  {{ tipo }}
                  <button type="button" class="btn btn-danger btn-sm" @click="removeTipo(index)">Eliminar</button>
                </li>
              </ul>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
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

/* Estilos para resoluciones de 1000px o más */
@media screen and (min-width: 1000px) {
  .row .col-6 {
    flex: 0 0 50%;
    /* Establece un ancho del 50% para cada columna en pantallas de 1000px o más */
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
