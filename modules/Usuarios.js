const fs = require("fs");

class Usuarios {
  constructor(filePath) {
    this.usuarios = [];
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      this.usuarios = data
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean)
        .sort();
    } catch (error) {
      console.error("Erro ao ler usuários:", error);
    }
  }

  getTopUsuarios(n) {
    return this.usuarios.slice(0, n);
  }
}

module.exports = Usuarios;
