// Mini test runner (sin librerias externas). Sale con codigo 1 si algun test falla,
// para que el pre-commit hook pueda detectarlo.
const { evaluarDescuento } = require("./src/descuentos");

let total = 0;
let ok = 0;

function test(nombre, fn) {
  total++;
  try {
    fn();
    ok++;
    console.log(`  [PASS] ${nombre}`);
  } catch (err) {
    console.log(`  [FAIL] ${nombre}`);
    console.log(`         ${err.message}`);
  }
}

function assertEqual(actual, esperado, mensaje) {
  if (actual !== esperado) {
    throw new Error(`${mensaje} -> esperado: ${esperado}, obtenido: ${actual}`);
  }
}

test("50 puntos es Bronce", () => {
  assertEqual(evaluarDescuento(50), "Bronce", "deberia ser Bronce");
});

test("200 puntos es Plata", () => {
  assertEqual(evaluarDescuento(200), "Plata", "deberia ser Plata");
});

test("1000 puntos es Oro (bug introducido a proposito)", () => {
  assertEqual(evaluarDescuento(1000), "Oro", "deberia ser Oro");
});

console.log(`\nRESULTADO: ${ok}/${total} tests pasaron`);
process.exit(ok === total ? 0 : 1);
