  <script setup>
  import { ref, onMounted } from 'vue';
  import { useStorePiso } from '../../../stores/piso.js';
  import { useStoreHotel } from '../../../stores/hotel.js';
  import { useStoreHabitacion } from '../../../stores/habitacion.js';
  import { useRoute, useRouter } from 'vue-router';

  const usePiso = useStorePiso();
  const useHotel = useStoreHotel();
  const useHabitacion = useStoreHabitacion();
  const route = useRoute();
  const router = useRouter();
  const selectedPiso = ref("");
  const idPiso = ref("");
  const pisos = ref([]);
  const habitaciones = ref([]);
  const loading = ref(true);
  const selectedHabitacion = ref(null);
  const idHabSelec = ref("");
  const idHotel = ref('');
  const numero_habitacion = ref("");
  const descripcionHabitacion = ref("");
  const capacidadMaxima = ref("");
  const precioNoche = ref("");
  const disponible = ref("");
  const showTipoHabitacionModal = ref(false);
  const showServicioModal = ref(false);
  const showImagenModal = ref(false);
  const notificacionVisible = ref(false);
  const notificacionValidacion = ref(false);
  const notificacionCargando = ref(false);
  const loadingFotos = ref(false);
  const mensajeNotificacion = ref('');
  const mensajeValidacion = ref('');
  const mensajeCargando = ref('');
  const editarTipoHabitacion = ref([]);
  const editarServicios = ref([]);
  const tipoHabitacionModal = ref(null);
  const serviciosModal = ref(null);
  const imagenModal = ref(null);
  const editarDHabitacionesModal = ref(null);
  const guardando = ref(false);
  const data = ref([]);

  async function getPisoPorHotel(id) {
    try {
      const response = await usePiso.getPisoPorHotel(id);
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
      habitaciones.value = response.reverse();
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
    data.value = habitacion;
    selectedHabitacion.value = habitacion;
    numero_habitacion.value = habitacion.numero_habitacion;
    descripcionHabitacion.value = habitacion.descripcion;
    capacidadMaxima.value = habitacion.cantidad_personas;
    editarTipoHabitacion.value = [...habitacion.tipo_habitacion];
    editarServicios.value = [...habitacion.servicio];
    precioNoche.value = habitacion.precio_noche;
    disponible.value = habitacion.disponible;
    idHabSelec.value = selectedHabitacion.value._id;
  }

  async function guardarCambios() {
    guardando.value = true;
    data.value = {
      numero_habitacion: numero_habitacion.value,
      descripcion: descripcionHabitacion.value,
      imagenes: data.value.imagenes.filter(foto => !foto.eliminada),
      tipo_habitacion: editarTipoHabitacion.value,
      cantidad_personas: capacidadMaxima.value,
      servicio: editarServicios.value,
      precio_noche: precioNoche.value,
      idPiso: idPiso.value,
      disponible: disponible.value,
    };

    try {
      const response = await useHabitacion.editar(idHabSelec.value, data.value)

      if (useHabitacion.estatus === 200) {
        const modalEditar = bootstrap.Modal.getInstance(document.getElementById('editarDHabitaciones'));
        if (modalEditar) {
          modalEditar.hide();
        }
        await getHabitacionPorPiso();
        const index = buscarIndexLocal(response._id);
        habitaciones.value.splice(index, 1);
        habitaciones.value.unshift(response);
        notificacionVisible.value = true;
        mensajeNotificacion.value = 'Habitación editada exitosamente'
        setTimeout(() => {
          notificacionVisible.value = false;
          mensajeNotificacion.value = '';
        }, 3000);
      } else if (useHabitacion.estatus === 400) {
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
      console.log(error)
    } finally {
      guardando.value = false;
    }
  }

  async function subirFotosHabitacion(event) {
    const files = event.target.files;
    if (files.length === 0) return;

    loadingFotos.value = true;
    notificacionCargando.value = true;
    mensajeCargando.value = 'Subiendo imagen...';
    const fotosAntesDeSubir = [...data.value.imagenes];

    try {
      data.value.imagenes = fotosAntesDeSubir.filter(foto => !foto.eliminada);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await useHabitacion.subirGrupoFotos(data.value._id, file);

        const fotoObj = { url: imageUrl };
        data.value.imagenes.push(fotoObj);
      }
      mensajeCargando.value = 'Imágenes subidas exitosamente';
      setTimeout(() => {
        notificacionCargando.value = false;
        mensajeCargando.value = '';
      }, 3000);

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

  function marcarComoEliminada(index) {
    data.value.imagenes[index].eliminada = true;
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

  const openImagenModal = () => {
    showImagenModal.value = true;
  };

  function irFormularioHabitacion() {
    router.push({ path: '/RegistroHabitaciones', query: { id: useHabitacion.idHotel } });
  }

  function buscarIndexLocal(id) {
    return habitaciones.value.findIndex((r) => r._id === id);
  }

  onMounted(async () => {
    const Hotel = route.query.id;
    if (Hotel) {
      idHotel.value = Hotel;
      useHabitacion.idHotel = Hotel;
      await getPisoPorHotel(Hotel);
    }

    tipoHabitacionModal.value = document.getElementById('tipoHabitacionModal');
    serviciosModal.value = document.getElementById('servicioModal');
    imagenModal.value = document.getElementById('verImagenesModal');
    editarDHabitacionesModal.value = document.getElementById('editarDHabitaciones');

    tipoHabitacionModal.value.addEventListener('hidden.bs.modal', () => {
      new bootstrap.Modal(editarDHabitacionesModal.value).show();
    });

    serviciosModal.value.addEventListener('hidden.bs.modal', () => {
      new bootstrap.Modal(editarDHabitacionesModal.value).show();
    });

    imagenModal.value.addEventListener('hidden.bs.modal', () => {
      new bootstrap.Modal(editarDHabitacionesModal.value).show();
    });
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
            <p class="empty-state__description">¡Registra tus habitaciones ahora mismo para comenzar a administrarlas!
            </p>
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
              <h1 class="text-center">Habitaciones de {{ selectedPiso.idHotel.nombre }}</h1>
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
                <th>Estado Habitacion</th>
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
                <td>
                  <VMenu class="vmenu">
                    <span class="truncated-text">{{ habitacion.descripcion }}</span>
                    <template #popper>
                      <div class="descripVmenu">
                        {{ habitacion.descripcion }}
                      </div>
                    </template>
                  </VMenu>
                </td>
                <td>
                  <VMenu class="vmenu">
                    <span class="truncated-text">{{ habitacion.tipo_habitacion[0] }}</span>
                    <template #popper>
                      <div class="descripVmenu">
                        {{ habitacion.tipo_habitacion.join(', ') }}
                      </div>
                    </template>
                  </VMenu>
                </td>
                <td>{{ habitacion.cantidad_personas }}</td>
                <td>
                  <VMenu class="vmenu">
                    <span class="truncated-text">{{ habitacion.servicio.slice(0, 2).join(', ') }}</span>
                    <template #popper>
                      <div class="descripVmenu">
                        {{ habitacion.servicio.join(', ') }}
                      </div>
                    </template>
                  </VMenu>
                </td>
                <td>{{ habitacion.precio_noche }}</td>
                <td>{{ habitacion.disponible ? "Si" : "No" }}</td>
                <td>{{ habitacion.estado ? "Activa" : "Desactivada" }}</td>
                <td>
                  <div class="btn-container">
                    <button style="max-height: 30px" type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                      data-bs-target="#editarDHabitaciones" @click="selectHabitacion(habitacion)">
                      <i class="material-icons">edit</i>
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
                <h1 class="modal-title fs-5" id="editarDHabitacionesLabel">Editar Habitación</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <!-- Aquí va el contenido del modal de edición de habitación -->
                <div class="col-6">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"><strong>Num habitacion <span
                          class="text-danger">*</span></strong></label>
                    <input class="form-control" type="text" id="alias_habitacion" v-model="numero_habitacion"
                      required />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="direccion_habitacion"><strong>Descripción <span
                          class="text-danger">*</span></strong></label>
                    <textarea class="form-control" v-model="descripcionHabitacion" id="descripcionSitio"
                      placeholder="Describa la habitación..." name="descripcionSitio" rows="2" required></textarea>
                  </div>
                </div>

                <div class="row">

                  <div class="col-12">
                    <div class="mb-3" style="display: flex; flex-direction: column;">
                      <strong>Imágenes de la habitación <span class="text-danger">*</span></strong>
                      <div style="width: 50%;">
                        <button class="btn text-light btn-secondary mt-2" data-bs-toggle="modal"
                          data-bs-target="#verImagenesModal" @click="openImagenModal">Ver imágenes</button>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label class="form-label" for="tipo_habitacion"><strong>Tipo de habitación <span
                            class="text-danger">*</span></strong></label>
                      <button class="btn text-light btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#tipoHabitacionModal" @click="openTipoHabitacionModal">Ver tipos de
                        habitación</button>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label class="form-label" for="servicios"><strong>Servicios <span
                            class="text-danger">*</span></strong></label>
                      <br />
                      <button class="btn text-light btn-secondary" data-bs-toggle="modal"
                        data-bs-target="#servicioModal" @click="openServicioModal">Ver servicios</button>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label class="form-label" for="precio_noche"><strong>Precio x noche <span
                            class="text-danger">*</span></strong></label>
                      <input class="form-control" type="number" id="precio_noche" v-model="precioNoche" required />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label class="form-label" for="capacidad_maxima"><strong>Capacidad max <span
                            class="text-danger">*</span></strong></label>
                      <input class="form-control" type="Number" id="direccion_habitacion" v-model="capacidadMaxima"
                        required />
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="mb-3">
                      <label class="form-label" for="disponible"><strong>Disponible <span
                            class="text-danger">*</span></strong></label>
                      <select class="form-select" id="disponible" v-model="disponible" required>
                        <option value="true">Si</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal"
                  :disabled="guardando">Cerrar</button>
                <button type="button" class="btn text-light" @click="guardarCambios" style="background: #b7642d"
                  :disabled="guardando">
                  <span v-if="guardando" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
                  {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
          </div>
        </div>


        <!-- Modal para mostrar tipos de habitación -->
        <div class="modal fade" id="tipoHabitacionModal" tabindex="-1" aria-labelledby="tipoHabitacionModalLabel"
          aria-hidden="true" v-show="showTipoHabitacionModal" data-bs-backdrop="static">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="text-dark">Modificar tipos de habitación: </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div class="mt-3">
                  <div v-for="(tipo, index) in editarTipoHabitacion" :key="index"
                    class="d-flex align-items-center mb-2">
                    <div style="width: 80%;">
                      <input class="form-control" type="text" v-model="editarTipoHabitacion[index]" required />
                    </div>

                    <button class="btn btn-danger ms-2" @click="removeTipoHabitacion(index)">Eliminar</button>
                  </div>

                </div>
              </div>
              <div class="modal-footer">
                <div class="text-center">
                  <button class="btn btn-success" @click="addTipoHabitacion">Agregar tipo de habitación</button>
                </div>
                <button type="button" class="btn" id="btns" data-bs-dismiss="modal">Aceptar</button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Modal para mostrar servicios -->
      <div class="modal fade" id="servicioModal" tabindex="-1" aria-labelledby="servicioModalLabel" aria-hidden="true"
        v-show="showServicioModal" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="text-dark fs-5">Modificar servicios de la habitación: </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="mt-3">
                <div v-for="(tipo, index) in editarServicios" :key="index" class="d-flex align-items-center mb-2">
                  <input class="form-control" type="text" v-model="editarServicios[index]" required />
                  <button class="btn btn-danger ms-2" @click="removeServicio(index)">Eliminar</button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="text-center">
                <button class="btn btn-success" @click="addServicio">Agregar servicio</button>
              </div>
              <button type="button" class="btn" id="btns" data-bs-dismiss="modal"
                style="background: #b7642d">Aceptar</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para ver y gestionar imágenes -->
      <div class="modal fade" id="verImagenesModal" tabindex="-1" aria-labelledby="verImagenesModalLabel"
        aria-hidden="true" v-show="showImagenModal" data-bs-backdrop="static">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="verImagenesModalLabel">Imágenes de la habitación</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" :disabled="loadingFotos"></button>
            </div>
            <div class="modal-body" id="modal-body">
              <!-- Mostrar imágenes subidas -->
              <div class="d-flex flex-wrap gap-3">
                <div v-for="(foto, index) in data.imagenes" :key="index" class="photo-container">
                  <img v-if="!foto.eliminada" :src="foto.url" alt="Foto del hotel" class="fixed-size-image">
                  <button v-if="!foto.eliminada" class="btn btn-danger btn-sm mt-2 photo-delete-btn"
                    @click="marcarComoEliminada(index)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
            <!-- Agregar nuevas imágenes -->
            <div class="modal-footer">
              <div style="display: flex; flex-direction: column; width: 100%; justify-content: start;">
                <label class="form-label"><strong>Agregar nuevas imágenes</strong></label>
                <input type="file" class="form-control" multiple @change="subirFotosHabitacion" accept="image/*">
                <label>(Debe haber mínimo 1 foto, cada foto debe pesar menos de 10MB, la primera foto será utilizada
                  como
                  foto
                  principal del hotel)</label>
              </div>
              <button type="button" class="btn btn-success" data-bs-dismiss="modal" :disabled="loadingFotos">Aceptar</button>
            </div>
          </div>
        </div>
      </div>


      <div style="display: flex; justify-content: end;">
        <button class="btn top-bar__button" id="btns" style="margin-top: 6px;" @click="irFormularioHabitacion()">
          Agregar Habitación
        </button>
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
  </template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
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
  padding: 10px 20px;
  border-radius: 10px;
  border: 2px solid #b7642d;
  background-color: #fff;
  color: #495057;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.top-bar__select:focus {
  border-color: #b7642d;
  outline: none;
  box-shadow: 0 0 10px rgba(183, 100, 45, 0.5);
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
  height: 30px;
  background-color: #38383835;
  margin: 0 5px;

}

.modal-small .modal-dialog {
  transform: translateY(0%);
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
}

.material-icons {
  font-size: 20px;
}

.photo-delete-btn {
  margin-left: 8px;
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
.table td .vmenu {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.descripVmenu {
  padding: 1rem;
  word-wrap: break-word;
  height: fit-content;
  max-height: 250px;
  max-width: 250px;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2;
}

.btn-container {
  display: flex;
  gap: 5px;
}

.btns {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
  color: white;
  border: none;
}

#btns {
  background-color: #b7642d;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#btns:hover {
  background-color: #a8521c;
}

.custom {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
}

.material-icons {
  font-size: 20px;
}

/* Estilos para scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 7px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #b7642d;
  border-radius: 20px;
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

#modal-body {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
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
</style>