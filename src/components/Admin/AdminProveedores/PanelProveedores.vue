<template>
    <div class="galeria">
        <div class="Hoteles">
            <h5>Administrar proveedores</h5>
        </div>
        <div>
            <div class="text-center w-25 mt-5" style="display: flex; align-items: baseline;">
                <p for="hotelSelector" class="form-p fw-bold w-100 fs-3">Proveedores de: </p>
                <select id="hotelSelector" class="form-select text-center fw-bold">
                    <option selected disabled value=""> Salto del mico</option> <!-- Opción por defecto -->
                    <option value="Salto del mico"> Seleccione un sitio turistico...
                    </option>
                </select>
            </div>

            <!-- Tabla de proveedores -->
            <div style="font-size: 12px;" class="table-responsive">
                <table class="table table-bordered">
                    <thead style="align-items: center; text-align: center">
                        <tr>
                            <th>Nombre</th>
                            <th>Telefono</th>
                            <th>Sitio vinculado</th>
                            <th>Estado</th>
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
                            <td><button class="btn btn-success fw-bold">{{ proveedor.estado }}</button></td>
                            <td>
                                <div class="btn-container">
                                    <!-- boton que abre el modal -->
                                    <button type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                                        data-bs-target="#editarp">
                                        <i class="material-icons">edit</i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div style="display: flex; justify-content: end;">
                    <button class="btn top-bar__button" id="btns" style="margin-top: 6px;">
                        Agregar Proveedor
                    </button>
                </div>
            </div>

            <!-- espacio para el modal -->
            <div class="modal fade modal-lg" id="editarp" tabindex="-1" aria-labelledby="exampleModalLabel"
                aria-hidden="true">
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
                                            class="form-control" type="text" id="nombre_proveedor"
                                            name="nombre_proveedor" required="" />
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="telefono_proveedor"><strong>Telefono
                                                <span class="text-danger">*</span></strong></label><input
                                            class="form-control" type="number" id="telefono_proveedor"
                                            name="telefono_proveedor" required="" />
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="sitio_asignado"><strong>Sitio Turístico asignado
                                                <span class="text-danger">*</span></strong></label>
                                        <select id="hotelSelector" class="form-select text-start fw-bold">
                                            <option selected disabled value=""> Salto del mico</option>
                                            <!-- Opción por defecto -->
                                            <option value="Salto del mico"> Seleccione un sitio turistico...
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <div class="mb-3">
                                        <strong>Foto <span class="text-danger">*</span></strong>
                                        <p>(Debe haber mínimo 1 foto, la foto debe pesar como máximo 10MB)</p>
                                        <button type="button" style="background-color: #b7642d; border-style: none"
                                        class="btn btn-primary">Ver foto</button>
<!--                                         <div style="margin-top: -15px" class="logo">
                                            <p class="logop">
                                                <i style="color: #b7642d; font-size: 30px"
                                                    class="bi bi-file-earmark-arrow-up-fill"></i>
                                            </p>
                                            <br />
                                             <input class="foto" style="margin-top: 13px"
                                                :required="imagesSelected !== 1" type="file" ref="fileInput"
                                                accept="image/*" multiple @change="handleFileUpload" />
                                        </div> -->
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

<script setup>
import { ref } from 'vue';
import { proveedores } from './../../BD/bd';

const dataproveedores = ref(proveedores);
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
