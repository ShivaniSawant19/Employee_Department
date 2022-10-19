/**
 * 'DepartmentModel' is used to create instance for Department save/update and then save them to the 'localStorage'
 */

import BaseModel from "./BaseModel.js";

export default class DepartmentModel extends BaseModel {
    constructor() {
        super();
        this.dep_name = '';
    }
}