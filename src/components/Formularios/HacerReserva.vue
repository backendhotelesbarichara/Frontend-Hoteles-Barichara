<template>
  <main>
    <div class="galeria">
      <div class="Hoteles"><h5>Reservar una habitación</h5></div>
      <!-- Start: Ludens - Create-Edit Form -->
      <div class="container" style="margin-top: 20px; margin-bottom: 20px">
        <form enctype="multipart/form-data" method="post">
          <div class="card shadow mb-3">
            <div class="card-header py-3">
              <p class="text-primary m-0 fw-bold">
                <span style="color: #b7642d"
                  >Rellene los campos obligatorios *</span
                >
              </p>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_nombre"
                      ><strong>Hotel *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="r_nombre"
                      placeholder="Nombre del hotel"
                      name="r_nombre"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_nombre"
                      ><strong>Nombre *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="r_nombre"
                      placeholder="Nombre de la habitación"
                      name="r_nombre"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_fecha_in"
                      ><strong>Fecha de ingreso *</strong></label
                    ><input
                      class="form-control"
                      type="date"
                      id="r_fecha_in"
                      name="rr_fecha_in"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_fecha_eg"
                      ><strong>Fecha de egreso *</strong></label
                    ><input
                      class="form-control"
                      type="date"
                      id="r_fecha_eg"
                      name="rr_fecha_eg"
                      required=""
                    />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_pnombre"
                      ><strong>Nombre de la persona *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="ir_pnombre"
                      placeholder="Nombre del reservante"
                      name="r_pnombre"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_ndoc"
                      ><strong>Documento *</strong></label
                    ><input
                      class="form-control"
                      type="number"
                      id="ir_ndoc"
                      placeholder="Número de documento"
                      name="r_ndoc"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_tel_contacto"
                      ><strong>Teléfono&nbsp;*</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="r_tel_contacto"
                      placeholder="Teléfono de contacto"
                      name="r_tel_contacto"
                      oninput="this.value = this.value.replace(/[^0-9]/g, '')"
                      pattern="[0-9]{10,}"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label" for="r_idtransferencia"
                      ><strong>ID transferencia *</strong></label
                    ><input
                      class="form-control"
                      type="text"
                      id="r_idtransferencia"
                      placeholder="Ingrese el ID de transferencia"
                      name="er_idtransferencia"
                      required=""
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4">
                  <div class="mb-3">
                    <label class="form-label"
                      ><strong>Saldo disponible:</strong></label
                    >
                    <div class="saldo">$100000</div>
                  </div>
                </div>

                <!-- Fin de el registro de reservas -->
              </div>
            </div>
          </div>
          <div class="text-end mb-3">
            <center>
              <a
                class="btn btn-outline-danger btn"
                role="button"
                href="#"
                style="margin-right: 5px"
                >Cancelar</a
              ><button
                class="btn btn-outline-dark btn"
                type="reset"
                style="margin-right: 5px"
              >
                Limpiar</button
              ><button
                class="btn btn-custom btn"
                type="submit"
                style="background: #b7642d; color: #fff"
              >
                <i class="bi bi-backpack2-fill"></i>
                Reservar
              </button>
            </center>
          </div>
        </form>
      </div>
      <!-- End: Ludens - Create-Edit Form -->
    </div>
  </main>
</template>

<script></script>

<style scoped>
.link {
  text-decoration: none !important;
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
</style>
