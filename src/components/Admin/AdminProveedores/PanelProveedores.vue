<template>
<div class="galeria">
    <div class="Hoteles">
        <h5>Administrar proveedores</h5>
    </div>
    <div>
        <!-- Botón para agregar nuevo proveedor -->
        <div>
            <div class="btn-group" role="group">
                <router-link class="link" to="/RegistroProveedores">
                    <button style="margin-bottom: 5px; margin-top: 30px; margin-right: 5px" class="btns btn-dark">
                        <i class="material-icons">add_box</i>
                    </button></router-link>
            </div>
        </div>

        <!-- Tabla de proveedores -->
        <div style="font-size: 12px;" class="table-responsive">
            <table class="table table-bordered">
                <thead style="align-items: center; text-align: center">
                    <tr>
                        <th>Nombre</th>
                        <th>Telefono</th>
                        <th>Sitios vinculados</th>
                        <th>vigencia</th>
                        <th>Acciones</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="proveedor in dataproveedores">
                        <td>{{ proveedor.alias }}</td>
                        <td>{{ proveedor.tel }}</td>

                        <td>

                            <div class="col" v-for="lugares in proveedor.sitios" bind:key="lugares.nombre">
                                {{ lugares.nombre }}
                            </div>

                        </td>

                        <td>{{proveedor.vigencia}}</td>
                        <td>
                            <div class="btn-container">
                                <!-- boton que abre el modal -->
                                <button type="button" class="btns btn btn-dark" data-bs-toggle="modal" data-bs-target="#editarp">
                                    <i class="material-icons">edit</i>
                                </button>
                                <!-- boton que abre el modal -->

                                <!-- boton que debe eliminar el proveedor -->
                                <button type="button" class="btns btn btn-dark">
                                    <i class="material-icons">delete</i>
                                </button>
                                <!-- boton que debe eliminar el proveedor -->
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- espacio para el modal -->
        <div class="modal fade modal-small" id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Editar proveedor
                        </h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="col-15">
                            <div class="mb-3">
                                <strong>Imágen pricipal *</strong>
                                <p>{{ imagesSelected }} imágenes seleccionadas (Máximo 1)</p>
                                <div style="margin-top: -15px" class="logo">
                                    <p class="logop">
                                        <i style="color: #b7642d; font-size: 30px" class="bi bi-file-earmark-arrow-up-fill"></i>
                                    </p>
                                    <br />
                                    <input class="foto" style="margin-top: 13px" :required="imagesSelected !== 1" type="file" ref="fileInput" accept="image/*" multiple @change="handleFileUpload" />
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-15">
                                <div class="mb-3">
                                    <label class="form-label" for="nombre_proveedor"><strong>Nombre *</strong></label><input class="form-control" type="text" id="nombre_proveedor" name="nombre_proveedor" required="" />
                                </div>
                            </div>

                            <div class="col-15">
                                <div class="mb-3">
                                    <label class="form-label" for="telefono_proveedor"><strong>Telefono *</strong></label><input class="form-control" type="number" id="telefono_proveedor" name="telefono_proveedor" required="" />
                                </div>
                            </div>

                            <div class="col-15">
                                <div class="mb-3">
                                    <label class="form-label" for="sitio_asignado"><strong>Sitio *</strong></label><input class="form-control" type="text" id="sitio_asignado" name="sitio_asignado" required="" />
                                </div>
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

<script>
import {
    proveedores
} from './../../BD/bd'
export default {
    data: () => ({
        dataproveedores: proveedores,
    })

}
</script>

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
