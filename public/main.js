console.log('main.js loaded')

const renderer = createRenderer()
const playerInputs = createInputHandler(renderer.canvas)
// renderer.pushData([150,150,150,300,300,150]) 
// renderer.render()
const connection = createConnection(setup)
const camera = new Camera()

let players = {}
let enemies = {}

function setup(){
    tick()
}

function tick(){
    console.log('TICK')

    setTimeout(()=>{connection.send('inputs',playerInputs)},900)
    
    receivedTime = connection.getReceivedTime()         /// SUPER IMPORTANT TO GET RECEIVEDTIME HERE. If get later on, receivedTime could have been updated => jittery
    
    playerDataToObject(connection.getPlayerData(),receivedTime)
    enemyDataToObject(connection.getEnemyData(),receivedTime)
    
    // console.log(connection.getPlayerData())
    const playerList = Object.values(players)
    const enemyList = Object.values(enemies)
    // console.log(enemyList)

    // render playerData
    for(let i=0;i<playerList.length;i++){
        playerList[i].render(renderer)
    }
    for(let i=0;i<enemyList.length;i++){
        enemyList[i].render(renderer,receivedTime)
    }

    // translate
    // const index = findIndexOfPlayer(playerData,connection)
    // console.log('players[0]',players[0])
    if(players[0])
        camera.update(renderer,players[0].renderX,players[0].renderY)

    // draw
    renderer.render()
    

    requestAnimationFrame(tick)
}

function enemyDataToObject(enemyData,receivedTime){
    for(let i=0;i<enemyData.length;i+=c.connection.enemyData.numOfData){
        const id = enemyData[i]
        const x = enemyData[i+1]
        const y = enemyData[i+2]
        if(enemies[id] === undefined){
            // object does not exist
            enemies[id] = new P_Quad(id,x,y,receivedTime)
        }else{
            // object already exists
            enemies[id].update(x,y,receivedTime)
        }
    }
}
function playerDataToObject(playerData,receivedTime){
    for(let i=0;i<playerData.length;i+=c.connection.playerData.numOfData){
        const id = playerData[i]
        const x = playerData[i+1]
        const y = playerData[i+2]
        if(players[id] === undefined){
            // object does not exist
            players[id] = new P_Player(id,x,y)
        }else{
            // object already exists
            players[id].update(x,y,receivedTime)
        }
    }
}

function findIndexOfPlayer(playerData,connection){
    for(let i=0;i<playerData.length;i+=c.connection.playerData.numOfData){
        // console.log('playerData[i]',playerData[i])
        // console.log('connection.playerId',connection.getPlayerId())
        if(playerData[i] === connection.getPlayerId()){
            return i
        }
    }
    console.warn('COULD NOT FIND PLAYER INDEX')
    return null
}


function lerp(oldVal,newVal,receivedTime){
    // if(newVal-oldVal < 1){
    //     return newVal
    // }
    const lerpedVal = oldVal+(newVal-oldVal)*((new Date()-receivedTime)/(1000/c.server.fps))
    console.log(lerpedVal)
    return lerpedVal
}
/*

// SERVER SENDS TO THE CLIENT
{
    type: index
    data: 1
},
{
    type: player
    data: [x,y,x,y]
},
{
    type: player
    data: [x,y,x,y]
}


// CLIENT SENDS TO SERVER
{
    type: inputs
    data: {
        w: 0,
        s: 0,
        a: 0,
        d: 0,
        mouseDown:0,
        dir:0,
    }
}

*/

/* 

how to know who the player is?
how to change the controls of the player

*/

/* 
FUTURE

track ALL objects (for interpolation)

if using factory functions, can't return values by object.value  have to use object.getValue() if the 
value changes in the factory function from init value

need a good way of storing enemies. In list or object

*/