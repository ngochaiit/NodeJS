import Sequelize from 'sequelize';
export const sequelize = new Sequelize(
    'postgres',//db name
    'postgres',//user name
    '123',
    {
        dialect: 'postgres',
        host: 'localhost',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            require: 3000,
            idle: 1000
        }
    }
);
export const Op = Sequelize.Op;
