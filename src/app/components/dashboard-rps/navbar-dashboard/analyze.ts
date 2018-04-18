export class Analyze {
    constructor(
        public project_selected: string,
        public dataset_selected: string,
        public dataset_name: string,
        public algorithm_selected: boolean,
        public show_consensus_selected: boolean,
        public user_id: string,
        public isAnalyze: boolean
      ) {  }
}
