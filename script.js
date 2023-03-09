const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const posiciones = 25;
let velocidad=20;


const Direccion = {
  arriba: "arriba",
  abajo: "abajo",
  derecha: "derecha",
  izquierda: "izquierda",
  ninguna: "ninguna",
};
class Cuadrado {
  constructor(x, y, lado) {
    this.x = x;
    this.y = y;
    this.lado = lado;
  }
}
class Snake {
  constructor() {
    //this.cuerpo = [];
    this.lado = canvas.width / posiciones; //28
    this.rellenarSnake();
    this.direccion = Direccion.ninguna;
  }
  rellenarSnake() {
    this.cuerpo = [];
    this.cuerpo.push(
      new Cuadrado(
        Math.floor(posiciones / 2 + 1) * this.lado,
        Math.floor(posiciones / 2) * this.lado,
        this.lado
      )
    );
    this.cuerpo.push(
      new Cuadrado(
        Math.floor(posiciones / 2) * this.lado,
        Math.floor(posiciones / 2) * this.lado,
        this.lado
      )
    );
    this.cuerpo.push(
      new Cuadrado(
        Math.floor(posiciones / 2 - 1) * this.lado,
        Math.floor(posiciones / 2) * this.lado,
        this.lado
      )
    );
  }
  dibujar() {
    ctx.fillStyle = "blue";
    for (let i = 0; i < this.cuerpo.length; ++i) {
      ctx.fillRect(this.cuerpo[i].x, this.cuerpo[i].y, this.lado, this.lado);
    }
  }
  mover() {
    if (this.direccion != Direccion.ninguna) {
      for (let i = this.cuerpo.length - 1; i >= 1; --i) {
        this.cuerpo[i].x = this.cuerpo[i - 1].x;
        this.cuerpo[i].y = this.cuerpo[i - 1].y;
      }
    }
    switch (this.direccion) {
      case Direccion.arriba:
        if (this.cuerpo[0].y - this.lado < 0) {
          this.direccion = Direccion.ninguna;
          this.rellenarSnake();
          break;
        }
        this.cuerpo[0].y -= this.lado;

        break;
      case Direccion.abajo:
        if (this.cuerpo[0].y + this.lado >= canvas.width) {
          this.direccion = Direccion.ninguna;
          this.rellenarSnake();
          break;
        }
        this.cuerpo[0].y += this.lado;
        break;
      case Direccion.derecha:
        if (this.cuerpo[0].x + this.lado >= canvas.width) {
          this.direccion = Direccion.ninguna;
          this.rellenarSnake();
          break;
        }
        this.cuerpo[0].x += this.lado;
        break;
      case Direccion.izquierda:
        if (this.cuerpo[0].x - this.lado < 0) {
          this.direccion = Direccion.ninguna;
          this.rellenarSnake();
          break;
        }
        this.cuerpo[0].x -= this.lado;
        break;
      case Direccion.ninguna:
        //daah
        break;
    }
    for (let i = 1; i <= this.cuerpo.length - 1; ++i) {
      if (
        this.cuerpo[0].x === this.cuerpo[i].x &&
        this.cuerpo[0].y === this.cuerpo[i].y
      ) {
        this.direccion = Direccion.ninguna;
        this.rellenarSnake();
      }
    }
  }
  borrar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  verificarComida(comida, serpiente) {
    if (this.cuerpo[0].x === comida.x && this.cuerpo[0].y === comida.y) {
      const parte = this.cuerpo[this.cuerpo.length - 1];
      this.cuerpo.push(new Cuadrado(parte.x, parte.y, this.lado));
      comida.x = Math.floor(Math.random() * posiciones) * serpiente.lado;
      comida.y = Math.floor(Math.random() * posiciones) * serpiente.lado;
    }
  }
}

const serpiente = new Snake();
const comida = new Cuadrado(
  Math.floor(Math.random() * posiciones) * serpiente.lado,
  Math.floor(Math.random() * posiciones) * serpiente.lado,
  serpiente.lado
);
const dibujarComida = function () {
  ctx.fillStyle = "green";
  ctx.fillRect(comida.x, comida.y, comida.lado, comida.lado);
};

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
  if (e.code === "ArrowUp" && serpiente.direccion != Direccion.abajo) {
    serpiente.direccion = Direccion.arriba;
  }
  if (e.code === "ArrowLeft" && serpiente.direccion != Direccion.derecha) {
    serpiente.direccion = Direccion.izquierda;
  }
  if (e.code === "ArrowRight" && serpiente.direccion != Direccion.izquierda) {
    serpiente.direccion = Direccion.derecha;
  }
  if (e.code === "ArrowDown" && serpiente.direccion != Direccion.arriba) {
    serpiente.direccion = Direccion.abajo;
  }
}

function animar() {
  serpiente.borrar();
  serpiente.mover();
  serpiente.verificarComida(comida, serpiente);
  dibujarComida();
  serpiente.dibujar();
  setTimeout(animar, 1000 / velocidad);
}
animar();
