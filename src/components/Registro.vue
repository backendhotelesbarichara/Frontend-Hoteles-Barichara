<script setup>
import { ref } from 'vue';
import { useStoreUsuarios } from '../stores/usuario';
import { useRouter } from 'vue-router';

const router = useRouter();
const useUsuario = useStoreUsuarios();
const nombre = ref('');
const apellido = ref('');
const cedula = ref('');
const rol = ref('Administrador');
const correo = ref('');
const telefono = ref();
const password = ref('');
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const loadingUsuario = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
const mostrarPassword = ref(false);
const data = ref({
  nombre: '',
  apellido: '',
  cedula: '',
  rol: '',
  correo: '',
  telefono: '',
  password: '',
})

const agregarUsuario = async () => {

  if (!data.value.nombre || !data.value.apellido || data.value.cedula || data.value.rol || data.value.correo || data.value.telefono || data.value.password) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = "No se pueden enviar campos vacíos";
    setTimeout(() => {
      notificacionValidacion.value = false;
      return;
    }, 3000);
  }

  if (!validarContraseña()) {
    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    return;
  }

  data.value.nombre = nombre.value;
  data.value.apellido = apellido.value;
  data.value.cedula = cedula.value;
  data.value.rol = rol.value;
  data.value.correo = correo.value;
  data.value.telefono = telefono.value;
  data.value.password = password.value;

  notificacionCargando.value = true;
  mensajeCargando.value = 'Agregando usuario...';
  loadingUsuario.value = true;

  try {
    const response = await useUsuario.agregar(data.value);

    if (useUsuario.estatus === 200) {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionVisible.value = true;
      mensajeNotificacion.value = 'Usuario agregado con éxito';

      setTimeout(() => {
        notificacionCargando.value = false;
        mensajeCargando.value = '';
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
        irPanelAdmin();
      }, 3000);
    } else {
      notificacionCargando.value = false;
      mensajeCargando.value = '';
      notificacionValidacion.value = true;
      mensajeValidacion.value = useUsuario.validacion;

      setTimeout(() => {
        notificacionValidacion.value = false;
        mensajeValidacion.value = '';
      }, 3000);
    }
  } catch (error) {
    notificacionValidacion.value = true;
    mensajeValidacion.value = useUsuario.validacion;

    setTimeout(() => {
      notificacionValidacion.value = false;
      mensajeValidacion.value = '';
    }, 3000);
    console.log(error);
  } finally {
    loadingUsuario.value = false;
  }
};

function validarContraseña() {
  if (password.value.length < 8) {
    mensajeValidacion.value = 'La contraseña debe tener al menos 8 caracteres';
    notificacionValidacion.value = true;
    return false;
  }
  if (!/\d/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos un número';
    notificacionValidacion.value = true;
    return false;
  }
  if (!/[@#\/]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos un carácter especial (@, #, /)';
    notificacionValidacion.value = true;
    return false;
  }

  if (!/[A-Z]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos una letra mayúscula';
    notificacionValidacion.value = true;
    cerrarNotificacion();
    return false;
  }
  if (!/[a-z]/.test(password.value)) {
    mensajeValidacion.value = 'La contraseña debe contener al menos una letra minúscula';
    notificacionValidacion.value = true;
    cerrarNotificacion();
    return false;
  }
  notificacionValidacion.value = false; // No hay errores
  return true;
}

const toggleMostrarPassword = () => {
  mostrarPassword.value = !mostrarPassword.value;
};

function irPanelAdmin() {
  router.push('/PanelUsuarios')
}
</script>


<template>
  <!-- Start: Login Form Basic -->
  <section class="position-relative py-4 py-xl-5">
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-md-6 col-xl-4">
          <div class="card mb-5">
            <p class="fw-bold text-center text-uppercase fs-5 mt-2" style="color: #b7642d; margin: 0;">Registrar usuario
            </p>
            <div class="card-body d-flex flex-column align-items-center" style="border-radius: 20px">
              <div class="bs-icon-xl bs-icon-circle bs-icon-primary bs-icon mb-4" style="background:  #b7642d">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"
                  class="bi bi-person">
                  <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z">
                  </path>
                </svg>
              </div>
              <form @submit.prevent="agregarUsuario">
                <div class="mb-3">
                  <input class="form-control" v-model="nombre" type="name" name="name" placeholder="Nombre" required />
                </div>

                <div class="mb-3">
                  <input class="form-control" v-model="apellido" type="name" name="apellido" placeholder="Apellido"
                    required />
                </div>

                <div class="mb-3">
                  <input class="form-control" v-model="cedula" type="number" name="cedula" placeholder="Cédula"
                    required />
                </div>

                <div class="mb-3">
                  <input class="form-control" v-model="correo" type="email" name="email" placeholder="Email" required />
                </div>

                <div class="mb-3">
                  <input class="form-control" v-model="telefono" type="number" name="telefono" placeholder="Teléfono"
                    required />
                </div>

                <div class="mb-3 position-relative">
                  <input class="form-control" v-model="password" :type="mostrarPassword ? 'text' : 'password'"
                    name="password" placeholder="Contraseña" required />
                  <button type="button" class="btn btn-outline-secondary mt-2 me-2"
                    @click="toggleMostrarPassword" style="border: none; position: absolute; bottom: 2px; left: 80%">
                    <i :class="mostrarPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>


                <div class="mb-3">
                  <button type="submit" class="btn btn-primary d-block w-100"
                    style="background:  #b7642d; border-style: none" :disabled="loadingUsuario">
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show" role="alert">
    {{ mensajeNotificacion }}
  </div>
  <div v-if="notificacionValidacion" class="custom-notify alert alert-danger alert-dismissible fade show" role="alert">
    {{ mensajeValidacion }}
  </div>
  <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show" role="alert">
    {{ mensajeCargando }}
  </div>
  <!-- End: Login Form Basic -->
</template>

<style>
.link {
  text-decoration: none !important;
}

.bs-icon {
  --bs-icon-size: 0.75rem;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  font-size: var(--bs-icon-size);
  width: calc(var(--bs-icon-size) * 2);
  height: calc(var(--bs-icon-size) * 2);
  color: var(--bs-primary);
}

.bs-icon-xs {
  --bs-icon-size: 1rem;
  width: calc(var(--bs-icon-size) * 1.5);
  height: calc(var(--bs-icon-size) * 1.5);
}

.bs-icon-sm {
  --bs-icon-size: 1rem;
}

.bs-icon-md {
  --bs-icon-size: 1.5rem;
}

.bs-icon-lg {
  --bs-icon-size: 2rem;
}

.bs-icon-xl {
  --bs-icon-size: 2.5rem;
}

.bs-icon.bs-icon-primary {
  color: var(--bs-white);
  background: var(--bs-primary);
}

.bs-icon.bs-icon-primary-light {
  color: var(--bs-primary);
  background: rgba(var(--bs-primary-rgb), 0.2);
}

.bs-icon.bs-icon-semi-white {
  color: var(--bs-primary);
  background: rgba(255, 255, 255, 0.5);
}

.bs-icon.bs-icon-rounded {
  border-radius: 0.5rem;
}

.bs-icon.bs-icon-circle {
  border-radius: 50%;
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
