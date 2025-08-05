export class TableCell<Data> {
	constructor(
    public data: Data | null = null,
    public rowspan: number = 1,
    public colspan: number = 1
	) {}
}
