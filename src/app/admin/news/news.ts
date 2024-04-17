export class News {
	constructor (
        public id: number,
        public subject: string,
        public url: string,
        public text: string,
        public createdAt: number
	) {}
}