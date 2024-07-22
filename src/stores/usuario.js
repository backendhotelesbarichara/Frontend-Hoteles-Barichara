import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const modelo = "usuario";

export const useStoreUsuarios = defineStore(
  modelo,
  () => {
    const validacion = ref("");
    const estatus = ref("");
    const token = ref("");
    const usuario = ref("");
    const nombre = ref("");
    const email = ref("");
    const id = ref("");
    const router = useRouter();

    function insertarToken() {
      axios.defaults.headers.common["x-token"] = token.value;
    }

    const login = async (data) => {
      try {
        const response = await axios.post(`${modelo}/login`, data);
        console.log("Hola soy login", response);
        console.log("id usuario", id.value)
        token.value = response.data.token;
        usuario.value = response.data.usuario;
        id.value = response.data.usuario._id;
        estatus.value = response.status;
        return response;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
        validacion.value = error.response.data.error;
        console.log("validar", validacion);
      }
    };

    const editar = async (id, data) => {
      try {
        insertarToken();
        const response = await axios.put(`${modelo}/editar/${id}`, data);
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
        if (error.message === "Network Error") {
          validacion.value = "Sin conexión, por favor intente recargar";
          console.log(validacion);
          return null;
        }
        if (
          error.response.data.error === "No hay token en la peticion" ||
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          validacion.value = "Sin conexión, por favor intente recargar";
          console.log(validacion);
          router.push("/login");
          return null;
        }
        return error.response.data;
      }
    };

    const agregar = async (data) => {
      try {
        insertarToken();
        const response = await axios.post(`${modelo}/registro`, data);
        console.log(response);
        estatus.value = response.status;
        return response.data;
      } catch (error) {
        console.log(error);
        estatus.value = error.response.status;
        if (error.message === "Network Error") {
          validacion.value = "Sin conexión, por favor intente recargar";
          console.log(validacion);
          return null;
        }
        if (
          error.response.data.error === "No hay token en la peticion" ||
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          validacion.value = "Sin conexión, por favor intente recargar";
          console.log(validacion);
          router.push("/login");
          return null;
        }
        return error.response.data;
      }
    };

    return {
      login,
      agregar,
      editar,
      token,
      id,
      email,
      usuario,
      validacion,
      estatus,
    };
  },
  {
    persist: true,
  }
);
