<script setup>
import { ref, onMounted } from 'vue';
import { useStoreUsuarios } from '../../../stores/usuario';
import { useRouter } from 'vue-router';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const usuarios = ref([]);
const loading = ref(false);

async function getUsuarios() {
  try {
    const response = await useUsuario.getAll()
    usuarios.value = response
    console.log(response);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
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
      <!-- Botón registro -->
      <!--       <div>
        <div class="btn-group" role="group">
          <router-link class="link" to="/Registro">
            <button style="margin-bottom: 5px; margin-top: 30px; margin-right: 5px" class="btns btn-dark">
              <i class="material-icons">add_box</i>
            </button>
          </router-link>
        </div>
      </div> -->

      <!-- Tabla de usuarios -->
      <div style="font-size: 12px;" class="table-responsive mt-5">
        <table class="table table-bordered">
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
              <td> <button class="btn btn-success">{{ pusuarios.estado ? 'Activo' : 'Inactivo' }}</button></td>
              <td>
                <div class="btn-container">
                  <!-- boton que abre el modal -->
                  <button type="button" class="btns btn btn-dark" data-bs-toggle="modal" data-bs-target="#editarp">
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
      <div class="modal fade modal-small" id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Editar usuario
              </h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Nombre <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      id="nombre_usuario" name="nombre_usuario" required="" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Apellido <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      id="nombre_usuario" name="nombre_usuario" required="" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_usuario"><strong>Cédula <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="number"
                      id="nombre_usuario" name="nombre_usuario" required="" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="correo_usuario"><strong>Correo <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="text"
                      id="correo_usuario" name="correo_usuario" required="" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="tel_usuario"><strong>Telefono <span
                          class="text-danger">*</span></strong></label><input class="form-control" type="number"
                      id="tel_usuario" name="tel_usuario" required="" />
                  </div>
                </div>

                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label" for="rol_usuario"><strong>Rol <span
                          class="text-danger">*</span></strong></label>
                    <input type="text" class="form-control" placeholder="Administrador">
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary"
                data-bs-dismiss="modal">
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
.table {
  border-collapse: collapse;
  /* Para eliminar los espacios entre las celdas */
  width: 100%;
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

/* Estilos para scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 7px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #b7642d;
  border-radius: 20px;
}
</style>
