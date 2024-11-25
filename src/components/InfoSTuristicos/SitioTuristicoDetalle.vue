<script setup>
import { ref, onMounted } from 'vue';
import { useStoreSitioTuristico } from '../../stores/sitio_turistico';
import { useStoreProveedor } from '../../stores/proveedor';
import { useRoute } from 'vue-router';

const useSitioTuristico = useStoreSitioTuristico();
const useProveedor = useStoreProveedor();
const route = useRoute();
const detalleSitio = ref();
const proveedores = ref([]);
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
const imagenSeleccionada = ref(null);

async function getDetalleSitioTuristico(idSitioTuris) {
  try {
    notificacionCargando.value = true;
    mensajeCargando.value = 'Cargando...';
    const response = await useSitioTuristico.getPorId(idSitioTuris);
    if (!response) return;
    if (response.error) {
      notificacionValidacion.value = true;
      mensajeValidacion.value = response.error;
      setTimeout(() => {
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
      }, 3000);
    }
    detalleSitio.value = response;
    console.log(detalleSitio)
  } catch (error) {
    console.log(error);
  } finally {
    notificacionCargando.value = false;
    mensajeCargando.value = '';
  }
}

async function getProveedores(idSitioTuris) {
  try {
    notificacionCargando.value = true;
    mensajeCargando.value = 'Cargando...';
    const response = await useProveedor.getPorSitioTuristico(idSitioTuris);
    if (!response) return;
    if (response.error) {
      notificacionValidacion.value = true;
      mensajeValidacion.value = response.error;
      setTimeout(() => {
        notificacionVisible.value = false;
        mensajeNotificacion.value = '';
      }, 3000);
    }
    proveedores.value = response.filter(proveedor => proveedor.estado === true);
    console.log("soy proveedor", proveedores)
  } catch (error) {
    console.log(error);
  } finally {
    notificacionCargando.value = false;
    mensajeCargando.value = '';
  }
}

function mostrarImagenEnModal(img) {
  console.log(img)
  imagenSeleccionada.value = img.url;
  const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
  modal.show();
}

function mostrarImagenEnModalProveedor(proveedor) {
  console.log(proveedor)
  imagenSeleccionada.value = proveedor.foto;
  const modal = new bootstrap.Modal(document.getElementById('modalImagen'));
  modal.show();
}


onMounted(() => {
  const idSitioTuris = route.query.id;
  if (idSitioTuris) {
    getDetalleSitioTuristico(idSitioTuris);
    getProveedores(idSitioTuris);
  }
})
</script>

<template>
  <div>
    <p v-if="detalleSitio" class="fs-4 text-center text-uppercase fw-bold" style="color: #b7642d;">{{
      detalleSitio.nombre }}</p>
    <div v-if="detalleSitio" class="contenedor-imagenes">
      <div class="imagen" v-for="img in detalleSitio.imagen" :key="img._id">
        <img :src="img.url" alt="Imagen del sitio turístico" @click="mostrarImagenEnModal(img)"
          style="cursor: pointer;" />
      </div>
    </div>

    <div class="Hoteles">
      <h5>Descripción</h5>
    </div>

    <p v-if="detalleSitio" style="padding: 10px; text-align: center;">
      {{ detalleSitio.descripcion }}
    </p>

    <div class="Hoteles">
      <h5>Proveedores</h5>
    </div>

    <div class="contenedor-proveedores">
      <div class="proveedor" v-for="proveedor in proveedores" :key="proveedor._id">
        <img :src="proveedor.foto" alt="Imagen del proveedor" @click="mostrarImagenEnModalProveedor(proveedor)"
          style="cursor: pointer" />
        <div class="info-proveedor">
          <h6>Nombre:</h6>
          <p>{{ proveedor.nombre }}</p>
          <h6>Teléfono:</h6>
          <p>{{ proveedor.telefono }}</p>
        </div>
      </div>
    </div>

    <div class="modal fade" id="modalImagen" tabindex="-1" aria-labelledby="modalImagenLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
          <div class="modal-body text-center">
            <img :src="imagenSeleccionada" class="img-fluid" alt="Vista previa de la imagen">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
body {
  margin: 0;
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}


/* Contenedor general */
.contenedor-imagenes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin: auto;
  padding: 10px;
}

.contenedor-imagenes .imagen {
  flex: 1 1 calc(25% - 20px);
  /* Adaptable según el ancho de la pantalla */
  max-width: 300px;
  height: 250px;
  position: relative;
  margin-bottom: 10px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.imagen img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

/* Barra de títulos (Descripción y Proveedores) */
.Hoteles {
  background: linear-gradient(to right, #b7642d, transparent);
  padding: 10px;
  color: #fff;
  border-radius: 10px;
  margin: 10px;
  font-size: 1.2rem;
  font-weight: bold;
  width: 97%;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Proveedores */
.contenedor-proveedores {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 20px;
}

.proveedor {
  flex: 1 1 calc(33.33% - 20px);
  /* Tres columnas en pantallas grandes */
  max-width: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.proveedor img {
  width: 100%;
  max-height: 150px;
  object-fit: cover;
  border-radius: 10px 10px 0 0;
}

.info-proveedor {
  padding: 15px;
  text-align: center;
}

.info-proveedor h6 {
  margin: 5px 0;
  font-weight: bold;
  color: #b7642d;
}

.info-proveedor p {
  margin: 0;
  font-size: 14px;
  color: #3c3c3c;
}

/* Responsividad */
@media screen and (max-width: 900px) {
  .contenedor-imagenes .imagen {
    flex: 1 1 calc(50% - 20px);
    /* Dos columnas en pantallas medianas */
  }

  .proveedor {
    flex: 1 1 calc(50% - 20px);
    /* Dos columnas en pantallas medianas */
  }
}

@media screen and (max-width: 600px) {
  .contenedor-imagenes .imagen {
    flex: 1 1 calc(100% - 20px);
    /* Una columna en pantallas pequeñas */
  }

  .proveedor {
    flex: 1 1 calc(100% - 20px);
    /* Una columna en pantallas pequeñas */
  }
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