<template>
  <main>
    <div class="galeria">
      <div class="Hoteles"><h5>Registra un sitio</h5></div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div class="container" style="margin-top: 20px; margin-bottom: 20px">
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
                <div class="col-15">
                  <div class="mb-3">
                    <strong>Imagenes del sitio *</strong>
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
                      style="margin-top: 20px"
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

                <div class="col-5">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_sitio"
                      ><strong>Nombre *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="id_name_snombre_Sitioervice"
                      placeholder="Ej: Catedral"
                      name="nombre_Sitio"
                      required=""
                    />
                  </div>
                </div>

                <!-- Descripción del sitio -->
                <div style="margin-bottom: 15px" class="col-7">
                  <label class="form-label" for="nombre_hotel"
                    ><strong>Descripción *</strong></label
                  >
                  <textarea
                    class="form-control"
                    id="descripcionSitio"
                    placeholder="Describa el sitio..."
                    name="descripcionSitio"
                    rows="1"
                    required=""
                  ></textarea>
                </div>
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
      // imagenesSitios
      uploadedImages: [], // Almacenar las imágenes cargadas
      imagesSelected: 0, // Contador de imágenes seleccionadas
    };
  },
  methods: {
    // imagenesSitios
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

hr {
  border: none; /* Quita el borde predeterminado */
  background-color:  #b7642d; /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
  height: 2px; /* Define el grosor de la línea horizontal */
  margin: 5px 0; /* Añade margen superior e inferior para separar del contenido */
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
}

@media screen and (max-width: 400px) {
  .d-flex {
    display: flex;
    justify-content: center; /* Centra horizontalmente los elementos */
    align-items: center; /* Centra verticalmente los elementos (opcional) */
  }
}

@media screen and (min-width: 1000px) {
  .container {
    max-width: 700px;
  }
}
</style>
