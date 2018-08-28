import express from "express";
const router = express.Router();
//Models
import Todo from '../models/Todo';
import Task from '../models/Task';
import {isNumeric, isEmpty, isBoolean} from 'validator';
//Insert
router.post('/', async (req, res) =>
{
    // create a new Todo here
    //but you have to connect database && define the model
    let {todoid, name, isfinished} = req.body;// lay ra tu body

    if(!isNumeric(todoid) || isEmpty(name) || !isBoolean(isfinished))
    {
        res.json({
            result: 'failed',
            data:{},
            message: 'todo id must be a number, name must not be empty, is finished must be boolean'
        });
        return;
    }
    try 
    {
        let newTask = await Task.create(
            {
                todoid,
                name,
                isfinished
            },
            {
                fields: ["todoid", "name","isfinished"]
            }
        );
        if(newTask)
        {
            res.json({
                result: 'ok',
                data : newTask
            });
        }
        else{
            res.json({
                result: 'failed',
                data: {},
                message: `Insert a new Tasks failed`
            });
        }

    }
    catch(error){
        res.json(
            {
                result: 'failed',
                data: {},
                message: `Insert a new Task failed. Error: ${error}`
            }
        )

    }
});

//update database in DB
router.put('/:id', async(req, res) =>
{
    //when update id,  we tranfers ID via string on request by .params
    const{id} = req.params;
    const{todoid, name, isfinished} = req.body;
    if(!isNumeric(id))
    {
        res.json({
            result: "failed",
            data: {},
            message: `id must be a number`
        })
        return;
    }
    try
    {
        let tasks = await Task.findAll({
            attributes: ['id','todoid','name','isfinished'],
            where: {
                id: id
            }
        });

        if(tasks.length >0)
        {
            tasks.forEach( async (task) => {
                await task.update({
                    todoid: todoid ? todoid :task.todoid,
                    name: name ? name : task.name,
                    isfinished: isfinished ? isfinished : task.isfinished
    


                });
            });
            res.json(
                {
                    result: 'ok',
                    data: tasks,
                    message: "Update a Task successfully"
                }
            );
        }
        else{
            res.json(
                {
                    result: 'fail',
                    data: {},
                    message: "Cannot find Task to update"
                }
            );
        }
        
    }
    catch(error){
        res.json({
            result: 'failed',
            data: {},
            message: `can not update a Task. Error: ${error}`
        });

    }

});
//delete a task
router.delete('/:id', async (req, res) =>
{
    let{id} = req.params;
    if(!isNumeric(id))
    {
        res.json(
            {
                result: 'failed',
                data: {},
                message: `id must be a number`
            }
        )
    }
    try{
        let numberOfDeleteRows = await Task.destroy(
            {
                where: {
                    id: id
                }
            }
        );
        res.json(
            {
                result: 'ok',
                message: 'Delete a task successflly',
                count: numberOfDeleteRows
            }
        );
    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                data: {},
                message: `delete a task failed. Error: ${error}`
            }
        )
    }
})

//query data from db
router.get('/', async (req, res) =>
{
    
  try
  {
      const tasks = await Task.findAll(
          {
              attributes: ['id', 'todoid','name','isfinished']
          }
      );
      res.json(
          {
              result: 'ok',
              data: tasks,
              length: tasks.length,
              message: "query list of Tasks sucessfully"
          }
      );
    
  }
  catch(error)
  {
    res.json(
        {
            result: 'failed',
            data: [],
            message: `query list of Todo failed. Error: ${error}`
        }
    )
  }

})

//get By id

router.get('/:id', async (req, res) =>
{
    const {id} = req.params;
    if(!isNumeric(id))
    {
        res.json(
            {
                result: 'failed',
                data:{},
                message: `todoid must be a number`
            }
        );
        return;
    }
    try{
        let tasks = await Task.findAll(
            {
                attributes: ['id', 'todoid', 'name','isfinished'],
                where: {
                    id: id
                },
            }
        );
    if(tasks.length > 0)
    {
        res.json(
            {
                result: 'ok',
                data: tasks[0],
                message: "query list of Todos successfully"
            }
        );
    }
    else{
        res.json(
            {
                result: 'failed',
                data: {},
                message: "Cannot find Todo to show"
                

            }
        );
    }

    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                data: [],
                message: `query list of Todos failed. Error: ${error}`
            }
        );

    }
});

//get by todoid
router.get('/todoid/:todoid', async (req, res) =>
{
    if(!isNumeric(todoid))
    {
        res.json(
            {
                result: 'failed',
                data:{},
                message: `todoid must be a number`
            }
        );
        return;
    }
    const {todoid} = req.params;
    try{
        let tasks = await Task.findAll(
            {
                attributes: ['id', 'todoid', 'name','isfinished'],
                where: {
                    todoid: totoid
                },
            }
        );
    if(tasks.length > 0)
    {
        res.json(
            {
                result: 'ok',
                data: tasks,
                message: "query list of Todos successfully"
            }
        );
    }
    else{
        res.json(
            {
                result: 'failed',
                data: {},
                message: "Cannot find Todo to show"
                

            }
        );
    }

    }
    catch(error)
    {
        res.json(
            {
                result: 'failed',
                data: [],
                message: `query list of Todos failed. Error: ${error}`
            }
        );

    }
});

export default router;