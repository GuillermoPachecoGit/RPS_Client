export class Analyze {
    constructor(
        public project_selected: string,
        public dataset_selected: string,
        public dataset_name: string,
        public algorithm_selected: string,
        public show_consensus_selected: boolean,
        public user_id: string,
        public isAnalyze: boolean,
        public excluided_specimen: string[],
        public excluided_landmark: string[],
        public iterations: string,
        public tolerance: string,
        public node_tree: string
      ) {  }
}
