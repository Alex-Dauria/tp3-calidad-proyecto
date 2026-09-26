// Configuracion plana de ESLint (v9+). Reglas minimas para el pre-commit hook.
module.exports = [
  {
    // El hook de pre-commit protege el codigo del proyecto principal (src/ + tests).
    // ejercicio2-auditoria se audita aparte con sus propios comandos porque su
    // codigo "antes" es de mala calidad a proposito. tp2-testing-contratos.js es
    // evidencia de otra semana que se reutiliza tal cual para medir cobertura.
    ignores: ["ejercicio2-auditoria/**", "tp2-testing-contratos.js"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error",
      eqeqeq: "error",
      complexity: ["error", 6],
    },
  },
];
