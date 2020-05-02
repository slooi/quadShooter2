console.log('webgl.js loaded')

function createRenderer(){
    // shader source
    const vsSource = document.getElementById('vsSource').innerText
    const fsSource = document.getElementById('fsSource').innerText
    
    // canvas
    const canvas = document.createElement('canvas')
    canvas.width = c.gameDimensions.w
    canvas.height = c.gameDimensions.h
    document.body.append(canvas)
    
    // gl
    let gl = canvas.getContext('webgl')
    if(!gl){
        gl = canvas.getContext('experimental-webgl')
    }
    if(!gl){
        alert('ERROR: all versions of webgl are not supported. Please use an updated browser which supports webgl')
    }
    
    // gl setup stuff
    gl.viewport(0,0,canvas.width,canvas.height)
    gl.clearColor(0.5,0.3,0.4,1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    // program
    const program = buildProgram()
    gl.useProgram(program)
    
    // locations
    const attribLoc = []
    for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_ATTRIBUTES);i++){
        const attribName = gl.getActiveAttrib(program,i).name
        attribLoc[attribName] = gl.getAttribLocation(program,attribName)
    }
    const uniformLoc = []
    for(let i=0;i<gl.getProgramParameter(program,gl.ACTIVE_UNIFORMS);i++){
        const uniformName = gl.getActiveUniform(program,i).name
        uniformLoc[uniformName] = gl.getUniformLocation(program,uniformName)
    }
    
    // data
    let data = [
    //  X   Y
        0,  0,0.3,0.9,0.8,
        150,0,0.3,0.9,0.8,
        150,150,0.3,0.9,0.8,
    ]
    
    // buffer
    const dataBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER,dataBuffer)
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW)
    
    // pointer
    gl.vertexAttribPointer(
        attribLoc.a_Position,
        2,
        gl.FLOAT,
        0,
        5*Float32Array.BYTES_PER_ELEMENT,
        0*Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(attribLoc.a_Position)
    gl.vertexAttribPointer(
        attribLoc.a_Color,
        3,
        gl.FLOAT,
        0,
        5*Float32Array.BYTES_PER_ELEMENT,
        2*Float32Array.BYTES_PER_ELEMENT
    )
    gl.enableVertexAttribArray(attribLoc.a_Color)
    
    // uniform
    gl.uniform2f(uniformLoc.u_InvRes,2/canvas.width,2/canvas.height)
    gl.uniform2f(uniformLoc.u_Translate,0,0)
    
    // render
    render()
    
    // FUNCTION
    
    function line(x1,y1,x2,y2){
        const dir = Math.atan2(y2-y1,x2-x1)
        const thick2S = (c.draw.line.thick/2)*Math.sin(dir)
        const thick2C = (c.draw.line.thick/2)*Math.cos(dir)

        data.push(
            x1+thick2S - thick2C,  y1-thick2C - thick2S,  1,1,1,
            x1-thick2S - thick2C,  y1+thick2C - thick2S,  1,1,1,
            x2+thick2S + thick2C,  y2-thick2C + thick2S,  1,1,1,

            x2+thick2S + thick2C,  y2-thick2C + thick2S,  1,1,1,
            x1-thick2S - thick2C,  y1+thick2C - thick2S,  1,1,1,
            x2-thick2S + thick2C,  y2+thick2C + thick2S,  1,1,1,
        )
    }

    function translate(srollX,scrollY){
        gl.uniform2f(uniformLoc.u_Translate,srollX,scrollY)
    }

    function render(){
        line(-300,-300,300,-300)
        line(300,-300,300,300)
        line(300,300,-300,300)
        line(-300,300,-300,-300)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW)
        gl.drawArrays(gl.TRIANGLES,0,data.length/5)
        data.length = 0
    }
    
    
    function buildShader(type,source){
        const shader = gl.createShader(type)
        gl.shaderSource(shader,source)
        gl.compileShader(shader)
    
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
            throw new Error('ERROR: compiling shader of type '+type+' . Info: '+gl.getShaderInfoLog(shader))
        }
        return shader
    }
    
    function buildProgram(){
        const program = gl.createProgram()
        gl.attachShader(program,buildShader(gl.VERTEX_SHADER,vsSource))
        gl.attachShader(program,buildShader(gl.FRAGMENT_SHADER,fsSource))
        gl.linkProgram(program)
        gl.validateProgram(program)
    
        if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
            throw new Error('ERROR: linking program. Info: '+gl.getProgramInfoLog(program))
        }
        if(!gl.getProgramParameter(program,gl.VALIDATE_STATUS)){
            throw new Error('ERROR: validating program. Info: '+gl.getProgramInfoLog(program))
        }
        return program
    }

    //##############
    // PUBLIC 
    //##############
    const w = c.player.w
    return {
        rect: function rect(x,y,colorArray){
            data.push(
                x,y,        colorArray[0],colorArray[1],colorArray[2],
                x,y+w,      colorArray[0],colorArray[1],colorArray[2],
                x+w,y,      colorArray[0],colorArray[1],colorArray[2],
                x+w,y,      colorArray[0],colorArray[1],colorArray[2],
                x,y+w,      colorArray[0],colorArray[1],colorArray[2],
                x+w,y+w,    colorArray[0],colorArray[1],colorArray[2],
            )
        },
        render,
        canvas,
        attribLoc,
        data,
        uniformLoc,
        translate
    }
}