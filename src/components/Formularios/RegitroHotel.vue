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

const agregarHotel = async () => {

  const data = {
    nombre: nombre.value,
    descripcion: descripcion.value,
    direccion: direccion.value,
    correo: correo.value,
    telefono: telefono.value,
    pisos: pisos.value,
    idUsuario: idUsuario.value,
  };

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
              <span style="color:  #b7642d">Diligencie los siguientes datos para realizar el registro
                correctamente</span>
            </p>
          </div>
          <div class="card-body">
            <div class="row">

              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="nombre_hotel"><strong>Nombre *</strong></label>
                  <input class="form-control" v-model="nombre" type="text" id="id_price_service"
                    placeholder="Nombre del hotel" name="nombre_hotel" required="" />
                </div>
              </div>
              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="nombre_hotel"><strong>Descripción *</strong></label>
                  <textarea class="form-control" v-model="descripcion" type="text" id="id_price_service"
                    placeholder="Descripción del hotel" style="height: 70px;"></textarea>
                </div>
              </div>
              <div class="col-sm-12 col-md-8 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="direccion_hotel"><strong>Dirección *</strong></label>
                  <input class="form-control" v-model="direccion" type="text" id="id_name_service"
                    placeholder="Ej: Calle 6A #3-20 Barrio Rojo" name="direccion_hotel" required="" />
                </div>
              </div>

              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="tel_contacto"><strong>Teléfono&nbsp;*</strong></label>
                  <input class="form-control" v-model="telefono" type="text" id="id_price_service-2"
                    placeholder="Teléfono de contacto" name="tel_contacto"
                    oninput="this.value = this.value.replace(/[^0-9]/g, '')" pattern="[0-9]{10,}"
                    title="Ingresa al menos 10 números" required="" />
                </div>
              </div>
              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="email"><strong>Correo *</strong></label>
                  <input class="form-control" v-model="correo" type="email" id="id_price_service-3"
                    placeholder="Correo valido" name="email" required="" />
                </div>
              </div>
              <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="mb-3">
                  <label class="form-label" for="email"><strong>Pisos *</strong></label>
                  <input class="form-control" v-model="pisos" type="text" id="id_price_service-3"
                    placeholder="Cantidad pisos del hotel" name="email" required="" />
                </div>
              </div>
              <hr>
              <!-- <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_hotel"
                      ><strong>NIT</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="id_price_service"
                          placeholder="Numero de Identificacion Tributaria"
                          name="nombre_hotel"
                          required=""
                        />
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="nombre_hotel"
                          ><strong>RUT</strong></label
                        ><input
                          class="form-control"
                          type="text"
                          id="id_price_service"
                          placeholder="Registro Unico Tributario"
                          name="nombre_hotel"
                          required=""
                        />
                      </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                      <div class="mb-3">
                        <label class="form-label" for="nombre_hotel"
                          ><strong>RNT</strong></label
                        ><input
                          class="form-control"
                            type="text"
                            id="id_price_service"
                            placeholder="Registro Nacional de Turismo"
                            name="nombre_hotel"
                            required=""
                          />
                        </div>
                      </div>
                      <hr>
                      <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="representante_legal"
                              ><strong>Representante&nbsp;legal *</strong></label
                            ><input
                              class="form-control"
                              type="text"
                              id="id_price_service-1"
                              placeholder="Nombre del representante"
                              name="representante_legal"
                              required=""
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="email"
                              ><strong>Correo *</strong></label
                            ><input
                              class="form-control"
                              type="email"
                              id="id_price_service-3"
                              placeholder="Correo valido"
                              name="email"
                              required=""
                            />
                          </div>
                        </div>
                        <div class="col-sm-12 col-md-4 col-lg-4">
                          <div class="mb-3">
                            <label class="form-label" for="tel_contacto"
                              ><strong>Teléfono&nbsp;*</strong></label
                            ><input
                              class="form-control"
                              type="text"
                              id="id_price_service-2"
                              placeholder="Teléfono de contacto"
                              name="tel_contacto"
                              oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                              pattern="[0-9]{10,}"
                              title="Ingresa al menos 10 números"
                              required=""
                            />
                          </div>
                        </div> -->
                <hr>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Logo *</strong>
                    <p>
                      {{ imagesSelected }} imágenes seleccionadas (Máximo 1)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <br />
                      <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                         />
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
                                " class="btn btn-custom btn"  v-if="uploadedImages.length > 0">
                      <i class="bi bi-trash3-fill"></i> Limpiar Imágenes
                    </button>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <strong>Imagen principal*</strong>
                    <p>
                      {{ imagesSelected }} imágenes seleccionadas (Máximo 1)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i style="color:  #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                      </p>
                      <br />
                      <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                         />
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
                      <i class="bi bi-trash3-fill"></i> Limpiar Imágenes
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div class="text-center mb-3">
            <a class="btn btn-outline-danger btn" role="button" href="#" style="margin-right: 5px">Cancelar</a><button
              class="btn btn-outline-dark btn" type="reset" style="margin-right: 5px">
              Limpiar</button><button class="btn btn-custom btn" type="submit" style="background:  #b7642d; color: #fff">
              <i class="bi bi-floppy-fill"></i>
              Registrar
            </button>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->
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

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }
}
</style>
