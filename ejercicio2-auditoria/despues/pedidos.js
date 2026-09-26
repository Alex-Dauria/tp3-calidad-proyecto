// ============================================================================
// CODIGO "DESPUES" - refactorizado a partir del diagnostico de auditoria estatica.
// Fix 1: se extraen validarProducto/validarCliente -> elimina la duplicacion exacta.
// Fix 2: calcularPrecioFinal pasa a una tabla de reglas (lookup) -> baja la
// complejidad ciclomatica de 14 a 2, sin cambiar el resultado para ningun caso.
// ============================================================================

function validarProducto(producto) {
  if (!producto || typeof producto.precio !== "number" || producto.precio <= 0) {
    throw new Error("Producto invalido");
  }
}

function validarCliente(cliente) {
  if (!cliente || typeof cliente.nombre !== "string" || cliente.nombre.length === 0) {
    throw new Error("Cliente invalido");
  }
}

function crearPedido(producto, cliente) {
  validarProducto(producto);
  validarCliente(cliente);

  return { producto: producto, cliente: cliente, estado: "creado" };
}

function actualizarPedido(pedido, producto, cliente) {
  validarProducto(producto);
  validarCliente(cliente);

  pedido.producto = producto;
  pedido.cliente = cliente;
  return pedido;
}

// Tabla de reglas: reemplaza los if/else anidados por un lookup.
// Agregar un tipo de cliente o de envio nuevo ya no toca calcularPrecioFinal,
// solo agrega una entrada a esta tabla (mismo espiritu que Factory Method).
const REGLAS_PRECIO = {
  "Regular-Nacional": (precio) => (precio > 1000 ? precio * 0.95 + 500 : precio + 800),
  "Regular-Internacional": (precio) =>
    precio > 1000 ? precio * 0.95 + 2500 : precio + 3000,
  "Premium-Nacional": (precio) => (precio > 1000 ? precio * 0.9 + 300 : precio + 500),
  "Premium-Internacional": (precio) =>
    precio > 1000 ? precio * 0.9 + 1800 : precio + 2200,
  "VIP-Nacional": (precio) => precio * 0.85,
  "VIP-Internacional": (precio) => precio * 0.85 + 1000,
};

function calcularPrecioFinal(producto, tipoCliente, tipoEnvio) {
  const clave = `${tipoCliente}-${tipoEnvio}`;
  const regla = REGLAS_PRECIO[clave];

  if (!regla) {
    throw new Error(`No existe una regla de precio para ${clave}`);
  }

  return regla(producto.precio);
}

module.exports = { crearPedido, actualizarPedido, calcularPrecioFinal };
