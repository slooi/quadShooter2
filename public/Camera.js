console.log('Camera.js loaded')

class Camera{
    constructor(){
        this.x = 0
        this.y = 0
        this.drag = 0.8
    }
    update(renderer,playerX,playerY){
        if(playerX === undefined){
            return
        }
        const offset = {
            x:-c.gameDimensions.w/2+c.player.w/2,
            y:-c.gameDimensions.h/2+c.player.w/2
        }
        this.x = playerX+offset.x//(playerX-this.x)*this.drag
        this.y = playerY+offset.y//(playerY-this.y)*this.drag
        renderer.translate(-this.x,-this.y)
    }
}