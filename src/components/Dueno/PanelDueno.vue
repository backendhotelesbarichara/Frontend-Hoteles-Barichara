<template>
  <!-- Inicio de scroll de hoteles y sitios -->
  <main>
    <div class="galeria">
      <div class="Hoteles"><h5>Administra tu hotel</h5></div>
      <div class="contenedor">
        <center>
          <div class="contenedor-conciertos">
            <router-link class="lg4" to="/DPanelHotel" title="DPanelHotel">
              <div class="card" style="background-color: #ffffff">
                <div class="textos" title="DPanelHotel">
                  <center><h6>Mi Hotel</h6></center>

                  <i class="material-icons">settings</i>
                </div>
              </div>
            </router-link>

            <router-link
              class="lg4"
              to="/DPanelHabitaciones"
              title="DPanelHabitaciones"
            >
              <div class="card" style="background-color: #ffffff">
                <div class="textos" title="DPanelHabitaciones">
                  <center><h6>Mis Habitaciones</h6></center>

                  <i class="material-icons">holiday_village</i>
                </div>
              </div>
            </router-link>

            <router-link
              class="lg4"
              to="/DPanelReservas"
              title="DPanelReservas"
            >
              <div class="card" style="background-color: #ffffff">
                <div class="textos" title="DPanelReservas">
                  <center><h6>Mis Reservadas</h6></center>

                  <i class="material-icons">checklist</i>
                </div>
              </div>
            </router-link>
          </div>
        </center>
      </div>
    </div>
  </main>
</template>

<script></script>

<style scoped>
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

.lg4 {
  text-decoration: none;
  color: white;
}
.material-icons {
  font-size: 5em;
  margin-top: 5%;
  /* color: teal; */
}
.contenedor {
  width: 90%;
  max-width: 1200px;
  margin: auto;
  padding: 40px 0;

  /* Flexbox */
  /* display: flex;
      gap: 20px; */

  /* Grid */
  display: grid;
  grid-template-columns: 3fr;
  gap: 20px;
}

.contenedor-conciertos {
  /* Flexbox */
  /* width: 70%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px; */

  /* Grid */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: -20px;
}

.card {
  border-radius: 10px;
  min-height: 200px;
  font-weight: bold;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background-size: cover;
  background-position: center center;

  border-color: #b7642d5b;
  border-width: 5px;
  border-style: solid;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: transform 0.2s ease-in-out;

  /* Flexbox */
  /* width: calc(33.33% - 20px); */
}

.card:hover {
  transform: scale(1.05);
}

.card .textos {
  height: 100%;
  color: #000000;

  /* Flebox */
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;

  /* Grid */
  /* display: grid;
      grid-template-rows: 1fr auto; */
}

@media screen and (max-width: 900px) {
  .contenedor-conciertos {
    /* Flexbox */
    /* width: 70%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px; */

    /* Grid */
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
}

@media screen and (max-width: 700px) {
  .contenedor-conciertos {
    /* Flexbox */
    /* width: 70%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px; */

    /* Grid */
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }
}

@media screen and (max-width: 600px) {
  .contenedor-conciertos {
    /* Flexbox */
    /* width: 70%;
      display: flex;
      flex-wrap: wrap;
      gap: 20px; */

    /* Grid */
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
  }

  .material-icons {
    font-size: 5em;
    margin-top: 10%;
    /* color: teal; */
  }
}
</style>
