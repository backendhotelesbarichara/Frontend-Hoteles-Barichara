<script setup>
import { ref, onMounted } from 'vue';
import { useStoreUsuarios } from '../../../stores/usuario';
import { useRouter } from 'vue-router';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const usuarios = ref([]);
const loading = ref(false);
const dataUsuario = ref([]);
const password = ref('');
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const loadingUsuario = ref(false);
const mostrarPassword = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');

const guardarCambios = async () => {
    // Validar que no existan campos vacíos
    if (!dataUsuario.value.nombre || 
        !dataUsuario.value.apellido || 
        !dataUsuario.value.cedula || 
        !dataUsuario.value.rol || 
        !dataUsuario.value.correo || 
        !dataUsuario.value.telefono) {
        notificacionValidacion.value = true;
        mensajeValidacion.value = "No se pueden enviar campos vacíos";
        setTimeout(() => {
            notificacionValidacion.value = false;
        }, 3000);
        return;
    }

    // Validar contraseña si se ha proporcionado
    if (password.value.trim() && !validarContraseña()) {
        setTimeout(() => {
            notificacionValidacion.value = false;
            mensajeValidacion.value = '';
        }, 3000);
        return;
    }

    // Asignar contraseña solo si se ha proporcionado
    if (password.value.trim()) {
        dataUsuario.value.password = password.value;
    } else {
        // Si no se proporciona contraseña, eliminamos la propiedad del objeto
        delete dataUsuario.value.password;
    }

    // Mostrar notificación de carga
    notificacionCargando.value = true;
    mensajeCargando.value = 'Editando usuario...';
    loadingUsuario.value = true;

    try {
        // Realizar la edición del usuario
        const response = await useUsuario.editar(dataUsuario.value._id, dataUsuario.value);

        if (useUsuario.estatus === 200) {
            notificacionCargando.value = false;
            mensajeCargando.value = '';
            notificacionVisible.value = true;
            mensajeNotificacion.value = 'Usuario editado con éxito';
            getUsuarios();

            setTimeout(() => {
                notificacionVisible.value = false;
                mensajeNotificacion.value = '';
            }, 3000);
        } else {
            notificacionValidacion.value = true;
            mensajeValidacion.value = useUsuario.validacion;
        }
    } catch (error) {
        notificacionValidacion.value = true;
        mensajeValidacion.value = "Error al editar usuario.";
        console.log(error);
    } finally {
        notificacionCargando.value = false;
        loadingUsuario.value = false;
    }
};



function validarContraseña() {
  if (password.value.trim() && password.value.length < 8) {
    mensajeValidacion.value = 'La contraseña debe tener al menos 8 caracteres';
    notificacionValidacion.value = true;
    return false;
  }
  if (password.value.trim() && !/\d/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos un número';
    notificacionValidacion.value = true;
    return false;
  }
  if (password.value.trim() && !/[@#\/]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos un carácter especial (@, #, /)';
    notificacionValidacion.value = true;
    return false;
  }

  if (password.value.trim() && !/[A-Z]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos una letra mayúscula';
    notificacionValidacion.value = true;
    cerrarNotificacion();
    return false;
  }
  if (password.value.trim() && !/[a-z]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos una letra minúscula';
    notificacionValidacion.value = true;
    cerrarNotificacion();
    return false;
  }
  notificacionValidacion.value = false; // No hay errores
  return true;
}

async function cambiarEstadoUsuario(pusuarios) {
  const Usuario = usuarios.value.find(usuarios => usuarios._id === pusuarios._id);
  if (!Usuario) return;

  Usuario.loadingActInac = true;

  const estadoAnterior = Usuario.estado;
  Usuario.estado = !Usuario.estado;

  try {
    if (estadoAnterior) {
      await useUsuario.inactivar(pusuarios._id);
    } else {
      await useUsuario.activar(pusuarios._id);
    }
  } catch (error) {
    console.error("Error al cambiar el estado del usuario", error);
    Usuario.estado = estadoAnterior;
  } finally {
    Usuario.loadingActInac = false;
  }
}

async function getUsuarios() {
  try {
    const response = await useUsuario.getAll()
    usuarios.value = response.map(usuario => ({
      ...usuario,
      loadingActInac: false,
    }));
    /* console.log(response); */
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

const toggleMostrarPassword = () => {
  mostrarPassword.value = !mostrarPassword.value;
};

function editarUsuario(pusuarios) {
  /* console.log(pusuarios); */
  dataUsuario.value = pusuarios;
}

function irCrearUsuario() {
  router.push('/Registro')
}

onMounted(() => {
  getUsuarios();
})
</script>

<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Admistrar Usuarios</h5>
    </div>
    <div>
      <!-- Tabla de usuarios -->
      <div style="font-size: 12px;" class="table-responsive mt-5">
        <table class="table table-hover">
          <thead style="align-items: center; text-align: center">
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cédula</th>
              <th>Rol</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pusuarios in usuarios">
              <td>{{ pusuarios.nombre }}</td>
              <td>{{ pusuarios.apellido }}</td>
              <td>{{ pusuarios.cedula }}</td>
              <td>{{ pusuarios.rol }}</td>
              <td>{{ pusuarios.correo }}</td>
              <td>{{ pusuarios.telefono }}</td>
              <td>
                <button :class="['btn', pusuarios.estado ? 'btn-success' : 'btn-danger']"
                  @click="cambiarEstadoUsuario(pusuarios)" style="margin-left: 10px; font-weight: bold;"
                  :disabled="pusuarios.loadingActInac">
                  <span v-if="pusuarios.loadingActInac" class="spinner-border spinner-border-sm" role="status"
                    aria-hidden="true"></span>
                  <span v-if="!pusuarios.loadingActInac"> {{ pusuarios.estado ? 'Activo' : 'Inactivo'
                    }}</span>
                </button>
              </td>
              <td>
                <div class="btn-container">
                  <!-- boton que abre el modal -->
                  <button type="button" class="btns btn btn-dark" data-bs-toggle="modal" data-bs-target="#editarp"
                    @click="editarUsuario(pusuarios)">
                    <i class="material-icons">edit</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: end;">
        <button class="btn top-bar__button" id="btns" style="margin-top: 6px;" @click="irCrearUsuario()">
          Agregar Usuario
        </button>
      </div>

      <!-- espacio para el modal -->
      <div class="modal fade " id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Editar Usuario
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Nombre <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      v-model="dataUsuario.nombre" id="nombre_usuario" name="nombre_usuario"
                      placeholder="Digite un nombre" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Apellido <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      v-model="dataUsuario.apellido" id="nombre_usuario" name="nombre_usuario"
                      placeholder="Digite un apellido" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Cédula <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="number"
                      v-model="dataUsuario.cedula" id="nombre_usuario" name="nombre_usuario"
                      placeholder="Digite una cédula" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="correo_usuario"><strong>Correo <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      v-model="dataUsuario.correo" id="correo_usuario" name="correo_usuario"
                      placeholder="Digite un correo" required />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="tel_usuario"><strong>Telefono <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="number"
                      v-model="dataUsuario.telefono" id="tel_usuario" name="tel_usuario" required
                      placeholder="Digite un número de teléfono" />
                  </div>
                </div>

                <div class="mb-3 position-relative">
                  <label class="form-label" for="tel_usuario"><strong>Cambiar contraseña</strong></label>
                  <input class="form-control" v-model="password" :type="mostrarPassword ? 'text' : 'password'"
                    name="password" placeholder="Contraseña" required />
                  <button type="button" class="btn btn-outline-secondary mt-2 me-2"
                    @click="toggleMostrarPassword" style="border: none; position: absolute; bottom: 2px; left: 89%">
                    <i :class="mostrarPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary"
                data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" style="background-color: #b7642d; border-style: none" class="btn btn-primary"
                @click="guardarCambios()">
                Editar
              </button>
            </div>
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
    <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show" role="alert">
      {{ mensajeCargando }}
    </div>
  </div>
</template>

<style scoped>
/* Estilo para el modal más pequeño */
.modal-small .modal-dialog {
  max-width: 300px;
  /* Establece el ancho deseado */
  margin: 0 auto;
  /* Centra horizontalmente el modal */
  top: 50%;
  /* Coloca el modal en el centro vertical */
  transform: translateY(-50%);
  /* Alinea verticalmente el modal */
}

.link {
  text-decoration: none !important;
}

.btn-container {
  display: flex;
  justify-content: center;
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

.material-icons {
  font-size: 20px;
  /* Tamaño del icono */
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