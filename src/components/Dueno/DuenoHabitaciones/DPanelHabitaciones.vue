<script setup>
import { ref, onMounted } from 'vue';
import { useStorePiso } from '../../../stores/piso.js';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreHabitacion } from '../../../stores/habitacion.js';

const usePiso = useStorePiso();
const useHotel = useStoreHotel();
const useHabitacion = useStoreHabitacion();
const loading = ref(true);
const selectedPiso = ref("");
const idPiso = ref("");
const pisos = ref([]);
const habitaciones = ref([]);
const loadingHabitaciones = ref(false);
const initialLoad = ref(true); // Nueva variable para el estado de carga inicial

async function getPisoPorHotel() {
  try {
    const response = await usePiso.getPisoPorHotel(useHotel.idHotel);
    pisos.value = response;
    if (pisos.value.length > 0) {
      selectedPiso.value = pisos.value[0];
      handlePisoChange();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
    initialLoad.value = false; // Cambia el estado de carga inicial
  }
}

async function getHabitacionPorPiso() {
  loadingHabitaciones.value = true;
  try {
    const response = await useHabitacion.getHabitacionesPorPiso(idPiso.value);
    habitaciones.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    loadingHabitaciones.value = false;
  }
}

const handlePisoChange = () => {
  idPiso.value = selectedPiso.value._id;
  usePiso.idPisoSeleccionado = selectedPiso.value._id;
  usePiso.numPisoSelec = selectedPiso.value.num_piso;
  getHabitacionPorPiso();
}

onMounted(() => {
  getPisoPorHotel();
});
</script>


<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Administrar mis habitaciones</h5>
    </div>
    <div>
      <!-- Botón para agregar nueva habitación -->
      <div class="top-bar">
        <router-link class="link" to="/RegistroHabitaciones">
          <button style="margin-bottom: 5px; margin-top: 30px" class="btns btn btn-dark" @click="showAddModal">
            <i class="material-icons">add_box</i>
          </button>
        </router-link>
        <div>
          <select v-model="selectedPiso" @change="handlePisoChange">
            <option v-for="piso in pisos" :key="piso._id" :value="piso">
              Piso {{ piso.num_piso }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading || initialLoad" class="centered">
        <div class="empty-state">
          <i class="material-icons empty-state__icon">habitacion</i>
          <h3 class="empty-state__title">Cargando...</h3>
        </div>
      </div>
      <div v-else-if="habitaciones.length === 0" class="centered">
        <div class="empty-state">
          <i class="material-icons empty-state__icon">hotel</i>
          <h3 class="empty-state__title">Aún no tienes habitaciones registradas</h3>
          <p class="empty-state__description">¡Registra tus habitaciones ahora mismo para comenzar a administrarlas!</p>
          <router-link class="link" to="/RegistroHabitaciones">
            <button class="btn btn-dark">
              Registrar Habitacion
            </button>
          </router-link>
        </div>
      </div>

      <!-- Tabla de habitaciones -->
      <div v-else style="font-size: 12px;" class="table-responsive">
        <table class="table table-bordered">
          <thead style="align-items: center; text-align: center">
            <tr>
              <th>Num habitación</th>
              <th>Descripción</th>
              <th>Tipo de habitación</th>
              <th>Cantidad de personas</th>
              <th>Servicios</th>
              <th>Precio x noche</th>
              <th>Disponible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody v-if="loadingHabitaciones">
            <tr>
              <td colspan="7" class="text-center">Cargando habitaciones...</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="habitacion in habitaciones" :key="habitacion._id">
              <td>{{ habitacion.numero_habitacion }}</td>
              <td>{{ habitacion.descripcion }}</td>
              <td>{{ habitacion.tipo_habitacion.join(', ') }}</td>
              <td>{{ habitacion.cantidad_personas }}</td>
              <td>{{ habitacion.servicio.join(', ') }}</td>
              <td>{{ habitacion.precio_noche }}</td>
              <td>{{ habitacion.disponible ? "Si" : "No" }}</td>
              <td>
                <div class="btn-container">
                  <button style="max-height: 30px" type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                    data-bs-target="#editarDHabitaciones">
                    <i class="material-icons">edit</i>
                  </button>
                  <button style="max-height: 30px" class="btns btn btn-dark">
                    <i class="material-icons">delete</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- espacio para el modal -->
      <div class="modal fade modal-small" id="editarDHabitaciones" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Editar habitación</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="col-15">
                <div class="mb-3">
                  <strong>Imágenes *</strong>
                  <p>{{ imagesSelected }} imágenes seleccionadas (Máximo 4)</p>
                  <div style="margin-top: -15px" class="logo">
                    <p class="logop">
                      <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                    </p>
                    <br />
                    <input class="foto" style="margin-top: 13px" :required="imagesSelected !== 4" type="file"
                      ref="fileInput" accept="image/*" multiple @change="handleFileUpload" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"><strong>Alias *</strong></label>
                    <input class="form-control" type="text" id="alias_habitacion" name="alias_habitacion" required="" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_habitacion"><strong>Dirección *</strong></label>
                    <input class="form-control" type="text" id="direccion_habitacion" name="direccion_habitacion" required="" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="capacidad_maxima"><strong>Capacidad max *</strong></label>
                    <select class="form-select" id="capacidad_maxima" name="capacidad_maxima" required="">
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
                    <label class="form-label" for="precio_habitacion"><strong>Precio *</strong></label>
                    <input class="form-control" type="number" id="precio_habitacion" name="precio_habitacion" required="" />
                  </div>
                </div>
                <div style="margin-bottom: 15px" class="col-6">
                  <label class="form-label" for="des_habitacion"><strong>Descripción *</strong></label>
                  <textarea class="form-control" id="des_habitacion" name="des_habitacion" rows="1" required=""></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" style="background-color: #b7642d; border-style: none" class="btn btn-primary">
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




<style scoped>
.top-bar {
  display: flex;
  align-items: center;
}

.top-bar .link {
  margin-right: 10px;
  /* Espacio entre el botón y el select */
}

.top-bar select {
  margin-top: 30px;
  /* Alineación vertical con el botón */
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}

.empty-state {
  max-width: 600px;
  margin: auto;
}

.empty-state__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state__title {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.empty-state__description {
  margin-bottom: 1rem;
}

.separator {
  width: 1px;
  /* Ancho de la línea vertical */
  height: 30px;
  /* Altura de la línea vertical */
  background-color: #38383835;
  /* Color de la línea */
  margin: 0 5px;
  /* Espacio entre los botones y la línea */
}

.modal-small .modal-dialog {
  transform: translateY(0%);
  /* Alinea verticalmente el modal */
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

.btn-container {
  display: flex;
  justify-content: center;
  gap: 5px;
  /* Espacio entre los botones */
}

.material-icons {
  font-size: 20px;
  /* Tamaño del icono */
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
  border-collapse: collapse;
  /* Para eliminar los espacios entre las celdas */
  width: 100%;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2;
  /* Color de fondo para las celdas del encabezado */
}

.btn-container {
  display: flex;
  gap: 5px;
  /* Espacio entre los botones */
}

.btns {
  border-radius: 50%;
  /* Redondear los botones */
  padding: 5px;
  /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%;
  /* Redondear los botones */
  padding: 5px;
  /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
  /* Color de fondo de los botones */
  color: white;
  /* Color del texto de los botones */
  border: none;
  /* Eliminar el borde de los botones */
}

.custom {
  border-radius: 50%;
  /* Redondear los botones */
  padding: 5px;
  /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  /* Color del texto de los botones */
  border: none;
  /* Eliminar el borde de los botones */
}

.material-icons {
  font-size: 20px;
  /* Tamaño del icono */
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
