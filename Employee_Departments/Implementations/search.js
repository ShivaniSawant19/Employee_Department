export default class Search {
    constructor(key) {
        this.collection = JSON.parse(localStorage.getItem(key));
    }
    search(keyword) {
        let result = [];
        this.collection.forEach(element => {
            if(JSON.stringify(Object.values(element)).toLowerCase().includes(keyword)) {
                result.push(element);
            }
        });
        return result;
    }
}