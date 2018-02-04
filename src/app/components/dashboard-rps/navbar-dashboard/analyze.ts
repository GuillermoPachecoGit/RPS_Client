export class Analyze {
    constructor(
        public project_selected: string,
        public dataset_selected: string,
        public tab_name_analysis: string,
        public algorithm_selected: boolean,
        public show_consensus_selected: boolean
      ) {  }
}
