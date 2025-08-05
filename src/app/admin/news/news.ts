export class News {
  constructor(
    public subject: string,
    public url: string,
    public text: string,
    public createdAt: number,
    public id?: number,
  ) {
  }
}
