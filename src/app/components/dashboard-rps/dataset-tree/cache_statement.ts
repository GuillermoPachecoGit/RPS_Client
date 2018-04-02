export class CacheViewKey implements ICacheView {
    
    list = [];
    Add(object) {
        this.list.push(object);
    }
    Get(id) {
        return this.list.find(element => element === id);
    }
    constructor() {
        
    }
}

interface ICacheView {
    list;
    Add(object);
    Get(id);
}

class CacheView implements ICacheView {

    list = [];
    constructor() {
        
    }

    public Add(object){
        this.list.push(object);
    }

    public Get(id){
        this.list.forEach(element => {
            if(element.id === id){
                return element;
            }
        });
        return null;
    }
}

export class CacheStatementRPS {
    private  datasets : CacheView;
    private ordination : CacheView;
    private distance : CacheView;

    constructor() { 
        this.datasets = new CacheView();
        this.ordination = new CacheView();
        this.distance = new CacheView();
    }

    AddDataset(id_object,params){
        this.datasets.Add({id: id_object, data: params});
    }

    AddDistance(id_object,params){
        this.distance.Add({id: id_object, data: params});
    }

    AddOrdination(id_object,params){
        this.ordination.Add({id: id_object, data: params});
    }


    GetDataset(id){
        return this.datasets.Get(id);
    }

    GetDistance(id){
        return this.distance.Get(id);
    }

    GetOrdination(id){
        return this.ordination.Get(id);
    }

}