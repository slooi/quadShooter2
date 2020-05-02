module.exports = class Player{
    constructor(x,y,ws,id){
        this.x = x
        this.y = y
        this.xVel = 0
        this.yVel = 0
        this.id = id
        this.ws = ws
        this.inputs = null

        this.accel = 6
    }
    getData(){
        return [this.id,this.x,this.y]
    }
    send(typeDataArray){
        const data = []
        for(let i=0;i<typeDataArray.length;i+=2){
            data.push({
                type:typeDataArray[i],
                data:typeDataArray[i+1],
            })
        }
        this.ws.send(JSON.stringify(data))
    }
    update(){
        if(this.inputs === null){

            console.log('Inputs not yet received')
        }else{
            let delX = 0
            let delY = 0
            if(this.inputs.w){
                delY = -1
            }
            if(this.inputs.s){
                delY = 1
            }
            if(this.inputs.a){
                delX = -1
            }
            if(this.inputs.d){
                delX = 1
            }
            
            let accel = (delX !== 0 && delY !== 0) ? Math.sqrt(this.accel**2/2) : this.accel;
            this.xVel += accel*delX
            this.yVel += accel*delY
        }
        this.xVel *= 0.7
        this.yVel *= 0.7
        this.x += this.xVel
        this.y += this.yVel
        // console.log(this)
    }
}