import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

// Nombre del modelo para las rutas
const modelo = "reserva";

// Definición de la store
export const useStoreReserva = defineStore(
  modelo,
  () => {
    // Estados reactivos
    const reservas = ref([]);
    const fechaIngreso = ref();
    const fechaEgreso = ref();
    const adultos = ref('');
    const ninos = ref('');
    const numero_noche = ref('');
    const habitacionesDisponibles = ref([]);
    const reserva = ref(null);
    const estatus = ref("");
    const validacion = ref("");

    // Obtener todas las reservas
    const getAllReservas = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        reservas.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Obtener reservas por ID de hotel
    const getReservasByHotelId = async (idHotel) => {
      try {
        const response = await axios.get(`${modelo}/hotel/${idHotel}`);
        reservas.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    const getReservasByUser = async (idUsuario) => {
      try {
        const response = await axios.get(`${modelo}/buscarReservaByUser/${idUsuario}`);
        reservas.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Obtener habitaciones disponibles entre dos fechas
    const getHabitacionesDisponibles = async (fecha_entrada, fecha_salida) => {
      try {

        const response = await axios.get(
          `${modelo}/habitacionesDisponibles/${fecha_entrada}/${fecha_salida}`
        );
        habitacionesDisponibles.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Obtener reserva por ID
    const getReservaById = async (id) => {
      try {
        const response = await axios.get(`${modelo}/${id}`);
        reserva.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Crear una nueva reserva
    const crearReserva = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        validacion.value = error.response.data.error;
        handleRequestError(error);
      }
    };

    // Editar una reserva existente
    const editarReserva = async (id, data) => {
      try {
        const response = await axios.put(`${modelo}/editar/${id}`, data);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Activar una reserva
    const activarReserva = async (id) => {
      try {
        const response = await axios.put(`${modelo}/activar/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Inactivar una reserva
    const inactivarReserva = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        handleRequestError(error);
      }
    };

    // Manejo centralizado de errores
    const handleRequestError = (error) => {
      console.log(error);
      if (error.response) {
        estatus.value = error.response.status;
      } else {
        estatus.value = "Network Error";
      }
    };

    return {
      reservas,
      habitacionesDisponibles,
      reserva,
      estatus,
      validacion,
      getAllReservas,
      getReservasByHotelId,
      getReservasByUser,
      getHabitacionesDisponibles,
      getReservaById,
      crearReserva,
      editarReserva,
      activarReserva,
      inactivarReserva,
      adultos,
      ninos,
      numero_noche,
      fechaIngreso,
      fechaEgreso,
    };
  },
  {
    persist: true, 
  }
);
