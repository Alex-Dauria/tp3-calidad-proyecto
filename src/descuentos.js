// Funcion de negocio: clasifica un cliente segun sus puntos acumulados.
function evaluarDescuento(puntos) {
  let categoria = "Bronce";

  if (puntos > 100) {
    categoria = "Plata";
  }
  if (puntos > 500) {
    categoria = "Oro";
  }

  return categoria;
}

module.exports = { evaluarDescuento };
