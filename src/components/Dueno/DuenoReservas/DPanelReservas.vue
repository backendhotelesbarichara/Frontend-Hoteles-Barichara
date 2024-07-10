<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Administra las reservas</h5>
    </div>
    <div>
      <!-- Botón para agregar nueva habitación -->
      <div>
        <div class="btn-group" role="group">
          <router-link class="link" to="/HacerReserva">
            <button
              style="margin-bottom: 5px; margin-top: 30px"
              class="btns btn btn-dark"
              @click="showAddModal"
            >
              <i class="material-icons">add_box</i>
            </button></router-link
          >
        </div>
      </div>

      <!-- Tabla de habitaciones -->
      <div style="font-size: 12px" class="table-responsive">
        <table class="table table-bordered">
          <thead style="align-items: center; text-align: center">
            <tr>
              <th>Alias</th>
              <th>Estado</th>

              <th>Persona</th>
              <th>Correo</th>
              <th>Número</th>

              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(room, index) in rooms" :key="index">
              <td>{{ room.alias }}</td>
              <td>
                <div class="btn-container">
                  <button
                    style="background-color: green"
                    class="custom btn btn-dark"
                    title="Disponible"
                  >
                    <i class="material-icons">done</i>
                  </button>

                  <button
                    style="background-color: orange"
                    class="custom btn btn-dark"
                    title="Rerservada"
                  >
                    <i class="material-icons">done_all</i>
                  </button>

                  <button
                    style="background-color: red"
                    class="custom btn btn-dark"
                    title="Ocupada"
                  >
                    <i class="material-icons">close</i>
                  </button>
                </div>
              </td>

              <td>{{ room.persona }}</td>

              <td>{{ room.correo }}</td>

              <td>{{ room.numeroTel }}</td>

              <td>{{ Number(room.precio) }}</td>
              <td>
                <div class="btn-container">
                  <button
                    style="max-height: 30px"
                    type="button"
                    class="btns btn btn-dark"
                    data-bs-toggle="modal"
                    data-bs-target="#editarDHabitaciones"
                  >
                    <i class="material-icons">edit</i>
                  </button>

                  <button style="max-height: 30px" class="btns btn btn-dark">
                    <i class="material-icons">delete</i>
                  </button>

                  <!-- separador -->
                  <div class="separator"></div>

                  <!-- Agrega un select con tres opciones -->
                  <select
                    style="width: 110px; height: 30px; font-size: 12px"
                    class="form-select"
                  >
                    <option selected>Estados</option>
                    <option value="1">Disponible</option>
                    <option value="2">Reservada</option>
                    <option value="3">Ocupada</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- espacio para el modal -->
      <div
        class="modal fade modal-small"
        id="editarDHabitaciones"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
                Editar reserva
              </h1>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="alias_habitacion"
                      ><strong>Alias *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="alias_habitacion"
                      name="alias_habitacion"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="nombre_reservante"
                      ><strong>Persona *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="nombre_reservante"
                      name="nombre_reservante"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="correo_reservante"
                      ><strong>Correo *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="correo_reservante"
                      name="correo_reservante"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="nro_reservante"
                      ><strong>Número *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="nro_reservante"
                      name="nro_reservante"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-15">
                  <div class="mb-3">
                    <label class="form-label" for="precio_habitacion"
                      ><strong>Precio *</strong></label
                    ><input
                      class="form-control"
                      type="number"
                      id="precio_habitacion"
                      name="precio_habitacion"
                      required=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                style="background-color: #343a40; border-style: none"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                style="background-color: #b7642d; border-style: none"
                class="btn btn-primary"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- espacio para el modal -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [
        {
          alias: "Habitación 1",
          persona: "Dilan",
          correo: "dilandrog@gmail.com",
          numeroTel: "3222432430",
          precio: 50000,
        },
      ],
    };
  },
};
</script>

<style scoped>
.separator {
  width: 1px; /* Ancho de la línea vertical */
  height: 30px; /* Altura de la línea vertical */
  background-color: #38383835; /* Color de la línea */
  margin: 0 5px; /* Espacio entre los botones y la línea */
}

.modal-small .modal-dialog {
  max-width: 300px; /* Establece el ancho deseado */
  margin: 0 auto; /* Centra horizontalmente el modal */
  top: 50%; /* Coloca el modal en el centro vertical */
  transform: translateY(-50%); /* Alinea verticalmente el modal */
}

.logo {
  position: relative;
  max-width: 30px;
  max-height: 40px;
  margin-top: 5px;
  transition: 1s;
}

.logo:hover {
  position: relative;
  max-width: 30px;
  max-height: 40px;
  margin-top: 5px;
  transform: scale(1.1); /* Cambia el tamaño al pasar el mouse */
}

.logop {
  color: #fff;
  text-align: center;
}

.foto {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.btn-container {
  display: flex;
  justify-content: center;
  gap: 5px; /* Espacio entre los botones */
}

.material-icons {
  font-size: 20px; /* Tamaño del icono */
}

.galeria {
  padding: 16px;
  margin-top: 8px;
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

@media screen and (max-width: 500px) {
  .Hoteles {
    background-color: #b7642d;
    align-items: left;
    border-radius: 10px;
  }
}

/* Estilos para la tabla */
.table {
  border-collapse: collapse; /* Para eliminar los espacios entre las celdas */
  width: 100%;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2; /* Color de fondo para las celdas del encabezado */
}

.btn-container {
  display: flex;
  gap: 5px; /* Espacio entre los botones */
}

.btns {
  border-radius: 50%; /* Redondear los botones */
  padding: 5px; /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%; /* Redondear los botones */
  padding: 5px; /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40; /* Color de fondo de los botones */
  color: white; /* Color del texto de los botones */
  border: none; /* Eliminar el borde de los botones */
}

.custom {
  border-radius: 50%; /* Redondear los botones */
  padding: 5px; /* Agregar espacio interior para separar los iconos */
  display: flex;
  align-items: center;
  justify-content: center;
  color: white; /* Color del texto de los botones */
  border: none; /* Eliminar el borde de los botones */
}

.material-icons {
  font-size: 20px; /* Tamaño del icono */
}

/* Estilos para scrollbar */
.table-responsive::-webkit-scrollbar {
  height: 7px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background-color: #b7642d;
  border-radius: 20px;
}
</style>
