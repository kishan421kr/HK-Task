exports.up = function(knex) { 
    return knex.schema.createTable("tasks", function(table) { 
        table.increments("id").primary(); 
        table.integer("employee_id").notNullable(); 
        table.string("task_name").notNullable(); 
        table.string("task_type").notNullable(); 
        table.foreign("employee_id").references("id").inTable("users"); 
    }); 
}; 

exports.down = function(knex) { 
    return knex.schema.dropTable("tasks"); 
};

