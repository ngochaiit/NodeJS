import express from "express";
const router = express.Router();
//Models
import Todo from '../models/Todo';
import Task from '../models/Task';
import {isNumeric,isEmpty, isBoolean, isInt, toDate } from 'validator';
//Insert Post
router.post('/', async (req, res) =>
{
    // create a new Todo here
    //but you have to connect database && define the model
    let {name, priority, description, due} = req.body;
    //How can I validate input params?
    if(isEmpty(name) || !isInt(priority, {min:0, max:2}) || toDate(due) === null)
    {
        res.json({
            result: 'failed',
            data: {},
            message: `name must not be empty, priority = 0..2 dueDate must be yyyy-mm-dd`
        });
        return;
    }
    try 
    {
        let newTodo = await Todo.create(
            {
                name,
                priority: parseInt(priority),
                description,
                due
            },
            {
                fields: ["name", "priority", "description", "due"]
            }
        );
        if(newTodo)
        {
            res.json({
                result: 'ok',
                data : newTodo
            });
        }
        else{
            res.json({
                result: 'failed',
                data: {},
                message: `Insert a new Todo failed`
            });
        }

    }
    catch(error){
        res.json(
            {
                result: 'failed',
                data: {},
                message: `Insert a new Todo failed. Error: ${error}`
            }
        )

    }
});

//Update data in DB
router.put('/:id', async(req, res) =>
{
    //when update id,  we tranfers ID via string on request by .params
    const{id} = req.params;
    const{name, priority , description, due} = req.body;
    if(!isNumeric(id))
    {
        res.json(
            {
                result: 'failed',
                data:{},
                message: `id must be a number`
            }
        );
        return
    }
    try
    {
        let todos = await Todo.findAll({
            attributes: ['id', 'name', 'priority', 'description', 'due'],
            where: {
                id: id
            }
        });

        if(todos.length >0)
        {
            todos.forEach( async (todo) => {
                await todo.update({
                    name: name ? name : todo.name,
                    priority: priority? priority : todo.priority,
                    description: description? description : todo.description,
                    due : due ? due :todo.due


                });
            });
            res.json(
                {
                    result: 'ok',
                    data: todos,
                    message: "Update a Todo successfully"
                }
            );
        }
        else{
            res.json(
                {
                    result: 'fail',
                    data: {},
                    message: "Cannot find Todo to update"
                }
            );
        }
        
    }
    catch(error){
        res.json({
            result: 'failed',
            data: {},
            message: `can not update a Todo. Error: ${error}`
        });

    }

});

//Delete a doto
router.delete('/:id', async (req, res) =>
{
    const {id} = req.params;
    if(!isNumeric(id))
    {
        res.json(
            {
                result: 'failed',
                data:{},
                message: `id must be a number`
            }
        );
        return
    }
    try{
        await Task.destroy({
            where: {
                todoid: id
            }

        });
    
    let numberOfDeteledRows = await Todo.destroy(
        {
            where: {
                id
            }
        }
    );

    res.json({
        result: 'ok',
        message: 'Delete a Todo successfully',
        count: numberOfDeteledRows
    });
    }
    catch(error){
        res.json(
            {
        result: 'failed',
        data: {},
        message: `delete a Todo failed. Error: ${error}`
        

         }
        );

    }
});

//query data from db
router.get('/', async (req, res) => {
    if(isEmpty(name) || !isInt(priority, {min:0, max:2}) || toDate(due) === null)
    {
        res.json({
            result: 'failed',
            data: {},
            message: `name must not be empty, priority = 0..2 dueDate must be yyyy-mm-dd`
        });
        return;
    }
   
    try
    {
        const todos = await Todo.findAll(
            {
                attributes: ['id','name', 'priority', 'description', 'due'],
            }
        );
        res.json(
            {
                result: 'ok',
                data: todos,
                length: todos.length,
                message: "query list of Todos sucessfully",
            }
        );

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

//Get by Id?
router.get('/:id', async (req, res) =>
{
    const {id} = req.params;
    if(!isNumeric(id))
    {
        res.json(
            {
                result: 'failed',
                data:{},
                message: `id must be a number`
            }
        );
        return
    }
    try{
        let todos = await Todo.findAll(
            {
                attributes: ['name', 'priority', 'description','due'],
                where: {
                    id: id
                },
                include: {
                    model: Task,
                    as: 'tasks',
                    required: false
                }
            }
        );
    if(todos.length > 0)
    {
        res.json(
            {
                result: 'ok',
                data: todos[0],
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
