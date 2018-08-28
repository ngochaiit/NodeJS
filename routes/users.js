import express from 'express';
import { checkServerIdentity } from 'tls';
//Nodels
import User from '../models/User';
import Task from '../models/Task';
import {
  isEmpty, toDate, isURL, isEmail
} from 'validator';
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// Register user
router.post('/register', async(req, res) =>
{
  let{name, password, email, profileurl = "", gender,dob} = req.body;
  console.log(`profileurl = ${profileurl}`);
  //user should secure password before sending
  
  
  try {
    if(isEmpty(name) || isEmpty(password) || !isEmail(email) || 
  (profileurl !="" && !isURL(profileurl)) || isEmpty(gender) || toDate(dob) == null)
  {
    
    res.json(
      {
        result:'failed',
        data: {},
        message: `name, password, gender must not be empty. Email, profileURL, dob must be in correct format`
      }
    );
    return;
  }
    let newUser = await User.create({
     name,
     password,
     email,
     profileurl,
     gender,
     dob 
    },
  {
    fields: ["name", "password", "email","profileurl","gender","dob"]
  });

  if( newUser)
  {
    res.json({
      result: 'ok',
      data: newUser,
      message: `Insert a new User successfully`
    });
  }
  else{
    res.json(
      {
        result: 'failed',
        data: {},
        message: `insert a new User failed`
      }
    );
    
  }

  }
  catch(error)
  {
    res.json(
      {
        result: 'failed',
        data: {},
        message: `Insert a new User failed. Error: ${error}`
      }
    );

  }
});

//Login users
router.post('/login', async(req, res) =>
{
  

  try{
    let{name, email} = req.body;
  if(isEmpty(name) || !isEmail(email))
  {
    res.json({
      result: 'failed',
      data: {},
      message: `name must be empty. Email must be in correct format`
    });
    return;
  }
    let users = await User.findAll(
      {
        attributes: ["name","password", "email", "profileurl", "gender","dob"],
        where: {
          name,
          email
        }
      }
    );

    if(users.length > 0)
    {
      res.json({
        result: "ok",
        data: users[0],
        message: `login user successfully`
      });
    }
    else
    {
      res.json(
        {
          result: 'failed',
          data: {},
          message: `cannot find user, check your name and email`
        }
      )
    }
  }
  catch(error)
  {
    res.json({
      result: "failed",
      data:{},
      message:`Login user failed. Error: ${error}`
    });
  }
});

export default router;

// CREATE TABLE IF NOT EXISTS users (
//   id integer PRIMARY KEY,
//   name text NOT NULL,
//   email text,
//   profileURL text,
//   gender varchar(100),
//   dob date NOT NULL
// );