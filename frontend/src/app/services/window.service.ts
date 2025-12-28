export class Window {
  private readonly id: string;
  constructor() {
    this.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}