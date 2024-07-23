<template>
  <div class="galeria">
    <div class="Hoteles"><h5>Administrar hoteles</h5></div>
    <div>
      

      <!-- Tabla de hoteles -->
      <div style="font-size: 12px;" class="table-responsive">
        <table class="table table-bordered">
          <thead style="align-items: center; text-align: center">
            <tr>
              <th>Dirección</th>
              <th>Nombre</th>
              <th>Rlegal</th>
              <th>Telefono</th>
              <th>Correo</th>
              <th>Vigencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="photel in hoteles">
              <td>{{ photel.direccion }}</td>
              <td>{{ photel.nombre }}</td>
              <td>{{ photel.rlagal }}</td>
              <td>{{ photel.tel }}</td>
              <td>{{ photel.correo }}</td>
              <td>15 dias</td>
              <td>
                <div class="btn-container">
                  <!-- boton que abre el modal -->
                  <button
                    type="button"
                    class="btns btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#editarp"
                  >
                    <i class="material-icons">edit</i>
                  </button>
                  <!-- boton que abre el modal -->

                  <!-- boton que debe elimina el hotel -->
                  <button type="button" class="btns btn btn-dark">
                    <i class="material-icons">delete</i>
                  </button>
                  <!-- boton que debe elimina el hotel -->

                  <!-- boton que debe lleva a las habitaciones del hotel -->
                  <router-link class="link" to="/PanelHabitaciones">
                    <button title="Adicionar tiempo de vigencia" type="button" class="btns btn btn-dark">
                      <i class="material-icons">timelapse</i>
                    </button>
                  </router-link>
                  <!-- boton que debe lleva a las habitaciones del hotel -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- espacio para el modal -->
      <div
        class="modal fade modal-small"
        id="editarp"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Editar hotel
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="col-15">
                <div class="mb-3">
                  <strong>Imágen pricipal *</strong>
                  <p>{{ imagesSelected }} imágenes seleccionadas (Máximo 1)</p>
                  <div style="margin-top: -15px" class="logo">
                    <p class="logop">
                      <i
                        style="color: #b7642d; font-size: 30px"
                        class="bi bi-file-earmark-arrow-up-fill"
                      ></i>
                    </p>
                    <br />
                    <input
                      class="foto"
                      style="margin-top: 13px"
                      :required="imagesSelected !== 1"
                      type="file"
                      ref="fileInput"
                      accept="image/*"
                      multiple
                      @change="handleFileUpload"
                    />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_hotel"
                      ><strong>Dirección *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="direccion_hotel"
                      name="direccion_hotel"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_hotel"
                      ><strong>Nombre *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="nombre_hotel"
                      name="nombre_hotel"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="r_legal"
                      ><strong>Representante legal *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="r_legal"
                      name="r_legal"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="tel_hotel"
                      ><strong>Telefono *</strong></label
                    ><input
                      class="form-control"
                      type="number"
                      id="tel_hotel"
                      name="tel_hotel"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="correo_hotel"
                      ><strong>Correo *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="correo_hotel"
                      name="correo_hotel"
                      required=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                style="background-color: #343a40; border-style: none"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                style="background-color: #b7642d; border-style: none"
                class="btn btn-primary"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- espacio para el modal -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const hoteles = ref([
  {
    direccion: "Carrera 2A #6-12",
    nombre: "Bella Vista",
    rlagal: "Juan Romero",
    tel: "3222431440",
    correo: "juanr@gmail.com",
  },
]);
</script>

<style scoped>
/* Estilo para el modal más pequeño */
.modal-small .modal-dialog {
  max-width: 300px; /* Establece el ancho deseado */
  margin: 0 auto; /* Centra horizontalmente el modal */
  top: 50%; /* Coloca el modal en el centro vertical */
  transform: translateY(-50%); /* Alinea verticalmente el modal */
}

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
  border-color: #b7642d5b;
}

.link {
  text-decoration: none !important;
}
.btn-container {
  display: flex;
  justify-content: center;
  gap: 5px; /* Espacio entre los botones */
}

.btns {
  border-radius: 50%; /* Redondear los botones */
  padding: 5px; /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icons {
  font-size: 20px; /* Tamaño del icono */
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

/* Estilos para la tabla */
.table {
  border-collapse: collapse; /* Para eliminar los espacios entre las celdas */
  width: 100%;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2; /* Color de fondo para las celdas del encabezado */
}

.btn-container {
  display: flex;
  gap: 5px; /* Espacio entre los botones */
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%; /* Redondear los botones */
  padding: 5px; /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40; /* Color de fondo de los botones */
  color: white; /* Color del texto de los botones */
  border: none; /* Eliminar el borde de los botones */
}

.material-icons {
  font-size: 20px; /* Tamaño del icono */
}

/* Estilos para scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 7px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #b7642d;
  border-radius: 20px;
}
</style>
