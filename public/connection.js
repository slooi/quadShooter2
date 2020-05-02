console.log('connection.js loaded')

function createConnection(callback){
    const ws = new WebSocket(window.location.href.replace('http','ws'))
    let playerData = []
    let playerId = null
    let enemyData = []
    let receivedTime = null

    ws.onopen = function(){
        callback()
    }
    ws.onmessage = function(message){
        // console.log(message.data)
        processData(message.data)
    }
    ws.onclose = function(){
        console.log('CONNECTION CLOSED')
        window.location.href = window.location.href
    }

    function processData(unparsedData){
        const data = JSON.parse(unparsedData)        // data is an array of objects: [{type:'playerData',data:[],type:'enemyData',data:[.....]}]
        console.log('data')
        console.log(data)
        // console.log(data)
        // console.log(data)

        receivedTime = new Date()

        for(let i=0;i<data.length;i++){
            // console.log()
            const type = data[i].type
            const actualData = data[i].data

            if(type === 'playerData'){
                playerData = actualData
                continue
            }
            if(type === 'enemyData'){
                enemyData = actualData
                continue
            }
            if(type === 'id'){
                playerId = actualData
                continue
            }
        }
    }


    return {
        getPlayerData: function(){
            return playerData
        },
        getEnemyData: function(){
            return enemyData
        },
        send: function(type,data){
            ws.send(JSON.stringify(
                {
                    type,
                    data
                }
            ))
        },
        getPlayerId: function(){
            return playerId
        },
        getReceivedTime: function(){
            return receivedTime
        }
    }
}