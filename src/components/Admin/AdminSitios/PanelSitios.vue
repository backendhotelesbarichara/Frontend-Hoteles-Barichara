<script setup>
import { ref, onMounted } from 'vue';
import { useStoreSitioTuristico } from '../../../stores/sitio_turistico';
import { useRouter } from 'vue-router';

const useSitioTuristico = useStoreSitioTuristico();
const sitios = ref([]);
const loading = ref(false)
const router = useRouter()


async function cambiarEstadoSitio(sitio) {
    const Sitio = sitios.value.find(sitios => sitios._id === sitio._id);
    if (!Sitio) return;

    Sitio.loadingActInac = true;

    const estadoAnterior = Sitio.estado;
    Sitio.estado = !Sitio.estado;

    try {
        if (estadoAnterior) {
            await useSitioTuristico.inactivar(sitio._id);
        } else {
            await useSitioTuristico.activar(sitio._id);
        }
    } catch (error) {
        console.error("Error al cambiar el estado del sitio", error);
        Sitio.estado = estadoAnterior;
    } finally {
        Sitio.loadingActInac = false;
    }
}

async function getSitiosTuristicos() {
    try {
        const response = await useSitioTuristico.getAll()
        sitios.value = response.map(sitio => ({
            ...sitio,
            loadingActInac: false // Agregamos el estado de carga por plato
        }));
        console.log(response);
    } catch (error) {
        console.log(error);
    } finally {
        loading.value = false;
    }
}

function irProveedor() {
    router.push('/PanelProveedores')
}

onMounted(() => {
    getSitiosTuristicos();
})
</script>


<template>
    <div class="galeria">
        <div class="Hoteles">
            <h5>Admistrar Sitios Turísticos</h5>
        </div>
        <div>
            <!-- Botón para agregar nuevo sitio -->
            <!--             <div>
                <div class="btn-group" role="group">
                    <router-link class="link" to="/RegistroSitio">
                        <button style="margin-bottom: 5px; margin-top: 30px; margin-right: 5px" class="btns btn-dark">
                            <i class="material-icons">add_box</i>
                        </button></router-link>
                </div>
            </div> -->

            <!-- Tabla de hoteles -->
            <div style="font-size: 12px;" class="table-responsive m-5">
                <table class="table table-bordered">
                    <thead style="align-items: center; text-align: center">
                        <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="sitio in sitios">
                            <td>{{ sitio.nombre }}</td>
                            <td>
                                <VMenu class="vmenu">
                                    <!-- Texto truncado visible en la celda -->
                                    <span class="truncated-text">{{ sitio.descripcion }}</span>
                                    <!-- Menú desplegable al hacer clic o pasar el mouse -->
                                    <template #popper>
                                        <div class="descripVmenu">
                                            {{ sitio.descripcion }}
                                        </div>
                                    </template>
                                </VMenu>
                            </td>
                            <td>
                                <button :class="['btn', sitio.estado ? 'btn-success' : 'btn-danger']"
                                    @click="cambiarEstadoSitio(sitio)" style="margin-left: 10px; font-weight: bold;"
                                    :disabled="sitio.loadingActInac">
                                    <span v-if="sitio.loadingActInac" class="spinner-border spinner-border-sm"
                                        role="status" aria-hidden="true"></span>
                                    <span v-if="!sitio.loadingActInac"> {{ sitio.estado ? 'Activo' : 'Inactivo'
                                        }}</span>
                                </button>
                            </td>
                            <td>
                                <div class="btn-container">
                                    <!-- boton que abre el modal -->
                                    <button type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                                        data-bs-target="#editarp" @click="editarSitio(sitio)">
                                        <i class="material-icons">edit</i>
                                    </button>
                                    <!-- boton que abre el modal -->

                                    <!-- boton que elimina el sitio -->
                                    <button type="button" class="btns btn btn-dark" @click="irProveedor()">
                                        <i class="material-icons">account_circle</i>
                                    </button>

                                    <!-- boton que debe elimina el sitio -->
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style="display: flex; justify-content: end;">
                <button class="btn top-bar__button" id="btns" style="margin-top: 6px;">
                    Agregar Sitio Turistico
                </button>
            </div>
            <!-- espacio para el modal -->
            <div class="modal fade modal-lg" id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">
                                Editar Sitio Turístico
                            </h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <div class="row">
                                <div class="col-15">
                                    <div class="mb-3">
                                        <label class="form-label" for="nombre_sitio"><strong>Nombre
                                                *</strong></label><input class="form-control" type="text"
                                            id="nombre_sitio" name="nombre_sitio" required="" />
                                    </div>
                                </div>

                                <!-- Descripción del sitio -->
                                <div style="margin-bottom: 15px" class="col-15">
                                    <label class="form-label" for="des_sitio"><strong>Descripción *</strong></label>
                                    <textarea class="form-control" id="des_sitio" name="des_sitio" rows="1"
                                        required=""></textarea>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <strong>Imágen pricipal *</strong>
                                        <p>{{ imagesSelected }} imágenes seleccionadas (Máximo 4)</p>
                                        <div style="margin-top: -15px" class="logo">
                                            <p class="logop">
                                                <i style="color: #b7642d; font-size: 30px"
                                                    class="bi bi-file-earmark-arrow-up-fill"></i>
                                            </p>
                                            <br />
                                            <input class="foto" style="margin-top: 13px"
                                                :required="imagesSelected !== 4" type="file" ref="fileInput"
                                                accept="image/*" multiple @change="handleFileUpload" />
                                        </div>
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
                                class="btn btn-primary">
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

.link {
    text-decoration: none !important;
}

.btn-container {
    display: flex;
    justify-content: center;
    gap: 5px;
    /* Espacio entre los botones */
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
    width: 100%;
    table-layout: fixed;
    border-collapse: collapse;
}

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
