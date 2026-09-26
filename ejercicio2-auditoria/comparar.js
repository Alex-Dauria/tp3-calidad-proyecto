const antes = require("./antes/pedidos.js");
const despues = require("./despues/pedidos.js");

const casos = [
  { precio: 500 }, { precio: 1500 },
];
const tipos = ["Regular", "Premium", "VIP"];
const envios = ["Nacional", "Internacional"];

let ok = 0, total = 0;
for (const producto of casos) {
  for (const tipoCliente of tipos) {
    for (const tipoEnvio of envios) {
      total++;
      const a = antes.calcularPrecioFinal(producto, tipoCliente, tipoEnvio);
      const d = despues.calcularPrecioFinal(producto, tipoCliente, tipoEnvio);
      const igual = a === d;
      if (igual) ok++;
      console.log(`  [${igual ? "OK" : "DIFERENTE"}] precio=${producto.precio} ${tipoCliente}/${tipoEnvio} -> antes=${a} despues=${d}`);
    }
  }
}
console.log(`\n${ok}/${total} casos coinciden entre antes y despues`);
