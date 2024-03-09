require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');


// console.log(process.env.DB_NAME)
// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const App = express();
const port = process.env.PORT || 3001;

App.use(bodyParser.urlencoded({ extended: false }));
App.use(bodyParser.json());
App.use(cors());

// Retrieve all tasks
App.get('/api/tasks', (req, res) => {
  connection.query('SELECT * FROM tasksdata', (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(results);
    }
  });
});

App.get('/user', (req, res) => {
  res.send({ message: "harsh is good " });
})

// Add a new task
App.post('/api/tasks', (req, res) => {
  console.log(req.body);

  const { title, description } = req.body;

  if (!title || !description) {
    res.status(422).json("plz fill the all data");
  }

  try {

    connection.query("INSERT INTO tasksdata SET ?", { title, description }, (err, result) => {
      if (err) {
        console.log("err" + err);
      } else {
        res.status(201).json(req.body);
      }
    })
  } catch (error) {
    res.status(422).json(error);
  }
});

// Update a task's status
App.put('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { completed } = req.body;

  try {
    connection.query("UPDATE tasksdata SET completed = ? WHERE id = ?", [completed, taskId], (err, result) => {
      if (err) {
        console.error("Error: " + err);
        return res.status(500).json({ error: 'Internal Server Error' });
      } else {
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task status updated successfully' });
      }
    });
  } catch (error) {
    console.error("Error: " + error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Delete a task
App.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM tasksdata WHERE id = ?', id, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

//get a single task detail

App.get("/api/tasks/:id",(req,res)=>{

  const {id} = req.params;

  connection.query("SELECT * FROM tasksdata WHERE id = ? ",id,(err,result)=>{
      if(err){
          res.status(422).json("error");
      }else{
          res.status(201).json(result);
      }
  })
});

// Start the server
App.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});