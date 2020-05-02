const path = require('path')
const c = require(path.join(__dirname,'../public/constants.js'))

module.exports = class Quad{
    constructor(numOfSpawnQuad){
        this.x = Math.random()*c.gameDimensions.w
        this.y = Math.random()*c.gameDimensions.h
        this.dir = 0
        this.speed = Math.random()+4;
        this.hp = 1
        this.id = numOfSpawnQuad     // change this later
        this.targetX = 0
        this.targetY = 0
    }
    update(playerList){
        if(playerList.length === 0){
            return;
        }

        // summary: moves towards closest player
        // finds closest player
        const nearestPlayer = getNearestPlayer(this,playerList)
        this.targetX = nearestPlayer.x
        this.targetY = nearestPlayer.y


        // moves towards closest player
        this.dir = Math.atan2(nearestPlayer.y-this.y,nearestPlayer.x-this.x)
        this.x += Math.cos(this.dir) * this.speed
        this.y += Math.sin(this.dir) * this.speed
        
    }
    getData(){
        return [this.id,this.x,this.y]
    }
}


function getNearestPlayer(that,playerList){
    // returns closest player
    let nearestI = 0
    for(let i=1;i<playerList.length;i++){   // skip 0th index
        if(dis2(that,playerList[i]) < dis2(that,playerList[nearestI])){
            nearestI = i
        }
    }
    return playerList[nearestI]
}

function dis2(origin,target){
    return (target.x-origin.x)**2+(target.y-origin.y)**2
}