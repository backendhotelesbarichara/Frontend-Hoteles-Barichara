<script setup>
import { ref, onMounted } from 'vue';
import { useStoreProveedor } from '../../../stores/proveedor';
import { useStoreSitioTuristico } from '../../../stores/sitio_turistico';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import 'bootstrap/dist/js/bootstrap.bundle';

const useProveedor = useStoreProveedor();
const useSitioTuristico = useStoreSitioTuristico();
const route = useRoute();
const router = useRouter();
const idSitio = ref();
const selectedSitio = ref(null); // Hotel seleccionado
const proveedores = ref([]);
const sitios = ref([]);
const dataProveedor = ref([]);
const notificacionCargando = ref(false);
const notificacionVisible = ref(false);
const notificacionValidacion = ref(false);
const loadingProveedor = ref(false);
const loadingFotos = ref(false);
const editMode = ref(false);
const mensajeCargando = ref('');
const mensajeValidacion = ref('');
const mensajeNotificacion = ref('');
let editarModalInstance; // Instancia del modal editarp
let imagenesModalInstance; // Instancia del modal imagenesModal

const guardarCambios = async () => {
    if (dataProveedor.value.foto === '') {
        notificacionValidacion.value = true;
        mensajeValidacion.value = 'Debe añadir una imagen para el proveedor';
        setTimeout(() => {
            notificacionValidacion.value = false;
            mensajeValidacion.value = '';
        }, 3000);
        return;
    } else if (!dataProveedor.value.nombre || !dataProveedor.value.telefono || !dataProveedor.value.idSitioTuristico) {
        notificacionValidacion.value = true;
        mensajeValidacion.value = "No se pueden enviar campos vacíos";
        setTimeout(() => {
            notificacionValidacion.value = false;
            return;
        }, 3000);
    }

    notificacionCargando.value = true;
    mensajeCargando.value = 'Editando proveedor...';
    loadingProveedor.value = true;


    try {
        const response = await useProveedor.editar(dataProveedor.value._id, dataProveedor.value);

        if (useProveedor.estatus === 200) {
            notificacionCargando.value = false;
            mensajeCargando.value = '';
            notificacionVisible.value = true;
            mensajeNotificacion.value = 'Proveedor editado con éxito';
            editMode.value = true;
            getSitiosTuristicos();

            setTimeout(() => {
                notificacionCargando.value = false;
                mensajeCargando.value = '';
                notificacionVisible.value = false;
                mensajeNotificacion.value = '';
                editMode.value = false;
            }, 3000);
        } else {
            notificacionCargando.value = false;
            mensajeCargando.value = '';
            notificacionValidacion.value = true;
            mensajeValidacion.value = useProveedor.validacion;

            setTimeout(() => {
                notificacionValidacion.value = false;
                mensajeValidacion.value = '';
            }, 3000);
        }
    } catch (error) {
        notificacionValidacion.value = true;
        mensajeValidacion.value = useProveedor.validacion;

        setTimeout(() => {
            notificacionValidacion.value = false;
            mensajeValidacion.value = '';
        }, 3000);
        console.log(error);
    } finally {
        loadingProveedor.value = false;
    }
};

const subirFotoProveedor = async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    loadingFotos.value = true;
    notificacionCargando.value = true;
    mensajeCargando.value = 'Subiendo imagen del proveedor, por favor espere...';

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const imageUrl = await useProveedor.subirFoto(dataProveedor.value._id, file);

            dataProveedor.value.foto = imageUrl;
        }

        mensajeCargando.value = 'Imagen subida exitosamente';
        setTimeout(() => {
            notificacionCargando.value = false;
            mensajeCargando.value = '';
        }, 6000);
    } catch (error) {
        console.error('Error al subir la foto:', error);
        notificacionCargando.value = false;
        mensajeNotificacion.value = '';
        notificacionValidacion.value = true;
        mensajeValidacion.value = 'Error al subir la imagen';
        setTimeout(() => {
            notificacionValidacion.value = false;
            mensajeValidacion.value = '';
        }, 3000);
    } finally {
        loadingFotos.value = false;
    }
};

function editarProveedor(proveedor) {
    dataProveedor.value = { ...proveedor }; // Clonamos el proveedor para evitar reactividad indeseada


    // Establece el sitio asignado al proveedor
    if (proveedor.idSitioTuristico) {
        dataProveedor.value.idSitioTuristico = proveedor.idSitioTuristico._id;
    } else {
        dataProveedor.value.idSitioTuristico = '';
    }

    if (editarModalInstance) editarModalInstance.show();
}

async function cambiarEstadoProveedor(proveedor) {
    const Proveedor = proveedores.value.find(proveedores => proveedores._id === proveedor._id);
    if (!Proveedor) return;

    Proveedor.loadingActInac = true;

    const estadoAnterior = Proveedor.estado;
    Proveedor.estado = !Proveedor.estado;

    try {
        if (estadoAnterior) {
            await useProveedor.inactivar(proveedor._id);
        } else {
            await useProveedor.activar(proveedor._id);
        }
    } catch (error) {
        console.error("Error al cambiar el estado del proveedor", error);
        Proveedor.estado = estadoAnterior;
    } finally {
        Proveedor.loadingActInac = false;
    }
}

async function getSitiosTuristicos() {
    try {
        const response = await useSitioTuristico.getAll();
        sitios.value = response;

        // Verificar si hay un parámetro `id` en la URL
        const sitioFromUrl = route.query.id;
        if (sitioFromUrl) {
            const sitio = sitios.value.find((h) => h._id === sitioFromUrl);
            if (sitio) {
                selectedSitio.value = sitio;
                await loadProveedorData();
            }
        } else {
            selectedSitio.value = sitios.value[0];
            await loadProveedorData();
        }

    } catch (error) {
        console.log(error);
    }
}

async function getProveedorPorId(id) {
    try {
        const response = await useProveedor.getPorSitioTuristico(id);
        proveedores.value = response.map(proveedor => ({
            ...proveedor,
            loadingActInac: false,
        }));;
    } catch (error) {
        console.log(error);
    }
}

const loadProveedorData = async () => {
    if (!selectedSitio.value) return;
    try {
        await getProveedorPorId(selectedSitio.value._id);
    } catch (error) {
        console.error("Error al cargar los datos del hotel seleccionado:", error);
    }
};

function irFormularioProveedor() {
    router.push('/RegistroProveedores')
}

const abrirModalImagenes = () => {
    if (imagenesModalInstance) {
        imagenesModalInstance.show();
        if (editarModalInstance) editarModalInstance.hide(); // Cierra editarp
    }
};

const eliminarImagen = () => {
    dataProveedor.value.foto = '';
};


onMounted(async () => {
    const Proveedor = route.query.id;
    /* console.log("prueba", Proveedor) */

    if (Proveedor) {
        idSitio.value = Proveedor;
        await getProveedorPorId(Proveedor);
    }

    await getSitiosTuristicos();

    const editarModalElement = document.getElementById('editarp');
    if (editarModalElement) {
        editarModalInstance = new bootstrap.Modal(editarModalElement);
    }

    const imagenesModalElement = document.getElementById('imagenesModal');
    if (imagenesModalElement) {
        imagenesModalInstance = new bootstrap.Modal(imagenesModalElement);

        // Al cerrar imagenesModal, abrir editarp
        imagenesModalElement.addEventListener('hidden.bs.modal', () => {
            if (editarModalInstance) {
                editarModalInstance.show();
            }
        });
    }
})
</script>

<template>
    <div class="galeria">
        <div class="Hoteles">
            <h5>Administrar Proveedores Turísticos</h5>
        </div>
        <div>
            <div class="text-center w-25 align-container">
                <div style="display: flex; gap: 20px; height: 30%;">
                    <div style="min-width: 250px">   
                    <p for="hotelSelector" class="form-p fw-bold" style="font-size: 2rem;">Proveedores de: </p>
                    </div>
                    <select id="hotelSelector" v-model="selectedSitio" @change="loadProveedorData"
                        class="form-select text-center fw-bold">
                        <option disabled value="">Seleccione un hotel...</option> <!-- Opción por defecto -->
                        <option v-for="sitio in sitios" :key="sitio._id" :value="sitio">
                            {{ sitio.nombre }}
                        </option>
                    </select>
                </div>

            </div>

            <!-- Tabla de proveedores -->
            <div style="font-size: 12px;" class="table-responsive mt-5">
                <table class="table table-hover">
                    <thead style="align-items: center; text-align: center">
                        <tr>
                            <th>Nombre</th>
                            <th>Telefono</th>
                            <th>Proveedor vinculado</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="proveedor in proveedores">
                            <td>{{ proveedor.nombre }}</td>
                            <td>{{ proveedor.telefono }}</td>
                            <td>
                                {{ proveedor.idSitioTuristico.nombre }}
                            </td>
                            <td>
                                <button :class="['btn', proveedor.estado ? 'btn-success' : 'btn-danger']"
                                    @click="cambiarEstadoProveedor(proveedor)"
                                    style="margin-left: 10px; font-weight: bold;" :disabled="proveedor.loadingActInac">
                                    <span v-if="proveedor.loadingActInac" class="spinner-border spinner-border-sm"
                                        role="status" aria-hidden="true"></span>
                                    <span v-if="!proveedor.loadingActInac"> {{ proveedor.estado ? 'Activo' : 'Inactivo'
                                        }}</span>
                                </button>
                            </td>
                            <td>
                                <div class="btn-container">
                                    <!-- boton que abre el modal -->
                                    <button type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                                        data-bs-target="#editarp" @click="editarProveedor(proveedor)">
                                        <i class="material-icons">edit</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="display: flex; justify-content: end;">
                <button class="btn top-bar__button" id="btns" style="margin-top: 6px;" @click="irFormularioProveedor()">
                    Agregar Proveedor
                </button>
            </div>

            <!-- espacio para el modal -->
            <div class="modal fade modal-lg" id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                                Editar proveedor
                            </h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="nombre_proveedor"><strong>Nombre
                                                <span class="text-danger">*</span></strong></label><input
                                            v-model="dataProveedor.nombre" class="form-control" type="text"
                                            id="nombre_proveedor" name="nombre_proveedor" required />
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="telefono_proveedor"><strong>Telefono
                                                <span class="text-danger">*</span></strong></label><input
                                            v-model="dataProveedor.telefono" class="form-control" type="number"
                                            id="telefono_proveedor" name="telefono_proveedor" required />
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="sitio_asignado">
                                            <strong>Proveedor Turístico asignado <span
                                                    class="text-danger">*</span></strong>
                                        </label>
                                        <select id="sitio_asignado" class="form-select text-start fw-bold"
                                            v-model="dataProveedor.idSitioTuristico">
                                            <!-- Opción por defecto -->
                                            <option disabled value="">Seleccione un sitio turístico...</option>
                                            <!-- Opciones dinámicas desde `sitios` -->
                                            <option v-for="sitio in sitios" :key="sitio._id" :value="sitio._id">
                                                {{ sitio.nombre }}
                                            </option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <strong>Foto <span class="text-danger">*</span></strong>
                                        <p>(Máximo 1 foto, la foto debe pesar como máximo 10MB)</p>
                                        <div class="logo">
                                            <p class="logop">
                                                <i style="color: #b7642d; font-size: 30px"
                                                    class="bi bi-file-earmark-arrow-up-fill"></i>
                                            </p>
                                            <input class="foto" type="file" ref="fileInput" accept="image/*"
                                                @change="subirFotoProveedor" />
                                        </div>
                                        <button type="button" style="background-color: #b7642d; border-style: none"
                                            class="btn btn-primary mt-2" @click="abrirModalImagenes()">Ver foto</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" style="background-color: #343a40; border-style: none"
                                class="btn btn-secondary" data-bs-dismiss="modal">
                                Cancelar
                            </button>
                            <button type="button" style="background-color: #b7642d; border-style: none"
                                class="btn btn-primary" @click="guardarCambios()" :disabled="loadingProveedor">
                                Editar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- espacio para el modal -->
        </div>
        <div class="modal fade modal-xl" id="imagenesModal" tabindex="-1" aria-labelledby="imagenesModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="imagenesModalLabel" style="color: black;">Foto Proveedor
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex flex-wrap gap-3 justify-content-center">
                            <div v-if="dataProveedor.foto" :key="index" class="position-relative">
                                <img :src="dataProveedor.foto" alt="Imagen cargada" class="img-thumbnail" />
                                <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    @click="eliminarImagen()">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="notificacionVisible" class="custom-notify alert alert-success alert-dismissible fade show"
            role="alert">
            {{ mensajeNotificacion }}
        </div>
        <div v-if="notificacionValidacion" class="custom-notify alert alert-danger alert-dismissible fade show"
            role="alert">
            {{ mensajeValidacion }}
        </div>
        <div v-if="notificacionCargando" class="custom-notify alert alert-info alert-dismissible fade show"
            role="alert">
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

.fixed-size-image {
    width: 100px;
    height: 100px;
    overflow: hidden;
    /* Para manejar el desbordamiento de la imagen */
    object-fit: cover;
    border-radius: 10px;
    border-style: solid;
    border-color: #b7642d5b;
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

@media screen and (max-width: 500px) {
    .Hoteles {
        background-color: #b7642d;
        align-items: left;
        border-radius: 10px;
    }
}
.align-container {
  display: flex;
  align-items: center;
  /* Centra verticalmente el texto y el selector */
  gap: 10px;
  /* Espaciado horizontal entre el texto y el select */
}

.form-p {
  margin: 0;
  /* Elimina márgenes extra para un mejor alineado */
}

/* Estilos para la tabla */

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