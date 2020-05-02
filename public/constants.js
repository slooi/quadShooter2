console.log('constants.js loaded')

const c = {
    player:{
        w:20,
        color: [0.3,0.9,0.8] 
    },
    enemy:{
        color: [0.9,0.3,0.4] 
    },
    connection:{
        playerData:{
            numOfData: 3
        },
        enemyData:{
            numOfData: 3
        }
    },
    gameDimensions:{
        w: 900,
        h: 900
    },
    draw:{
        line:{
            thick:4
        }
    },
    server:{
        fps:10
    }
}



if(typeof module !== "undefined"){
    module.exports = c
}