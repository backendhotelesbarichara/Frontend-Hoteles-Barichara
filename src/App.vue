<script setup>
import { RouterLink } from "vue-router";

defineProps({
  msg: String,
});

</script>



<template>
    <!-- Start: Navbar With Button -->
    <nav class="navbar navbar-expand-md bg-body py-3">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#"><span
                    class="bs-icon-sm bs-icon-rounded bs-icon-primary d-flex justify-content-center align-items-center me-2 bs-icon"
                    style="background: #b7642d"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"
                        fill="currentColor" viewBox="0 0 16 16" class="bi bi-houses">
                        <path
                            d="M5.793 1a1 1 0 0 1 1.414 0l.647.646a.5.5 0 1 1-.708.708L6.5 1.707 2 6.207V12.5a.5.5 0 0 0 .5.5.5.5 0 0 1 0 1A1.5 1.5 0 0 1 1 12.5V7.207l-.146.147a.5.5 0 0 1-.708-.708L5.793 1Zm3 1a1 1 0 0 1 1.414 0L12 3.793V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.293l1.854 1.853a.5.5 0 0 1-.708.708L15 8.207V13.5a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 4 13.5V8.207l-.146.147a.5.5 0 1 1-.708-.708L8.793 2Zm.707.707L5 7.207V13.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5V7.207l-4.5-4.5Z">
                        </path>
                    </svg></span><span>Hoteles Barichara</span></a><button data-bs-toggle="collapse" class="navbar-toggler"
                data-bs-target="#navcol-1">
                <span class="visually-hidden">Toggle navigation</span><span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navcol-1">
                <ul class="navbar-nav me-auto">
                    <router-link class="link" to="/">
                        <li class="nav-item">
                            <a class="nav-link"><i style="color: black" class="bi bi-house-fill"></i> Inicio</a>
                        </li>
                    </router-link>

                    <!-- Icono carrito -->
                    <!-- <li class="nav-item">
                        <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#carrito">
                            <i style="color: black" class="bi bi-cart4"></i> Carrito
                        </a>
                    </li> -->

                    <!--  gestion hotel -->
                    <div style="margin-bottom: 15px" class="dropdown">
                        <router-link class="link" to="/PanelDueno">
                            <li style="margin-left: 10px" class="nav-item">
                                <a class="nav-link"><i style="color: black" class="bi bi-house-gear-fill"></i>
                                    Gestion Hotelera</a>
                            </li>
                        </router-link>
                    </div>

                    <!-- administrador -->

                    <div style="margin-bottom: 15px" class="dropdown">
                        <router-link class="link" to="/PanelAdmin">
                            <li style="margin-left: 10px" class="nav-item">
                                <a class="nav-link"><i style="color: black" class="bi bi-gem"></i>
                                    Administracion</a>
                            </li>
                        </router-link>
                        <ul style="font-size: 12px" class="dropdown-menu">




                        </ul>
                </div>
            </ul>

            <router-link class="link" to="/Login">
                <button style="
                  margin-right: 10px;
                  border-radius: 50px;
                  background-color: #b7642d;
                  border-style: none;
                " class="btn btn-primary">
                        <i class="bi bi-box-arrow-in-right"></i>
                        Entrar
                    </button>
                </router-link>

                <!-- <router-link class="link" to="/Registro">
              <button style="border-radius: 50px" class="btn btn-dark">
                <i class="bi bi-person-plus-fill"></i>
                Registro
              </button>
            </router-link> -->
            </div>
        </div>

        <!-- Modal que hace de carrito de compras -->
        <div class="modal fade modal-small" id="carrito" tabindex="-1">
            <div class="modal-dialog modal-lg modal-right">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Por reservar</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul id="carrito-lista" class="list-group">
                            <div style="
                      background-color: #b7642d14;
                      padding: 10px 10px 1px;
                      border-radius: 5px;
                    " id="habitaciones" class="mb-3">
                                <!-- Habitación 1 -->
                                <div style="margin-bottom: 10px" class="d-flex justify-content-between align-items-center">
                                    <router-link class="link" to="">
                                        <p class="mb-0 limit-text">Habitación 1</p>
                                    </router-link>
                                    <span class="badge custom-badge badge-pill"
                                        style="background-color: #343a40; color: white">$50.000</span>
                                    <button style="background: #b7642d; border-style: none" class="btn btn-danger btn-sm">
                                        Eliminar
                                    </button>
                                </div>

                                <!-- Habitación 2 -->
                                <div style="margin-bottom: 10px" class="d-flex justify-content-between align-items-center">
                                    <p class="mb-0 limit-text">Habitación 2</p>
                                    <span class="badge custom-badge badge-pill"
                                        style="background-color: #343a40; color: white">$50.000</span>
                                    <button style="background: #b7642d; border-style: none" class="btn btn-danger btn-sm">
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </ul>
                        <div class="text-center" style="display: flex; flex-direction: row; justify-content: center">
                            <p id="precioTotalModal" style="
                      font-size: 12px;
                      font-weight: bold;
                      background-color: #b7642d14;
                      color: rgb(0, 0, 0);
                      border-radius: 5px;
                      max-width: 140px;
                      margin-bottom: 1px;
                    " >
                                Total: $100.000
                            </p>
                        </div>


                    </div>
                    <div class="modal-footer">
                        <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-danger"
                            id="vaciarCarrito">
                            Vaciar Carrito
                        </button>

                        <button type="button" style="background-color: #b7642d; border-style: none"
                            class="btn btn-secondary" id="pagarReservas">
                            Reservar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modal que hace de carrito de compras -->
    </nav>
    <!-- End: Navbar With Button -->
    <router-view></router-view>
</template>

<script></script>

<style scoped>
.limit-text {
    max-width: 90px;
    /* Define el ancho máximo */
    word-wrap: break-word;
    /* Permite saltos de línea en palabras largas */
    line-height: 1.2;
    /* Ajusta el espaciado entre líneas */
}

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

hr {
    border: none;
    /* Quita el borde predeterminado */
    background-color: #b7642d;
    /* Cambia el color de fondo a azul (puedes usar cualquier color que desees) */
    height: 2px;
    /* Define el grosor de la línea horizontal */
}</style>
