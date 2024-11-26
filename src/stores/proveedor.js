import axios from "axios";
import { ref } from "vue";
import { defineStore } from "pinia";

const modelo = "proveedor";

export const useStoreProveedor = defineStore(
  modelo,
  () => {
    const proveedores = ref([]);
    const estatus = ref("");
    const validacion = ref("");
    const nuevoProveedor = ref("");
    const proveedorSeleccionado = ref("");

    const getAll = async () => {
      try {
        const response = await axios.get(`${modelo}/all`);
        /* console.log(response); */
        proveedores.value = response.data;
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const getPorId = async (id) => {
      try {
        const response = await axios.get(`${modelo}/buscarId/${id}`);
        /* console.log(response); */
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    
    const getPorSitioTuristico = async (id) => {
        try {
          const response = await axios.get(`${modelo}/buscar-por-sitio/${id}`);
          /* console.log(response); */
          estatus.value = response.status;
          return response.data;
        } catch (error) {
          console.log(error);
          validacion.value = error.response.data.error;
          estatus.value = error.response.status;
        }
      };

    const agregar = async (data) => {
      try {
        const response = await axios.post(`${modelo}/registro`, data);
        /* console.log("Nuevo proveedor creado:", response); */
        estatus.value = response.status;
        nuevoProveedor.value = response.data._id;
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
        /* console.log(response); */
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
        /* console.log(response); */
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const inactivar = async (id) => {
      try {
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        /* console.log(response); */
        return response.data;
      } catch (error) {
        console.log(error);
        validacion.value = error.response.data.error;
        estatus.value = error.response.status;
      }
    };

    const subirFoto = async (id, file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "proveedor");
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dwslti4ar/image/upload`,
          formData,
          config
        );
        console.log(response);
        const logo = response.data.secure_url;

        return logo;
      } catch (error) {
        console.error("Error al subir la foto:", error);
        throw error; // Re-lanzar el error para que se pueda manejar en el llamador
      }
    };

    return {
      getAll,
      getPorId,
      getPorSitioTuristico,
      agregar,
      editar,
      activar,
      inactivar,
      subirFoto,
      proveedores,
      estatus,
      validacion,
      nuevoProveedor,
      proveedorSeleccionado,
    };
  },
  {
    persist: true,
  }
);
