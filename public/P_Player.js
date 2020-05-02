console.log('P_Player.js loaded')


class P_Player{
    constructor(id,x,y){
        this.id = id;
        this.x = x
        this.y = y
        this.newX = x
        this.newY = y
    }
    update(newX,newY,receivedTime){
        if(newX !== this.newX || newY !== this.newY){
            this.x = this.newX
            this.y = this.newY
            this.newX = newX
            this.newY = newY
        }
        this.renderX = lerp(this.x,this.newX,receivedTime)
        this.renderY = lerp(this.y,this.newY,receivedTime)
    }
    render(renderer){
        console.log('asd')
        renderer.rect(this.renderX,this.renderY,c.player.color)
        renderer.rect(this.newX,this.newY,[0,0,1])
    }
}