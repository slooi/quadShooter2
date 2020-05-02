console.log('inputHandler.js loaded')


const createInputHandler = function(canvas){
    const inputs = {
        w: 0,
        s: 0,
        a: 0,
        d: 0,
        mouseDown:0,
        dir:0,
    }

    window.addEventListener('keydown',e=>{
        processKey(e,1)
    })
    window.addEventListener('keyup',e=>{
        processKey(e,0)
    })
    window.addEventListener('mousedown',e=>{
        processMousePosition(e)
        processMouseDown(1)
    })
    window.addEventListener('mouseup',e=>{
        processMousePosition(e)
        processMouseDown(0)
    })
    window.addEventListener('mousemove',e=>{
        processMousePosition(e)
    })

    function processMousePosition(e){
        inputs.dir = Math.atan2(e.clientY-(canvas.offsetTop+canvas.height/2),e.clientX-(canvas.offsetLeft+canvas.width/2))
    }

    function processMouseDown(mouseDown){
        inputs.mouseDown = mouseDown
    }

    function processKey(e,keyDown){
        const code = e.code
        switch(code){
            case 'KeyW':
                inputs.w = keyDown
                break;
            case 'KeyS':
                inputs.s = keyDown
                break;
            case 'KeyA':
                inputs.a = keyDown
                break;
            case 'KeyD':
                inputs.d = keyDown
                break;
        }
        // console.log(inputs)
    }

    return inputs
}