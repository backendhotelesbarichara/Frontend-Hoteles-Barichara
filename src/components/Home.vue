<script setup>
import { ref, onMounted } from 'vue';
import { hoteles, Sturisticos } from './../components/BD/bd';
import { useStoreHotel } from '../stores/hotel.js';
import { useRouter } from 'vue-router';


const router = useRouter();
const useHotel = useStoreHotel();
const listaHoteles = ref("");
const datahotel = ref(hoteles);
const datasitios = ref(Sturisticos);
const img = ref("")
const cargando = ref(true);

async function getHoteles() {
    try {
        const response = await useHotel.getAll()
        if (useHotel.estatus === 200) {
            listaHoteles.value = response;
            cargando.value = false;
        }

        console.log(response);
    } catch (error) {
        console.log(error);
    }
}

function irInfoHotel(hotel) {
    useHotel.HotelHome = hotel._id
    console.log("hola idhotel", hotel)
    router.push('/GaleriaHabitaciones')
}

onMounted(() => {
    getHoteles();
})
</script>

<template>
    <!-- Start: Slider Carousel with side text -->
    <div id="carousel" class="carousel slide" data-bs-interval="2500" data-bs-ride="carousel" >
        <!-- Start: Slides -->
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img class="w-100 d-block" src="https://i.ibb.co/pjcNX5L/2.png" />
                <div class="carousel-caption d-flex" style="position: absolute;top: 0px;left: 0px;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Histórico
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/NLb0D2Z/1.png" />
                <div class="carousel-caption d-flex" style="position: absolute;top: 0px;left: 50%;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Pintoresco
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/KjjL7xM/3.png" />
                <div class="carousel-caption d-flex" style="position: absolute;top: 0px;left: 0px;width: 50%;height: 100%;">
                    <div class="d-md-block position-absolute top-50 start-50 translate-middle">
                        <h1 style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);font-style: italic;">
                            Encantador
                        </h1>
                    </div>
                </div>
            </div>
            <div class="carousel-item">
                <img class="w-100 d-block" src="https://i.ibb.co/H2bzWzv/4.png" />
                <div class="carousel-caption d-flex" style="position: absolute;top: 0px;left: 50%;width: 50%;height: 100%;">
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
                <img :src="hotel.imagen" alt="imagen-principal" />
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
        <div class="lista-imagenes sitios-images">
            <div class="imagen-con-texto" v-for="sitio in datasitios" :key="sitio.nombre">
                <router-link class="link" to="/SaltoDelMico">
                    <img :src="sitio.img1" alt="imagen-principal" />
                    <p class="text-hotel">{{ sitio.nombre }}</p>
                </router-link>
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

.imagen-con-texto {
    transition: 0.5s;
}

.imagen-con-texto:hover {
    filter: saturate(2);
    transform: scale(1.01);
    /* Cambia el tamaño al pasar el mouse */
}

.btn.btn-custom {
    transition: transform 0.3s;
    /* Transición de transformación */
}

.btn.btn-custom:active {
    animation: iconClickAnimation 0.3s ease;
    /* Aplica la animación al hacer clic */
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

.text-hotel {
    margin-right: 10px;
    text-align: center;
    background-color: #b7642d;
    color: #fff;
    border-radius: 0 0 10px 10px;
    /* Redondear solo las esquinas superiores */
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

.lista-imagenes img {
    width: 100%;
    object-fit: cover;
    width: 107px;
    height: 150px;
    margin-right: 10px;
    display: block;
    border-radius: 10px 10px 0 0;
    /* Redondear solo las esquinas superiores */
}

.lista-imagenes {
    display: flex;
    overflow-y: auto;
    margin-top: 10px;
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
        /* Flexbox */
        /* width: 70%;
	display: flex;
	flex-wrap: wrap;
	gap: 20px; */

        /* Grid */
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1px;
        width: 300px;
        height: 300px;
    }
}

@media screen and (max-width: 700px) {
    .lista-imagenes img {
        /* Flexbox */
        /* width: 70%;
	display: flex;
	flex-wrap: wrap;
	gap: 20px; */

        /* Grid */
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 200px;
        height: 200px;
    }
}

@media screen and (max-width: 500px) {
    .lista-imagenes img {
        /* Flexbox */
        /* width: 70%;
	display: flex;
	flex-wrap: wrap;
	gap: 20px; */

        /* Grid */
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
        width: 107px;
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
