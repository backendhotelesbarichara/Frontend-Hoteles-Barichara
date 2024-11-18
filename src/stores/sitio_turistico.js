import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

const modelo = "sitio-turistico";

export const useStoreSitioTuristico = defineStore(
  modelo,
  () => {
    const sitios = ref([]);
    const estatus = ref("");
    const validacion = ref("");
    const nuevoSitio = ref("");
    const sitioSeleccionado = ref("");

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        console.log(response);
        sitios.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const getPorId = async (id) => {
      try {
        const response = await axios.get(`${modelo}/buscarId/${id}`);
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
      }
    };

    const agregar = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        console.log("Nuevo sitio turístico creado:", response);
        estatus.value = response.status;
        nuevoSitio.value = response.data._id;
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
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
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
      getPorId,
      agregar,
      editar,
      activar,
      inactivar,
      sitios,
      estatus,
      validacion,
      nuevoSitio,
      sitioSeleccionado,
    };
  },
  {
    persist: true,
  }
);
