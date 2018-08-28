import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from  './routes/index';
import usersRouter from  './routes/users';
import todosRouter from  './routes/todos';
import taksRouter  from  './routes/tasks';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todos', todosRouter);
app.use('/tasks', taksRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;

//  CREATE TABLE tasks(
//    id integer PRIMARY KEY,
//    todoId integer REFERENCES todos(id),
//    name text NOT NULL,
//    isFinished  boolean
//  );

// CREATE TABLE IF NOT EXISTS weather (
//   id integer PRIMARY KEY,
//   city            varchar(80),
//   temp_lo         int,           -- low temperature
//   temp_hi         int,           -- high temperature
//   prcp            real,          -- precipitation
//   date            date
// );
/**
 * 
create sequence task_id_seq;
alter table tasks alter id set default nextval('task_id_seq');
Select setval('task_id_seq', 5 ); --set to the highest current value of playerID
2000052 
*/