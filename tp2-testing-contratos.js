"use strict";
// ============================================================================
// TRABAJO PRACTICO SEMANA 2 - TESTING PRACTICO Y CONTRATOS
// Patron AAA, Dobles de prueba (Stub vs Mock) y analisis de Branch Coverage
// Metodologia de Sistemas II
// ============================================================================
// ----------------------------------------------------------------------------
// Mini framework de testing (sin librerias externas) - imprime PASS/FAIL
// ----------------------------------------------------------------------------
let totalTests = 0;
let testsOk = 0;
function test(nombre, fn) {
    totalTests++;
    try {
        fn();
        testsOk++;
        console.log(`  [PASS] ${nombre}`);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.log(`  [FAIL] ${nombre}`);
        console.log(`         ${msg}`);
    }
}
function assertEqual(actual, esperado, mensaje) {
    if (actual !== esperado) {
        throw new Error(`${mensaje} -> esperado: ${esperado}, obtenido: ${actual}`);
    }
}
// ============================================================================
// EJERCICIO 1 - Patron AAA (Arrange, Act, Assert)
// ============================================================================
// Funcion bajo prueba: clasifica a un cliente en una categoria de fidelidad
// segun sus puntos acumulados. Es la misma funcion que se reutiliza en el
// Ejercicio 3 para el analisis de cobertura de ramas.
// ----------------------------------------------------------------------------
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
console.log("=".repeat(72));
console.log("EJERCICIO 1 - Suite de pruebas unitarias (patron AAA)");
console.log("=".repeat(72));
test("cliente con pocos puntos queda en categoria Bronce", () => {
    // Arrange - preparamos el dato de entrada
    const puntosDelCliente = 50;
    // Act - ejecutamos la funcion bajo prueba
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert - verificamos el resultado esperado
    assertEqual(categoria, "Bronce", "La categoria deberia ser Bronce");
});
test("limite exacto de 100 puntos todavia es Bronce (caso limite)", () => {
    // Arrange
    const puntosDelCliente = 100;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Bronce", "100 puntos exactos no supera el umbral (> 100)");
});
test("101 puntos ya asciende a categoria Plata", () => {
    // Arrange
    const puntosDelCliente = 101;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Plata", "Deberia superar el primer umbral");
});
test("cliente con puntos intermedios queda en categoria Plata", () => {
    // Arrange
    const puntosDelCliente = 200;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Plata", "Deberia quedar en Plata");
});
test("limite exacto de 500 puntos todavia es Plata (caso limite)", () => {
    // Arrange
    const puntosDelCliente = 500;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Plata", "500 puntos exactos no supera el segundo umbral (> 500)");
});
test("501 puntos ya asciende a categoria Oro", () => {
    // Arrange
    const puntosDelCliente = 501;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Oro", "Deberia superar el segundo umbral");
});
test("cliente con muchos puntos queda en categoria Oro", () => {
    // Arrange
    const puntosDelCliente = 1000;
    // Act
    const categoria = evaluarDescuento(puntosDelCliente);
    // Assert
    assertEqual(categoria, "Oro", "Deberia quedar en Oro");
});
class OrderService {
    constructor(gateway) {
        this.gateway = gateway;
    }
    procesarPago(montoEnCentavos, tokenTarjeta) {
        const resultado = this.gateway.charge(montoEnCentavos, tokenTarjeta);
        return resultado.aprobado ? "PEDIDO_CONFIRMADO" : "PEDIDO_RECHAZADO";
    }
}
// --- STUB -------------------------------------------------------------------
// Solo le inyecta una respuesta fija a OrderService. No le importa como ni
// cuantas veces lo llamaron: es verificacion de ESTADO (el resultado).
class StubPaymentGateway {
    constructor(respuestaFija) {
        this.respuestaFija = respuestaFija;
    }
    charge(_montoEnCentavos, _tokenTarjeta) {
        return this.respuestaFija;
    }
}
console.log("\n" + "=".repeat(72));
console.log("EJERCICIO 2 - Stub: verificacion de estado (resultado)");
console.log("=".repeat(72));
test("con Stub que aprueba, el pedido queda confirmado", () => {
    // Arrange
    const stub = new StubPaymentGateway({ aprobado: true, idTransaccion: "tx-001" });
    const service = new OrderService(stub);
    // Act
    const estado = service.procesarPago(150000, "tok_visa");
    // Assert
    assertEqual(estado, "PEDIDO_CONFIRMADO", "Con aprobado=true el pedido debe confirmarse");
});
test("con Stub que rechaza, el pedido queda rechazado", () => {
    // Arrange
    const stub = new StubPaymentGateway({ aprobado: false, idTransaccion: "tx-002" });
    const service = new OrderService(stub);
    // Act
    const estado = service.procesarPago(150000, "tok_visa");
    // Assert
    assertEqual(estado, "PEDIDO_RECHAZADO", "Con aprobado=false el pedido debe rechazarse");
});
// --- MOCK ---------------------------------------------------------------
// Ademas de devolver una respuesta, registra CADA llamada (monto, token,
// cantidad de veces). Permite auditar el PROTOCOLO de interaccion: es
// verificacion de COMPORTAMIENTO, no de resultado.
class MockPaymentGateway {
    constructor() {
        this.llamadas = [];
    }
    charge(montoEnCentavos, tokenTarjeta) {
        this.llamadas.push({ monto: montoEnCentavos, token: tokenTarjeta });
        return { aprobado: true, idTransaccion: "tx-mock" };
    }
}
console.log("\n" + "=".repeat(72));
console.log("EJERCICIO 2 - Mock: verificacion de comportamiento (auditoria)");
console.log("=".repeat(72));
test("el Mock confirma que se llamo a charge() exactamente una vez", () => {
    // Arrange
    const mock = new MockPaymentGateway();
    const service = new OrderService(mock);
    // Act
    service.procesarPago(250000, "tok_master");
    // Assert
    assertEqual(mock.llamadas.length, 1, "charge() deberia haberse llamado una unica vez");
});
test("el Mock confirma que charge() se llamo con el monto y token correctos", () => {
    // Arrange
    const mock = new MockPaymentGateway();
    const service = new OrderService(mock);
    // Act
    service.procesarPago(250000, "tok_master");
    // Assert
    assertEqual(mock.llamadas[0].monto, 250000, "El monto enviado al gateway debe ser exacto");
    assertEqual(mock.llamadas[0].token, "tok_master", "El token enviado al gateway debe ser exacto");
});
// ============================================================================
// EJERCICIO 3 - Analisis de cobertura de ramas (Branch Coverage)
// ============================================================================
// Se reutiliza evaluarDescuento() del Ejercicio 1. El analisis completo
// (statement vs branch coverage, tabla de ramas y justificacion) esta en el
// documento Word. Aca queda la evidencia de que los 3 casos limite necesarios
// para el 100% de cobertura de ramas ya estaban cubiertos por la suite del
// Ejercicio 1: puntos=50 (F,F), puntos=200 (T,F), puntos=1000 (T,T).
// ----------------------------------------------------------------------------
console.log("\n" + "=".repeat(72));
console.log("EJERCICIO 3 - Casos necesarios para 100% de cobertura de ramas");
console.log("=".repeat(72));
test("rama (F,F): puntos=50 no supera ningun umbral -> Bronce", () => {
    // Arrange
    const puntos = 50;
    // Act
    const categoria = evaluarDescuento(puntos);
    // Assert
    assertEqual(categoria, "Bronce", "Ambas condiciones deben evaluar false");
});
test("rama (T,F): puntos=200 supera el primer umbral pero no el segundo -> Plata", () => {
    // Arrange
    const puntos = 200;
    // Act
    const categoria = evaluarDescuento(puntos);
    // Assert
    assertEqual(categoria, "Plata", "Solo la primera condicion debe evaluar true");
});
test("rama (T,T): puntos=1000 supera ambos umbrales -> Oro", () => {
    // Arrange
    const puntos = 1000;
    // Act
    const categoria = evaluarDescuento(puntos);
    // Assert
    assertEqual(categoria, "Oro", "Ambas condiciones deben evaluar true");
});
// ----------------------------------------------------------------------------
// Resumen final
// ----------------------------------------------------------------------------
console.log("\n" + "=".repeat(72));
console.log(`RESULTADO FINAL: ${testsOk}/${totalTests} tests pasaron`);
console.log("=".repeat(72));
