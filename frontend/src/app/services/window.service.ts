export class RageWindow {
  private readonly id: string;
  constructor() {
    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  public minimize() {
    console.log('Minimizando ventana', this.id);
  }

  public maximize() {
    console.log('Maximizando ventana', this.id);
  }

  public close() {
    console.log('Cerrando ventana', this.id);
  }
}