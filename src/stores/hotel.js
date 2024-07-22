import axios from "axios";
import { ref } from 'vue'
import { defineStore } from "pinia";

const modelo = "hotel";
const estatus = ref("");
const validacion = ref("");
const nuevoHotel = ref("");

export const useStoreHotel = defineStore(modelo, () => {
  const hoteles = ref([]);

  const getAll = async () => {
    try {
      const response = await axios.get(`${modelo}/all`);
      console.log(response);
      hoteles.value = response.data;
      estatus.value = response.status;
      return response.data;
    } catch (error) {
      console.log(error);
      estatus.value = error.response.status;
    }
  };

  const getPorUsuario = async (idUsuario) => {
    try {
      const response = await axios.get(`${modelo}/buscarHotel/${idUsuario}`);
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
      console.log("hola soy nuevo hotel",response);
      estatus.value = response.status;
      nuevoHotel.value = response.data._id
      console.log("soy nuevo hotel", nuevoHotel)
      return response.data;
    } catch (error) {
      console.log(error);
      validacion.value = error.response.data.error
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

  return { getAll,getPorUsuario, agregar, editar, activar, inactivar, hoteles, estatus, validacion, nuevoHotel };
});