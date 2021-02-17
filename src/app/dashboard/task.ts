export class Task {
    constructor(
        public name: string,
        public description: string,
        public completedAt?: Date,
        public startDate?: Date,
        public endDate?: Date,
        public status?: string,
        public id?: string
    ) { }
}
