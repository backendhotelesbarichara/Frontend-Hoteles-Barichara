<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStoreReserva } from '../../../stores/reserva.js';
import { useStoreUsuarios } from '../../../stores/usuario.js';

const useReserva = useStoreReserva();
const useUsuario = useStoreUsuarios();
const idUsuario = ref(useUsuario.id);
const reservas = ref([]);
const searchQuery = ref('');
const selectedReserva = ref(null); // Variable para la reserva seleccionada

const selectReserva = (reserva) => {
  selectedReserva.value = reserva;
};

// Función para formatear las fechas
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Cargar reservas y formatear fechas
async function getReservas() {
  try {
    const response = await useReserva.getAllReservas();

    if (useReserva.estatus === 200) {
      // Formateamos las fechas y guardamos en propiedades separadas
      reservas.value = response.map(reserva => ({
        ...reserva,
        fecha_entrada_formateada: formatDate(reserva.fecha_entrada),
        fecha_salida_formateada: formatDate(reserva.fecha_salida),
      })).reverse();
      /* console.log(reservas); */
    }
  } catch (error) {
    console.log(error);
  }
}

// Propiedad computada para filtrar reservas
const filteredReservas = computed(() => {
  const query = searchQuery.value.toLowerCase();

  return reservas.value.filter(reserva =>
    reserva.nombre_cliente.toLowerCase().includes(query) ||
    reserva.telefono_cliente.toLowerCase().includes(query) ||
    reserva.correo_cliente.toLowerCase().includes(query) ||
    reserva.fecha_entrada_formateada.toLowerCase().includes(query) ||
    reserva.fecha_salida_formateada.toLowerCase().includes(query) ||
    reserva.idHabitacion.idPiso.idHotel.nombre.toLowerCase().includes(query)
  );
});

onMounted(() => {
  getReservas();
});
</script>

<template>
  <div class="galeria">
    <div class="Hoteles">
      <h5>Administra las reservas</h5>
    </div>
    <div>
      <div>
        <div class="btn-group mt-3 mb-3 mr-5" role="group" style="display: flex; justify-content: end;">
          <input type="text" name="" id="" class="p-2" placeholder="Filtrar cualquier campo..." v-model="searchQuery"
            style="min-width: 20%;">
        </div>
      </div>

      <!-- Tabla de habitaciones -->
      <div style="font-size: 12px" class="table-responsive">
        <table class="table table-bordered">
          <thead style="align-items: center; text-align: center">
            <tr>
              <th>Nombre Cliente</th>
              <th>Telefono Cliente</th>
              <th>Correo Cliente</th>
              <th>Fecha entrada</th>
              <th>Fecha salida</th>
              <th>Hotel</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reserva, index) in filteredReservas" :key="index">
              <td>{{ reserva.nombre_cliente }}</td>
              <td>{{ reserva.telefono_cliente }}</td>
              <td>{{ reserva.correo_cliente }}</td>
              <td>{{ reserva.fecha_entrada_formateada }}</td>
              <td>{{ reserva.fecha_salida_formateada }}</td>
              <td>{{ reserva.idHabitacion.idPiso.idHotel.nombre }}</td>
              <td>
                <div class="btn-container">
                  <button style="max-height: 30px" type="button" class="btns btn btn-dark" data-bs-toggle="modal"
                    data-bs-target="#editarDHabitaciones" @click="selectReserva(reserva)">
                    <i class="material-icons">visibility</i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- espacio para el modal -->
      <div class="modal fade" id="editarDHabitaciones" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Detalles de la reserva</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedReserva">
              <div class="mb-3"><strong>Nombre Cliente:</strong> {{ selectedReserva.nombre_cliente }}</div>
              <div class="mb-3"><strong>Cédula Cliente:</strong> {{ selectedReserva.cedula_cliente }}</div>
              <div class="mb-3"><strong>Teléfono Cliente:</strong> {{ selectedReserva.telefono_cliente }}</div>
              <div class="mb-3"><strong>Correo Cliente:</strong> {{ selectedReserva.correo_cliente }}</div>
              <div class="mb-3"><strong>Fecha Entrada:</strong> {{ selectedReserva.fecha_entrada_formateada }}</div>
              <div class="mb-3"><strong>Fecha Salida:</strong> {{ selectedReserva.fecha_salida_formateada }}</div>
              <div class="mb-3"><strong>Cantidad de Noches:</strong> {{ selectedReserva.cantidad_noches }}</div>
              <div class="mb-3"><strong>Cantidad Adultos:</strong> {{ selectedReserva.cantidad_adulto }}</div>
              <div class="mb-3"><strong>Cantidad Niños:</strong> {{ selectedReserva.cantidad_nino }}</div>
              <div class="mb-3"><strong>Mensaje:</strong> {{ selectedReserva.mensaje }}</div>
              <div class="mb-3"><strong>Costo Total:</strong> {{ selectedReserva.costo_total }}</div>
              <div class="mb-3"><strong>Habitación:</strong> Número {{ selectedReserva.idHabitacion.numero_habitacion }}
              </div>
              <div class="mb-3"><strong>Tipo de Habitación:</strong> {{
                selectedReserva.idHabitacion.tipo_habitacion.join(', ') }}</div>
            </div>
            <div class="modal-footer">
              <button type="button" style="background-color: #343a40; border-style: none" class="btn btn-secondary"
                data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<style scoped>
.separator {
  width: 1px;
  height: 30px;
  background-color: #38383835;
  margin: 0 5px;
}

.modal-small .modal-dialog {
  max-width: 300px;
  margin: 0 auto;
  top: 50%;
  transform: translateY(-50%);
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
  transform: scale(1.1);
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
  gap: 5px;
}

.material-icons {
  font-size: 20px;
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
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  text-align: center;
  padding: 10px;
}

th {
  background-color: #f2f2f2;
}

.btn-container {
  display: flex;
  gap: 5px;
}

.btns {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Botones de acción dentro de la tabla */
.btns {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #343a40;
  color: white;
  border: none;
}

.custom {
  border-radius: 50%;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: none;
}

.material-icons {
  font-size: 20px;
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
