const {Model} = require("objection");

class user extends Model{
    static get tableName(){
        return 'users'
    }
    static get idColumn(){
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'email', 'mobile'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                mobile: { type: 'string' }
            }
        };
    }
}

module.exports = user