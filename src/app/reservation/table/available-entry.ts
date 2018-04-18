

export class AvailableEntry {
  constructor(
    public date: Date,
    public court: number,
    public css: string,
    public available = true) {
  }
}
