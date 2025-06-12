const express = require("express");
const app = express();

const handlebars = require("express-handlebars");


const db = require('./db');
require("dotenv").config();

db.raw('SELECT 1')
  .then(() => {
    console.log('Database connected successfully!');
  })
  .catch((err) => { console.error("Database connection failed:", err); });

const user = require("./Models/emp");
const task = require("./Models/task");

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.engine('handlebars' , handlebars.engine({
    layoutsDir:`${__dirname}/views/layouts`
}));
app.set('view engine','handlebars')

app.get("/",(req, res)=>{
    res.render("home",{layout:"main"})
});

app.get("/addTask",(req,res)=>{
    res.render("addTask")
});

app.get("/addEmp",(req,res)=>{
    res.render("addEmp")
})

app.get("/api/getEmployees", async(req,res)=>{
    try {
        const employees = await user.query().select('id', 'name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch employees"});
    }
});

app.post("/api/AddEmployee",async(req,res)=>{
    const {nameInput,emailInput,mobileInput}=req.body;
    
    try {
        console.log(req.body,"req.body");
        const existingUser = await user.query().where('email', emailInput).first();
        if (existingUser) {
            return res.status(409).send("Email already exists");
        }
        const data = await user.query().insert({name:nameInput,email:emailInput,mobile:mobileInput});
        console.log(data);
        
        res.send("Employee added successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding employee");
    }
});

app.post("/api/AddTask",async(req,res)=>{
    const {employeeId, taskName, taskType}=req.body;
    
    try {
        console.log(req.body,"req.body");
        const data = await task.query().insert({userId:employeeId, taskName:taskName, taskType:taskType});
        console.log(data);
        
        res.send("Task added successfully")
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding task");
    }
});


app.get('/export', async (req, res) => {
  try {
    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    
    const usersSheet = workbook.addWorksheet('Users');
    usersSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Mobile', key: 'mobile', width: 15 }
    ];
    
    const users = await user.query();
    usersSheet.addRows(users); 
    
    const tasksSheet = workbook.addWorksheet('Tasks');
    tasksSheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'User ID', key: 'userid', width: 15 }, 
      { header: 'Task Name', key: 'taskName', width: 40 }, 
      { header: 'Task Type', key: 'taskType', width: 20 }  
    ];
    
    const tasks = await task.query();
    
    
    const mappedTasks = tasks.map(task => ({
        id: task.id,
        userid: task.userId, 
        taskName: task.taskName, 
        taskType: task.taskType  
    }));

    tasksSheet.addRows(mappedTasks); 
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users_and_tasks.xlsx');
    
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Error exporting data');
  }
});

const port = process.env.PORT;

app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`)
})

