<template>
  <main>
    <div class="galeria">
      <div class="Hoteles"><h5>Registra tus habitaciones</h5></div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div
        class="container"
        style="margin-top: 20px; margin-bottom: 20px"
      >
        <form enctype="multipart/form-data" method="post">
          <div class="card shadow mb-3">
            <div class="card-header py-3">
              <p class="text-primary m-0 fw-bold">
                <span style="color:  #b7642d"
                  >Rellene los campos obligatorios *</span
                >
              </p>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"
                      ><strong>Alias *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="alias_habitacion"
                      placeholder="Ej: Esquinera"
                      name="alias_habitacion"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_habitacion"
                      ><strong>Dirección *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="direccion_habitacion"
                      placeholder="Ej: Calle 6A"
                      name="direccion_habitacion"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="capacidad_maxima"
                      ><strong>Capacidad max *</strong></label
                    >
                    <select
                      class="form-select"
                      id="capacidad_maxima"
                      name="capacidad_maxima"
                      required=""
                    >
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="c_dobles"
                      ><strong>Camas dobles *</strong></label
                    >
                    <select
                      class="form-select"
                      id="c_dobles"
                      name="c_dobles"
                      required=""
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="c_sencillas"
                      ><strong>Camas sencillas *</strong></label
                    >
                    <select
                      class="form-select"
                      id="c_sencillas"
                      name="c_sencillas"
                      required=""
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_camarotes"
                      ><strong>Camarotes *</strong></label
                    >
                    <select
                      class="form-select"
                      id="h_camarotes"
                      name="h_camarotes"
                      required=""
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_ventiladores"
                      ><strong>Ventiladores *</strong></label
                    >
                    <select
                      class="form-select"
                      id="h_ventiladores"
                      name="h_ventiladores"
                      required=""
                    >
                      <option value="S">Si</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_closet"
                      ><strong>Closet *</strong></label
                    >
                    <select
                      class="form-select"
                      id="h_closet"
                      name="h_closet"
                      required=""
                    >
                      <option value="S">Si</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="bano"
                      ><strong>Baño *</strong></label
                    >
                    <select
                      class="form-select"
                      id="bano"
                      name="bano"
                      required=""
                    >
                      <option value="Privado">Privado</option>
                      <option value="Compartido">Compartido</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_servicios"
                      ><strong>Wi-Fi *</strong></label
                    >
                    <select
                      class="form-select"
                      id="wifi"
                      name="wifi"
                      required=""
                    >
                      <option value="S">Si</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_servicios"
                      ><strong>TV *</strong></label
                    >
                    <select class="form-select" id="tv" name="tv" required="">
                      <option value="S">Si</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="h_servicios"
                      ><strong>Aire AC *</strong></label
                    >
                    <select
                      class="form-select"
                      id="aire"
                      name="aire"
                      required=""
                    >
                      <option value="S">Si</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>

                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="precio_habitacion"
                      ><strong>Precio *</strong></label
                    ><input
                      class="form-control"
                      type="number"
                      id="precio_habitacion"
                      placeholder="$"
                      name="precio_habitacion"
                      required=""
                    />
                  </div>
                </div>

                <!-- Descripción del hotel -->
                <div
                  style="margin-bottom: 15px"
                  class="col-6"
                >
                  <label class="form-label" for="nombre_hotel"
                    ><strong>Descripción *</strong></label
                  >
                  <textarea
                    class="form-control"
                    id="descripcionSitio"
                    placeholder="Describa..."
                    name="descripcionSitio"
                    rows="1"
                    required=""
                  ></textarea>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <strong>Imágenes *</strong>
                    <p>
                      {{ imagesSelected }} imágenes seleccionadas (Máximo 4)
                    </p>
                    <div style="margin-top: -15px" class="logo">
                      <p class="logop">
                        <i
                          style="color:  #b7642d; font-size: 30px"
                          class="bi bi-file-earmark-arrow-up-fill"
                        ></i>
                      </p>
                      <br />
                      <input
                        class="foto"
                        style="margin-top: 13px"
                        :required="imagesSelected !== 4"
                        type="file"
                        ref="fileInput"
                        accept="image/*"
                        multiple
                        @change="handleFileUpload"
                      />
                    </div>
                    <!-- Contenedor de las imágenes con margen -->
                    <div
                      style="margin-top: 15px; display: flex"
                      class="d-flex flex-wrap gap-1"
                    >
                      <div
                        v-for="(image, index) in uploadedImages"
                        :key="index"
                        class="image-preview"
                      >
                        <img
                          class="fixed-size-image"
                          :src="image.src"
                          :alt="image.alt"
                        />
                      </div>
                    </div>
                    <button
                      style="
                        background-color:  #b7642d;
                        color: #fff;
                        margin-top: 20px;
                      "
                      class="btn btn-custom btn"
                      @click="clearImages"
                      v-if="uploadedImages.length > 0"
                    >
                      <i class="bi bi-trash3-fill"></i> Limpiar Imágenes
                    </button>
                  </div>
                </div>
                <!-- Fin registro habitaciones -->
              </div>
            </div>
          </div>
          <div class="text-end mb-3">
            <center>
              <a
                class="btn btn-outline-danger btn"
                role="button"
                href="#"
                style="margin-right: 5px"
                >Cancelar</a
              ><button
                class="btn btn-outline-dark btn"
                type="reset"
                style="margin-right: 5px"
              >
                Limpiar</button
              ><button
                class="btn btn-custom btn"
                type="submit"
                style="background:  #b7642d; color: #fff"
              >
                <i class="bi bi-floppy-fill"></i>
                Registrar
              </button>
            </center>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      uploadedImages: [], // Almacenar las imágenes cargadas
      imagesSelected: 0, // Contador de imágenes seleccionadas
    };
  },
  methods: {
    handleFileUpload(event) {
      if (this.imagesSelected >= 4) {
        // Límite de 4 imágenes alcanzado, no permitir más
        return;
      }

      const fileInput = this.$refs.fileInput;
      const files = fileInput.files;

      // Recorrer los archivos seleccionados
      for (let i = 0; i < files.length; i++) {
        if (this.imagesSelected >= 4) {
          // Límite de 4 imágenes alcanzado, no permitir más
          break;
        }

        const file = files[i];
        const imageURL = URL.createObjectURL(file);

        this.uploadedImages.push({ src: imageURL, alt: "Imagen" });
        this.imagesSelected++;
      }

      // Limpiar el campo de entrada de archivos si es necesario
      fileInput.value = "";
    },
    clearImages() {
      // Restablecer el array de imágenes cargadas y el contador
      this.uploadedImages = [];
      this.imagesSelected = 0;
    },
  },
};
</script>

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
  transform: scale(1.1); /* Cambia el tamaño al pasar el mouse */
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
  overflow: hidden; /* Para manejar el desbordamiento de la imagen */
  object-fit: cover;
  border-radius: 10px;
  border-style: solid;
  border-color:  #b7642d5b;
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
  background: linear-gradient(to right,  #b7642d, transparent);
  align-items: center;
  border-radius: 10px;
  transition: 1s;
}

/* Estilos para resoluciones de 1000px o más */
@media screen and (min-width: 1000px) {
  .row .col-6 {
    flex: 0 0 20%; /* Establece un ancho del 25% para cada columna en pantallas de 1000px o más */
    max-width: 25%;
  }
}

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color:  #b7642d;
    align-items: left;
    border-radius: 10px;
  }

  .d-flex {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
