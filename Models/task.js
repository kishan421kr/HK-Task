const {Model} = require("objection");

class task extends Model{
    static get tableName(){
        return 'tasks'
    }
    static get idColumn(){
        return 'id'
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['userId', 'taskName', 'taskType'],
            properties: {
                id: { type: 'integer' },
                userId: { type: 'string' },
                taskName: { type: 'string' },
                taskType: { type: 'string' }
            }
        };
    }
    static get relationMappings() {
        const User = require('./emp');
        return {
            
            user: {
                relation: Model.BelongsToOneRelation, 
                modelClass: User, 
                join: {
                    from: 'tasks.userId', 
                    to: 'users.id'     
                }
            }
        };
    }
}

module.exports = task

