<script setup>
import { ref } from 'vue';
import { useStoreHotel } from '../../stores/hotel.js';
import { useStoreUsuarios } from '../../stores/usuario.js';

const useHotel = useStoreHotel();
const useUsuario = useStoreUsuarios();
const nombre = ref("");
const descripcion = ref("");
const direccion = ref("");
const correo = ref("");
const telefono = ref("");
const pisos = ref("");
const idUsuario = ref(useUsuario.id)
const uploadedImages = ref([]) // Almacenar las imágenes cargadas
const imagesSelected = ref(0) // Contador de imágenes seleccionadas
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
const loadingFotos = ref(false);
const data = ref({
  nombre: '',
  logo: '',
  fotos: [],
  descripcion: '',
  direccion: '',
  correo: '',
  telefono: '',
  pisos: '',
  idUsuario: '',
});

const agregarHotel = async () => {

  data.value.nombre = nombre.value;
  data.value.descripcion = descripcion.value;
  data.value.direccion = direccion.value;
  data.value.correo = correo.value;
  data.value.telefono = telefono.value;
  data.value.pisos = pisos.value;
  data.value.idUsuario = idUsuario.value;

  try {
    const response = await useHotel.agregar(data);

    if (useHotel.estatus === 200) {
      console.log("Hotel añadido")
    } else if (useHotel.estatus === 400) {
      return;
    }
  } catch (error) {
    console.log('Error al agregar hotel:', error);
  }
};

async function subirFotosHotel(event) {
  const files = event.target.files;
  if (files.length === 0) return;

  loadingFotos.value = true;
  notificacionCargando.value = true;
  mensajeCargando.value = 'Subiendo imagen del hotel...';

  try {
    // Bucle a través de cada archivo y sube uno a la vez
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirGrupoFotos(data.value._id, file);  // Ajustado si `data.value._id` no es necesario

      // Agregar la URL de la imagen subida a `data.value.imagen`
      const fotoObj = { url: imageUrl };
      data.value.fotos = [fotoObj];  // Reemplaza cualquier imagen anterior con la nueva
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
  mensajeCargando.value = 'Subiendo imagen...';

  try {
    // Bucle a través de cada archivo y sube uno a la vez
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = await useHotel.subirLogo(data.value._id, file);  // Ajustado si `data.value._id` no es necesario

      // Agregar la URL de la imagen subida a `data.value.imagen`
      data.value.logo = imageUrl;  // Reemplaza cualquier imagen anterior con la nueva
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
                <hr>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Logo <span class="text-danger">*</span></strong>
                    <p>
                      {{ imagesSelected }} imágenes seleccionadas (Máximo 1)
                    </p>
                    <div style="margin-top: -15px;" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px;" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <input class="foto" style="margin-top: 13px;" type="file" ref="fileInput" accept="image/*"
                        @change="subirLogoHotel" multiple required />
                    </div>
                    <!-- Contenedor de las imágenes con margen -->
                    <div style="margin-top: 15px; display: flex" class="d-flex flex-wrap gap-1">
                      <div v-for="(image, index) in uploadedImages" :key="index" class="image-preview">
                        <img class="fixed-size-image" :src="image.src" :alt="image.alt" />
                      </div>
                    </div>
                    <button style="background-color:  #b7642d; color: #fff; margin-top: 20px;"
                      class="btn btn-custom btn" v-if="uploadedImages.length > 0">
                      <i class="bi bi-trash3-fill"></i> Limpiar Imágenes
                    </button>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Imagenes <span class="text-danger">*</span></strong>
                    <p>
                      {{ imagesSelected }} imágenes seleccionadas (La primera imagen se usará como foto principal del
                      hotel, cada imagen debe pesar menos de 10MB)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <br />
                      <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                        @change="subirFotosHotel" required />
                    </div>
                    <!-- Contenedor de las imágenes con margen -->
                    <div style="margin-top: 15px; display: flex" class="d-flex flex-wrap gap-1">
                      <div v-for="(image, index) in uploadedImages" :key="index" class="image-preview">
                        <img class="fixed-size-image" :src="image.src" :alt="image.alt" />
                      </div>
                    </div>
                    <button style="
                                  background-color:  #b7642d;
                                  color: #fff;
                                  margin-top: 20px;
                                " class="btn btn-custom btn">
                      <i class="bi bi-eye"></i> Ver Imágenes
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="text-center mb-3">
            <a class="btn btn-outline-danger btn" role="button" href="#" style="margin-right: 5px">Cancelar</a><button
              class="btn btn-outline-dark btn" type="reset" style="margin-right: 5px">
              Limpiar</button><button class="btn btn-custom btn" type="submit"
              style="background:  #b7642d; color: #fff">
              <i class="bi bi-floppy-fill"></i>
              Registrar
            </button>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->
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
</style>