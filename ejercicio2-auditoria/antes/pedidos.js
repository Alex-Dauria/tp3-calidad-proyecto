// ============================================================================
// CODIGO "ANTES" - a proposito de baja calidad, para la auditoria estatica.
// Problema 1: duplicacion exacta del bloque de validacion (copy-paste).
// Problema 2: alta complejidad ciclomatica en calcularPrecioFinal.
// ============================================================================

function crearPedido(producto, cliente) {
  if (!producto || typeof producto.precio !== "number" || producto.precio <= 0) {
    throw new Error("Producto invalido");
  }
  if (!cliente || typeof cliente.nombre !== "string" || cliente.nombre.length === 0) {
    throw new Error("Cliente invalido");
  }

  return { producto: producto, cliente: cliente, estado: "creado" };
}

function actualizarPedido(pedido, producto, cliente) {
  if (!producto || typeof producto.precio !== "number" || producto.precio <= 0) {
    throw new Error("Producto invalido");
  }
  if (!cliente || typeof cliente.nombre !== "string" || cliente.nombre.length === 0) {
    throw new Error("Cliente invalido");
  }

  pedido.producto = producto;
  pedido.cliente = cliente;
  return pedido;
}

function calcularPrecioFinal(producto, tipoCliente, tipoEnvio) {
  let precio = producto.precio;

  if (tipoCliente === "Regular") {
    if (tipoEnvio === "Nacional") {
      if (precio > 1000) {
        precio = precio * 0.95;
        precio = precio + 500;
      } else {
        precio = precio + 800;
      }
    } else if (tipoEnvio === "Internacional") {
      if (precio > 1000) {
        precio = precio * 0.95;
        precio = precio + 2500;
      } else {
        precio = precio + 3000;
      }
    }
  } else if (tipoCliente === "Premium") {
    if (tipoEnvio === "Nacional") {
      if (precio > 1000) {
        precio = precio * 0.9;
        precio = precio + 300;
      } else {
        precio = precio + 500;
      }
    } else if (tipoEnvio === "Internacional") {
      if (precio > 1000) {
        precio = precio * 0.9;
        precio = precio + 1800;
      } else {
        precio = precio + 2200;
      }
    }
  } else if (tipoCliente === "VIP") {
    if (tipoEnvio === "Nacional") {
      precio = precio * 0.85;
    } else if (tipoEnvio === "Internacional") {
      precio = precio * 0.85;
      precio = precio + 1000;
    }
  }

  return precio;
}

module.exports = { crearPedido, actualizarPedido, calcularPrecioFinal };
