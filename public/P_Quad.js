console.log('P_Quad.js loaded')


class P_Quad{
    constructor(id,x,y,receivedTime){
        this.id = id;
        this.x = x
        this.y = y
        this.newX = x
        this.newY = y
        this.receivedTime = receivedTime
    }
    update(newX,newY,receivedTime){
        if(this.receivedTime != receivedTime){
            this.x = this.newX
            this.y = this.newY
            this.newX = newX
            this.newY = newY
            this.receivedTime = receivedTime
        }
        // this.x += (x-this.x)*0.8
        // this.y += (y-this.y)*0.8
        // renderer.rect(newX,newY,[1,0,0])
    }
    render(renderer,receivedTime){
        renderer.rect(this.newX,this.newY,[1,0,0])
        renderer.rect(lerp(this.x,this.newX,receivedTime),lerp(this.y,this.newY,receivedTime),c.enemy.color)
    }
}