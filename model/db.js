const Sequelize=require('sequelize');
const db=new Sequelize('patient','root','password',{
    dialect:'sqlite',
    host:'localhost',
    port:3306,
    storage:'data.db',
    freezeTableName: true,
    operatorsAliases: false,
})

var challan=db.define('challans',{
        challan_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        veh_no:{
            type:Sequelize.STRING
        },
        user_id:{
            type:Sequelize.INTEGER   
        }
}
)
var user=db.define('users',{
    user_id:{
            type:Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        veh_no:{
            type:Sequelize.STRING
        },
        name:{
            type:Sequelize.STRING
        }
}
)
db.sync().then(()=>{console.log('DB is Synced')})
module.exports={
challan,user,db
}