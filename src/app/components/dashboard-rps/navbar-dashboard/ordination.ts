export class Ordination {
    constructor(
        public algorithm_selected : boolean,
        public dataset_id: string,
        public project_id: string,
        public distance_id: string,
        public ordination_name: string,
        public isOrdination: boolean,
        public user_id: string
    ){ }
}
