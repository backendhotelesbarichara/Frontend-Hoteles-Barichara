import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import axios from "axios";
import { createPinia } from "pinia";
import FloatingVue from 'floating-vue';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import 'floating-vue/dist/style.css';
// import './style.css'



//componentes




// Navbar y footer (Elementos que se muestran siempre)
import App from "./App.vue";

// Login y registro
import Login from "../src/components/Login.vue";
import Registro from "../src/components/Registro.vue";

// Pagina principal o home
import Home from "../src/components/Home.vue";

// Detalle habitaciones 
import galeria_habitaciones from "../src/components/Habitaciones_galeria/index.vue";

// Galeria de habitaciones 
import detalle_habitaciones from "../src/components/Habitaciones_detalle/index.vue";



// Info Info sitios turisticos
import detalle_sitio_turistico from "../src/components/InfoSTuristicos/SitioTuristicoDetalle.vue";





// Formularios
import RegitroHotel from "../src/components/Formularios/RegitroHotel.vue";
import RegistroHabitaciones from "../src/components/Formularios/RegistroHabitaciones.vue";

import HacerReserva from "../src/components/Formularios/HacerReserva.vue";
import RegistroSitio from "../src/components/Formularios/RegistroSitio.vue";
import RegistroProveedores from "../src/components/Formularios/RegistroProveedores.vue";

// Paneles Admin
import PanelAdmin from "../src/components/Admin/PanelAdmin.vue";

import PanelHoteles from "../src/components/Admin/AdminHoteles/PanelHoteles.vue";
import PanelProveedores from "../src/components/Admin/AdminProveedores/PanelProveedores.vue";
import PanelSitios from "../src/components/Admin/AdminSitios/PanelSitios.vue";
import PanelHabitaciones from "../src/components/Admin/AdminHabitaciones/PanelHabitaciones.vue";
import PanelUsuarios from "../src/components/Admin/AdminUsuarios/PanelUsuarios.vue";

// Paneles Dueño
import PanelDueno from "../src/components/Dueno/PanelDueno.vue";

import DPanelHotel from "../src/components/Dueno/DuneHotel/DPanelHotel.vue";
import DPanelHabitaciones from "../src/components/Dueno/DuenoHabitaciones/DPanelHabitaciones.vue";
import DPanelReservas from "../src/components/Dueno/DuenoReservas/DPanelReservas.vue";
import recuperarContra from "../src/components/recuperarContraseña/RecuperarContrasena.vue";



// Definir rutas
const routes = [
  {
    path: "/", component: Home
  },
  { path: "/GaleriaHabitaciones", component: galeria_habitaciones },

  { path: "/detallehabitaciones", component: detalle_habitaciones },

  { path: "/detalle-sitio-turistico", component: detalle_sitio_turistico },

  { path: "/Login", component: Login },

  { path: "/Registro", component: Registro },


  { path: "/RegitroHotel", component: RegitroHotel },

  { path: "/RegistroHabitaciones", component: RegistroHabitaciones },



  { path: "/HacerReserva", component: HacerReserva },

  { path: "/RegistroSitio", component: RegistroSitio },

  { path: "/RegistroProveedores", component: RegistroProveedores },


  // Paneles Admin
  { path: "/PanelAdmin", component: PanelAdmin },


  { path: "/PanelHoteles", component: PanelHoteles },

  { path: "/PanelProveedores", component: PanelProveedores },

  { path: "/PanelSitios", component: PanelSitios },

  { path: "/PanelHabitaciones", component: PanelHabitaciones },

  { path: "/PanelUsuarios", component: PanelUsuarios },


  // Paneles Dueño
  { path: "/PanelDueno", component: PanelDueno },


  { path: "/DPanelHotel", component: DPanelHotel },

  { path: "/DPanelHabitaciones", component: DPanelHabitaciones },

  { path: "/DPanelReservas", component: DPanelReservas },

  { path: "/recuperar-contrasena", component: recuperarContra },
];

//objeto rutas - vue router
const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { top: 0 };
  },
});


axios.defaults.baseURL = 'https://backend-hoteles-barichara.onrender.com/api/'

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

//instancia de vue
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(FloatingVue);

app.mount("#app");

