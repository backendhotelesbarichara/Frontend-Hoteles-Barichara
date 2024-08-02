<script setup>
import { ref, onMounted } from 'vue';
import { useStorePiso } from '../../../stores/piso.js';
import { useStoreHotel } from '../../../stores/hotel.js';
import { useStoreHabitacion } from '../../../stores/habitacion.js';

const usePiso = useStorePiso();
const useHotel = useStoreHotel();
const useHabitacion = useStoreHabitacion();
const selectedPiso = ref("");
const idPiso = ref("");
const pisos = ref([]);
const habitaciones = ref([]);
const loading = ref(true);
const selectedHabitacion = ref(null);
const idHabSelec = ref("");
const numero_habitacion = ref("");
const descripcionHabitacion = ref("");
const capacidadMaxima = ref("");
const tipoHabitacion = ref([]);
const precioNoche = ref("");
const servicios = ref([]);
const disponible = ref("");
const showTipoHabitacionModal = ref(false);
const showServicioModal = ref(false);
const editarTipoHabitacion = ref([]);
const editarServicios = ref([]);
const tipoHabitacionModal = ref(null);
const serviciosModal = ref(null)
const editarDHabitacionesModal = ref(null);


async function getPisoPorHotel() {
  try {
    const response = await usePiso.getPisoPorHotel(useHotel.idHotel);
    pisos.value = response;
    if (pisos.value.length > 0) {
      selectedPiso.value = pisos.value[0];
      await handlePisoChange();
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

async function getHabitacionPorPiso() {
  try {
    const response = await useHabitacion.getHabitacionesPorPiso(idPiso.value);
    habitaciones.value = response;
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const handlePisoChange = async () => {
  idPiso.value = selectedPiso.value._id;
  usePiso.idPisoSeleccionado = selectedPiso.value._id;
  usePiso.numPisoSelec = selectedPiso.value.num_piso;
  await getHabitacionPorPiso();
}

const selectHabitacion = (habitacion) => {
  selectedHabitacion.value = habitacion;
  numero_habitacion.value = habitacion.numero_habitacion;
  descripcionHabitacion.value = habitacion.descripcion;
  capacidadMaxima.value = habitacion.cantidad_personas;
  editarTipoHabitacion.value = [...habitacion.tipo_habitacion]; // Crear una copia superficial del array
  editarServicios.value = [...habitacion.servicio]; // Crear una copia superficial del array
  precioNoche.value = habitacion.precio_noche;
  disponible.value = habitacion.disponible;
  idHabSelec.value =  selectedHabitacion.value._id;
}

function guardarCambios() {


  const data = {
    numero_habitacion: numero_habitacion.value,
    descripcion: descripcionHabitacion.value,
    tipo_habitacion: editarTipoHabitacion.value,
    cantidad_personas: capacidadMaxima.value,
    servicio: editarServicios.value,
    precio_noche: precioNoche.value,
    idPiso: idPiso.value,
    disponible: disponible.value,
  };

  try {

    const response = useHabitacion.editar(idHabSelec.value, data)

    if(useHabitacion.estatus === 200){
      getHabitacionPorPiso();
    }
    

  } catch (error) {
    console.log(error)
  }



}

const addTipoHabitacion = () => {
  editarTipoHabitacion.value.push('');
};

const removeTipoHabitacion = (index) => {
  editarTipoHabitacion.value.splice(index, 1);
};

const addServicio = () => {
  editarServicios.value.push('');
};

const removeServicio = (index) => {
  editarServicios.value.splice(index, 1);
};

const openTipoHabitacionModal = () => {
  showTipoHabitacionModal.value = true;
};

const openServicioModal = () => {
  showServicioModal.value = true;
};


onMounted(() => {
  tipoHabitacionModal.value = document.getElementById('tipoHabitacionModal');
  serviciosModal.value = document.getElementById('servicioModal');
  editarDHabitacionesModal.value = document.getElementById('editarDHabitaciones');

  tipoHabitacionModal.value.addEventListener('hidden.bs.modal', () => {
    new bootstrap.Modal(editarDHabitacionesModal.value).show();
  });

  serviciosModal.value.addEventListener('hidden.bs.modal', () => {
    new bootstrap.Modal(editarDHabitacionesModal.value).show();
  });

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
      <div v-if="loading" class="centered">
        <div class="empty-state">
          <i class="material-icons empty-state__icon">hotel</i>
          <h3 class="empty-state__title">Cargando...</h3>
        </div>
      </div>
      <div v-else-if="!loading && habitaciones.length === 0" class="centered">
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
        <div class="mb-5">
          <div class="top-bar">
            <router-link class="link" to="/RegistroHabitaciones">
              <button class="btns btn btn-dark top-bar__button" @click="showAddModal">
                <i class="material-icons">add_box</i>
              </button>
            </router-link>
            <div class="top-bar__select-container">
              <select class="top-bar__select fw-bold" v-model="selectedPiso" @change="handlePisoChange">
                <option v-for="piso in pisos" :key="piso._id" :value="piso">
                  Piso {{ piso.num_piso }}
                </option>
              </select>
            </div>
          </div>
        </div>

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
          <tbody v-if="loading">
            <tr>
              <td colspan="8" class="text-center">Cargando habitaciones...</td>
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
                    data-bs-target="#editarDHabitaciones" @click="selectHabitacion(habitacion)">
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

      <!-- Modal para editar habitación -->
      <div class="modal fade modal-small" id="editarDHabitaciones" tabindex="-1"
        aria-labelledby="editarDHabitacionesLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="editarDHabitacionesLabel">Editar habitación</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Aquí va el contenido del modal de edición de habitación -->
              <div class="col-15">
                <div class="mb-3">
                  <strong>Imágenes *</strong>
                  <p> imágenes seleccionadas (Máximo 4)</p>
                  <div style="margin-top: -15px" class="logo">
                    <p class="logop">
                      <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                    </p>
                    <br />
                    <input class="foto" style="margin-top: 13px" type="file" ref="fileInput" accept="image/*" multiple
                      @change="handleFileUpload" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"><strong>Num habitacion</strong></label>
                    <input class="form-control" type="text" id="alias_habitacion" v-model="numero_habitacion"
                      required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_habitacion"><strong>Dirección *</strong></label>
                    <input class="form-control" type="text" id="direccion_habitacion" v-model="descripcionHabitacion"
                      required />
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="capacidad_maxima"><strong>Capacidad max *</strong></label>
                    <select class="form-select" id="capacidad_maxima" v-model="capacidadMaxima" required>
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
                    <label class="form-label" for="tipo_habitacion"><strong>Tipo de habitación *</strong></label>
                    <button class="btn btn-info " data-bs-toggle="modal" data-bs-target="#tipoHabitacionModal"
                      @click="openTipoHabitacionModal">Ver tipos de habitación</button>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="precio_noche"><strong>Precio x noche *</strong></label>
                    <input class="form-control" type="number" id="precio_noche" v-model="precioNoche" required />
                  </div>
                </div>
                <!-- <div class="col-6">
                          <div class="mb-3">
                            <label class="form-label" for="servicios"><strong>Servicios *</strong></label>
                            <div v-for="(servicio, index) in servicios" :key="index" class="d-flex align-items-center mb-2">
                              <input class="form-control" type="text" v-model="servicios[index]" required />
                              <button class="btn btn-danger ms-2" @click="removeServicio(index)">Eliminar</button>
                            </div>
                            <button class="btn btn-success" @click="addServicio">Agregar servicio</button>
                            <button class="btn btn-info mt-2" @click="openServicioModal">Ver servicios</button>
                          </div>
                        </div> -->
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="servicios"><strong>Servicios *</strong></label>
                    <br />
                    <button class="btn btn-info" data-bs-toggle="modal" data-bs-target="#servicioModal"
                      @click="openServicioModal">Ver servicios</button>
                  </div>
                </div>
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="disponible"><strong>Disponible *</strong></label>
                    <select class="form-select" id="disponible" v-model="disponible" required>
                      <option value="true">Si</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-primary" @click="guardarCambios">Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal para mostrar tipos de habitación -->
      <div class="modal fade" id="tipoHabitacionModal" tabindex="-1" aria-labelledby="tipoHabitacionModalLabel"
        aria-hidden="true" v-show="showTipoHabitacionModal">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="text-dark">Añadir o eliminar tipos de habitación:</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-3">
                <div v-for="(tipo, index) in editarTipoHabitacion" :key="index" class="d-flex align-items-center mb-2">
                  <input class="form-control" type="text" v-model="editarTipoHabitacion[index]" required />
                  <button class="btn btn-danger ms-2" @click="removeTipoHabitacion(index)">Eliminar</button>
                </div>
                <div class="text-center">
                  <button class="btn btn-success" @click="addTipoHabitacion">Agregar tipo de habitación</button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal para mostrar servicios -->
    <div class="modal fade" id="servicioModal" tabindex="-1" aria-labelledby="servicioModalLabel" aria-hidden="true"
      v-show="showServicioModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="text-dark">Añadir o eliminar servicios de la habitacion:</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="mt-3">
              <div v-for="(tipo, index) in editarServicios" :key="index" class="d-flex align-items-center mb-2">
                <input class="form-control" type="text" v-model="editarServicios[index]" required />
                <button class="btn btn-danger ms-2" @click="removeServicio(index)">Eliminar</button>
              </div>
              <div class="text-center">
                <button class="btn btn-success" @click="addServicio">Agregar servicio</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>




<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Espacio entre el botón y el select */
  margin-top: 30px;
  /* Alineación vertical */
}

.top-bar__button {
  margin-bottom: 5px;
}

.top-bar__select-container {
  display: flex;
  align-items: center;
}

.top-bar__select {
  margin-left: 10px;
  /* Espacio entre el botón y el select */
  padding: 10px 20px;
  /* Tamaño más grande para mayor visibilidad */
  border-radius: 10px;
  /* Bordes redondeados */
  border: 2px solid #b7642d;
  /* Borde de color destacado */
  background-color: #fff;
  color: #495057;
  font-size: 1rem;
  /* Fuente más grande */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.top-bar__select:focus {
  border-color: #b7642d;
  outline: none;
  box-shadow: 0 0 10px rgba(183, 100, 45, 0.5);
  /* Efecto de sombra al enfocarse */
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
}

.empty-state__icon {
  font-size: 64px;
  color: #b7642d;
  margin-bottom: 20px;
}

.empty-state__title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 10px;
}

.empty-state__description {
  font-size: 1rem;
  color: #343a40;
  margin-bottom: 20px;
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
