<!-- Elaborado por Tecnoparque Nodo Socorro -->
<script setup>
import { ref, onMounted } from 'vue';
import { hoteles, Sturisticos } from './../components/BD/bd';
import { useStoreSitioTuristico } from '../stores/sitio_turistico.js';
import { useStoreHotel } from '../stores/hotel.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const useHotel = useStoreHotel();
const useSitioTuristico = useStoreSitioTuristico();
const listaHoteles = ref("");
const sitiosTuristicos = ref([]);
const datahotel = ref(hoteles);
const datasitios = ref(Sturisticos);
const img = ref("")
const cargando = ref(true);
const cargandoSitiosT = ref(true)

function irInfoHotel(hotel) {
    useHotel.HotelHome = hotel._id
    /* router.push('/GaleriaHabitaciones') */
    // En lugar de router.push, abrimos una nueva pestaña
    const url = router.resolve({ path: '/GaleriaHabitaciones', query: { id: hotel._id } }).href;
    window.open(url, '_blank');
}

function irSitioTuristico(sitio) {
    const url = router.resolve({ path: '/detalle-sitio-turistico', query: { id: sitio } }).href;
    window.open(url, '_blank');
}

async function getHoteles() {
    try {
        const response = await useHotel.getAll()
        if (useHotel.estatus === 200) {
            listaHoteles.value = response.filter(hotel => hotel.estado === true);
            cargando.value = false;
        }

        console.log(response);
    } catch (error) {
        console.log(error);
        cargandoSitiosT.value = false;
    } finally {
        cargando.value = false;
    }
}

async function getSitiosTuristicos() {
    try {
        const response = await useSitioTuristico.getAll()
        if (useHotel.estatus === 200) {
            sitiosTuristicos.value = response.reverse().filter(sitio => sitio.estado === true);
            cargandoSitiosT.value = false;
        }

        console.log(response);
    } catch (error) {
        console.log(error);
        cargandoSitiosT.value = false;
    } finally {
        cargandoSitiosT.value = false;
    }
}

onMounted(() => {
    getHoteles();
    getSitiosTuristicos();
})
</script>

<template>
    <!--  -->
    <!-- Start: Slider Carousel with side text -->
    <div id="carousel" class="carousel slide" data-bs-interval="2500" data-bs-ride="carousel">
        <!-- Start: Slides -->
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="w-100 d-block" src="https://i.ibb.co/pjcNX5L/2.png" />
                <div class="carousel-caption d-flex"
                    style="position: absolute;top: 0px;left: 0px;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Histórico
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/NLb0D2Z/1.png" />
                <div class="carousel-caption d-flex"
                    style="position: absolute;top: 0px;left: 50%;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Pintoresco
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/KjjL7xM/3.png" />
                <div class="carousel-caption d-flex"
                    style="position: absolute;top: 0px;left: 0px;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Encantador
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/H2bzWzv/4.png" />
                <div class="carousel-caption d-flex"
                    style="position: absolute;top: 0px;left: 50%;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Tranquilo
                        </h1>
                    </div>
                </div>
            </div>
        </div>
        <!-- End: Slides -->

        <!-- Start: Controls -->
        <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        </button>
        <!-- End: Controls -->
    </div>
    <!-- End: Slider Carousel with side text -->

    <!-- Inicio de scroll de hoteles y sitios -->
    <div class="galeria">
        <div class="Busquedas">
            <div class="row" style="text-align: center; margin-bottom: 25px">
                <h5 class="fw-bold text-uppercase" style="color: #b7642d;">Busqueda de alojamientos en general</h5>
                <div class="col-6 col-md-4" style="margin-bottom: 20px; display: inline-block">
                    <div class="input-group">
                        <span style="background-color: #b7642d; color: #fff" class="input-group-text"
                            id="addon-wrapping">Ingreso</span>
                        <input type="date" class="form-control" />
                    </div>
                </div>

                <div class="col-6 col-md-4" style="display: inline-block">
                    <div class="input-group">
                        <span style="background-color: #b7642d; color: #fff" class="input-group-text"
                            id="addon-wrapping">Salida</span>
                        <input type="date" class="form-control" />
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <button class="btncafe"><i class="bi bi-search"></i> Buscar Habitaciones Disponibles </button>
                </div>
            </div>
        </div>

        <div class="Hoteles" id="hoteles">
            <h5>Hoteles</h5>
        </div>
        <button type="button" class="btn btn-custom btn-sm scroll-button" @click="scrollImages(-100, 'hotel')">
            <i style="color: black" class="bi bi-arrow-left-circle-fill"></i>
        </button>

        <button type="button" class="btn btn-custom btn-sm scroll-button" @click="scrollImages(100, 'hotel')">
            <i style="color: black" class="bi bi-arrow-right-circle-fill"></i>
        </button>

        <!-----------------------------------------------PASARELA HOTELES----------------------------------->
        <div v-if="cargando" class="d-flex justify-content-center flex-column align-items-center">
            <div class="spinner-border" style="color: #b7642d " role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p>Por favor espere...</p>
        </div>
        <div v-else class="lista-imagenes hotel-images">
            <div class="imagen-con-texto" v-for="hotel in listaHoteles" :key="hotel._id" :value="hotel._id"
                @click="irInfoHotel(hotel)">
                <img :src="hotel.fotos[0].url" alt="imagen-principal" />
                <p class="text-hotel">{{ hotel.nombre }}</p>
            </div>
        </div>

        <br />

        <div class="Sitios">
            <h5 id="sitiosTuristicos">Sitios Turísticos</h5>
        </div>

        <button type="button" class="btn btn-custom btn-sm scroll-button" @click="scrollImages(-100, 'sitios')">
            <i style="color: black" class="bi bi-arrow-left-circle-fill"></i>
        </button>

        <button type="button" class="btn btn-custom btn-sm scroll-button" @click="scrollImages(100, 'sitios')">
            <i style="color: black" class="bi bi-arrow-right-circle-fill"></i>
        </button>

        <!-----------------------------------------------PASARELA SITIOS TURISTICOS----------------------------------->
        <!--         <div class="lista-imagenes sitios-images">
            <div class="imagen-con-texto" v-for="sitio in datasitios" :key="sitio.nombre">
                <router-link class="link" to="/SaltoDelMico">
                    <img :src="sitio.img1" alt="imagen-principal" />
                    <p class="text-hotel">{{ sitio.nombre }}</p>
                </router-link>
            </div>
        </div> -->

        <div class="lista-imagenes sitios-images">
            <div class="imagen-con-texto" v-for="sitio in sitiosTuristicos" :key="sitio.nombre"
                @click="irSitioTuristico(sitio._id)">
                <img :src="sitio.imagen[0].url" alt="imagen-principal" />
                <p class="text-hotel">{{ sitio.nombre }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.btncafe {
    margin-right: 10px;
    border-radius: 50px;
    background-color: #b7642d;
    border-style: none;
    color: #fff;
    padding: 8px;
    margin-left: 5px;
}

.lista-imagenes {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    gap: 16px;
    margin: 20px 0;
}

.imagen-con-texto {
    width: 100%;
    max-width: 300px;
    height: 100%;
    border-radius: 10px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.imagen-con-texto:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.2);
}

.imagen-con-texto img {
    width: 100%;
    height: auto;
    max-height: 200px;
    object-fit: cover;
}

.text-hotel {
    padding: 10px;
    background-color: #b7642d;
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    border-top: 1px solid rgba(255, 255, 255, 0.5);
    margin: 0;
}

.imagen-con-texto {
    transition: 0.5s;
}

.imagen-con-texto:hover {
    filter: saturate(2);
    transform: scale(1.01);
}

.btn.btn-custom {
    transition: transform 0.3s;
}

.btn.btn-custom:active {
    animation: iconClickAnimation 0.3s ease;
}

@keyframes iconClickAnimation {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.2);
    }

    100% {
        transform: scale(1);
    }
}

.link {
    text-decoration: none !important;
}



/* Estilos para scrollbar */
.lista-imagenes::-webkit-scrollbar {
    height: 7px;
}

.lista-imagenes::-webkit-scrollbar-thumb {
    background-color: #b7642d;
    border-radius: 20px;
}

/* Estilos para botones de scroll */
.btn.btn-custom {
    background-color: #b7642d 00;
    color: #fff;
}

.galeria {
    padding: 16px;
    margin-top: 8px;
    transform: 1s;
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

.Sitios {
    background: linear-gradient(to right, #b7642d, transparent);
    align-items: center;
    border-radius: 10px;
    transition: 1s;
}

/* Ocultar barra de desplazamiento vertical */
.lista-imagenes {
    overflow-y: hidden;
}

@media screen and (max-width: 2000px) {
    .lista-imagenes img {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1px;
        width: 100%;
        height: 300px;
    }
}

@media screen and (max-width: 700px) {
    .lista-imagenes img {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 100%;
        height: 200px;
    }
}

@media screen and (max-width: 500px) {
    .lista-imagenes img {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 100%;
        height: 150px;
    }

    .Sitios {
        background: #b7642d;
        align-items: center;
        border-radius: 10px;
    }

    .Hoteles {
        background-color: #b7642d;
        align-items: left;
        border-radius: 10px;
    }
}
</style>