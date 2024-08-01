import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

const modelo = "piso";
const estatus = ref("");
const validacion = ref("");
const nuevoPiso = ref("");
const idPiso = ref("");
const idPisoSeleccionado = ref("");
const numPisoSelec = ref("");

export const useStorePiso = defineStore(
  modelo,
  () => {
    const pisos = ref([]);

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        console.log(response);
        pisos.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPisoPorHotel = async (idHotel) => {
      try {
        const response = await axios.get(
          `${modelo}/buscarPisoPorHotel/${idHotel}`
        );
        console.log(response);
        estatus.value = response.status;
        idPiso.value = response.data[0]._id;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const agregar = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        console.log("hola soy nuevo piso", response);
        estatus.value = response.status;
        nuevoPiso.value = response.data._id;
        console.log("soy nuevo piso", nuevoPiso);
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const editar = async (id, data) => {
      try {
        const response = await axios.put(`${modelo}/editar/${id}`, data);
        estatus.value = response.status;
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const activar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/activar/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    return {
      getAll,
      getPisoPorHotel,
      agregar,
      editar,
      activar,
      inactivar,
      pisos,
      estatus,
      validacion,
      nuevoPiso,
      idPiso,
      idPisoSeleccionado,
      numPisoSelec,
    };
  },
  {
    persist: true,
  }
);
