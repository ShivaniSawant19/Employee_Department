/**
 * 'EmployeeModel' is used to create instance for Employee save/update and then save them to the 'localStorage'
 */
import BaseModel from "./BaseModel.js";

export default class EmployeeModel extends BaseModel {
    constructor() {
        super();
        this.name = '';
        this.age = 0;
    }
}