import Sequelize from 'sequelize';
import {sequelize} from '../databases/database';
//const Op = require('../databases/database').Op;
import Task from './Task';



const Todo = sequelize.define('todo',
{
    id: 
    {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name:
    {
        type: Sequelize.STRING,
    },
    priority:
    {
        type: Sequelize.TINYINT,
    },
    description:
    {
        type: Sequelize.TEXT,
    },
    due: {
        type: Sequelize.DATE
    }
    
},{
    timestamps: false,
})


Todo.hasMany(Task, {foreignKey: 'todoid', sourceKey: 'id'});
Task.belongsTo( Todo, {foreignKey: 'todoid', targetKey: 'id'});
export default Todo;