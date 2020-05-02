//#################
// SERVER SETUP
//#################

const express = require('express')
const app = express()
const PORT = 3000
const server = app.listen(PORT,()=>{
    console.log('Listening on port: '+PORT)
})

const WebSocket = require('ws')
const wss = new WebSocket.Server({server})

const path = require('path')

//#################
// MY FILES
//#################
const c = require(path.join(__dirname,'public/constants.js'))
console.log(c)

const Player = require(path.join(__dirname,'classes/Player.js'))
// console.log('Player',Player)

const Quad = require(path.join(__dirname,'classes/Quad.js'))
console.log('Quad',Quad)

//#################
// MIDDLEWARE
//#################

app.use(express.static(path.join(__dirname,'public')))


//#################
// SYSTEM
//#################

let numOfConnects = 0

//#################
// WEBSOCKET & GAME
//#################

let players = {}
let enemyList = []
let numOfSpawnQuad = 0


wss.on('connection',ws=>{
    console.log('NEW CONNECTION!')
    enemyList.push(new Quad(numOfSpawnQuad))
    numOfSpawnQuad++

    const id = numOfConnects
    players[numOfConnects] = new Player(0,0,ws,id)
    ws.send(JSON.stringify(
        [{
            type:'id',
            data:numOfConnects
        }]
    ))
    numOfConnects++

    ws.onmessage = message =>{
        processData(id,message.data)
    }
    ws.onclose = () =>{
        delete players[id]
    }

})


function processData(id,unparsedData){
    
    // console.log('message.data',unparsedData)
    const data = JSON.parse(unparsedData)
    const type = data.type
    const actualData = data.data
    // console.log(players[id].inputs)
    if(type === 'inputs'){
        // console.log('inputs')
        players[id].inputs = actualData
    }
    if(type === 'cmd'){
        eval(actualData)
    }

}


function loop(){
    // console.log('loop')

    const playerList = Object.values(players)
    const playerData = []
    const enemyData = []

    // update player positions
    for(let i=0;i<playerList.length;i++){
        playerList[i].update()
    }

    // update enemies
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].update(playerList)
    }



}
function loop2(){
    const playerList = Object.values(players)
    const playerData = []
    const enemyData = []
    
    // collect player data
    for(let i=0;i<playerList.length;i++){
        playerData.push(...playerList[i].getData())
    }
    // collect Quad data
    for(let i=0;i<enemyList.length;i++){
        enemyData.push(...enemyList[i].getData())
    }
    // console.log(enemyData)


    // send playerData to ALL players
    console.log('SENDING')
    for(let i=0;i<playerList.length;i++){
        playerList[i].send(['playerData',playerData,'enemyData',enemyData])
    }
}
setInterval(loop,16)
setInterval(loop2,1000/c.server.fps)