

export class AvailableEntry {
  constructor(
    public date: number,
    public court: number,
    public css: string,
    public available = true) {
  }
}
