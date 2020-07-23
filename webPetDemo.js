
window.addEventListener('DOMContentLoaded', (event) =>{

    let petImage = new Image()
    petImage.src = "breksheet.png"
    let petImageLeft = new Image()
    petImageLeft.src = "breksheetl.png"

    let plantImage = new Image()
    plantImage.src = "bugginfruit.png"

    let keysPressed = {}

    document.addEventListener('keydown', (event) => {
        keysPressed[event.key] = true;
     });
     
     document.addEventListener('keyup', (event) => {
         delete keysPressed[event.key];
      });

    let tutorial_canvas = document.getElementById("tutorial");
    let tutorial_canvas_context = tutorial_canvas.getContext('2d');

    tutorial_canvas.style.background = "#000000"


    let flex = tutorial_canvas.getBoundingClientRect();

    // Add the event listeners for mousedown, mousemove, and mouseup
    let tip = {}
    let xs
    let ys
   
   
    
    window.addEventListener('mousedown', e => {

          flex = tutorial_canvas.getBoundingClientRect();
          xs = e.clientX - flex.left;
          ys = e.clientY - flex.top;
          tip.x = xs
          tip.y = ys
    
          tip.body = tip

          let fruit = new Circle(tip.x, tip.y, 3, "cyan")

          pet.food.push(fruit)

     });
    
    

    class Triangle{
        constructor(x, y, color, length){
            this.x = x
            this.y = y
            this.color= color
            this.length = length
            this.x1 = this.x + this.length
            this.x2 = this.x - this.length
            this.tip = this.y - this.length*2
            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
            this.accept2 = (this.y-this.tip)/(this.x2-this.x)

        }

        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.stokeWidth = 3
            tutorial_canvas_context.moveTo(this.x, this.y)
            tutorial_canvas_context.lineTo(this.x1, this.y)
            tutorial_canvas_context.lineTo(this.x, this.tip)
            tutorial_canvas_context.lineTo(this.x2, this.y)
            tutorial_canvas_context.lineTo(this.x, this.y)
            tutorial_canvas_context.stroke()
        }

        isPointInside(point){
            if(point.x <= this.x1){
                if(point.y >= this.tip){
                    if(point.y <= this.y){
                        if(point.x >= this.x2){
                            this.accept1 = (this.y-this.tip)/(this.x1-this.x)
                            this.accept2 = (this.y-this.tip)/(this.x2-this.x)
                            this.basey = point.y-this.tip
                            this.basex = point.x - this.x
                            if(this.basex == 0){
                                return true
                            }
                            this.slope = this.basey/this.basex
                            if(this.slope >= this.accept1){
                                return true
                            }else if(this.slope <= this.accept2){
                                return true
                            }
                        }
                    }
                }
            }
            return false
        }
    }


    class Rectangle {
        constructor(x, y, height, width, color) {
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.xmom = 0
            this.ymom = 0
        }
        draw(){
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.fillRect(this.x, this.y, this.width, this.height)
        }
        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
        isPointInside(point){
            if(point.x >= this.x){
                if(point.y >= this.y){
                    if(point.x <= this.x+this.width){
                        if(point.y <= this.y+this.height){
                        return true
                        }
                    }
                }
            }
            return false
        }
    }
    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.xrepel = 0
            this.yrepel = 0
        }       
         draw(){
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath();
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color
           tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke(); 
        }
        move(){
            this.x += this.xmom
            this.y += this.ymom
        }
        isPointInside(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius*this.radius)){
                return true
            }
            return false
        }
        repelCheck(point){
            this.areaY = point.y - this.y 
            this.areaX = point.x - this.x
            if(((this.areaX*this.areaX)+(this.areaY*this.areaY)) <= (this.radius+point.radius)*(point.radius+this.radius)){
                return true
            }
            return false
        }
    }

    class Line{
        constructor(x,y, x2, y2, color, width){
            this.x1 = x
            this.y1 = y
            this.x2 = x2
            this.y2 = y2
            this.color = color
            this.width = width
        }
        hypotenuse(){
            let xdif = this.x1-this.x2
            let ydif = this.y1-this.y2
            let hypotenuse = (xdif*xdif)+(ydif*ydif)
            return Math.sqrt(hypotenuse)
        }
        draw(){
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.lineWidth = this.width
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.x1, this.y1)         
            tutorial_canvas_context.lineTo(this.x2, this.y2)
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.lineWidth = 1
        }
    }

    class Pet{
        constructor(){
            this.x = 100
            this.y = 350
            this.radius = 15
            this.color ="black"
            this.frame = 0
            this.framecount = 0
            this.direction = -1
            this.ydirection = -1
            this.hunger = 1
            this.food = []

        }
        control(){

            if(this.hunger < 0 && this.food.length > 0 ){

                let xforce = (this.x-this.food[0].x)/500
                let yforce = (this.y-this.food[0].y)/500

                for(let t = 0; (Math.abs(xforce)+Math.abs(yforce)) < .7; t++){
                    xforce*=1.1
                    yforce*=1.1
                    if(t > 1000){
                        break
                    }
                }

                this.x -=xforce
                this.y -=yforce
                this.framecount++
                if(this.framecount%10 == 0){
                    this.frame++
                }
                this.frame%=15
                // console.log(xforce)

                if(xforce < 0){
                    if(this.direction == -1){
                        this.direction*=-1
                        if(this.direction == 1){
                            this.x += 56
                        }
                        if(this.direction == -1){
                            this.x -= 56
                        }
                    }
                }else{
                    if(this.direction == 1){
                        this.direction*=-1
                        if(this.direction == -1){
                            this.x -= 56
                        }
                        if(this.direction == 1){
                            this.x += 56
                        }
                    }
                }


             let tongue = new Line(this.x, this.y, this.food[0].x, this.food[0].y, "blue", 2)
             if(tongue.hypotenuse()<20){


                this.x +=xforce
                this.y +=yforce
                this.food[0].x+=xforce
                this.food[0].y+=yforce
                tongue = new Line(this.x, this.y, this.food[0].x, this.food[0].y, "blue", 2)
                tongue.draw()
             }
             if(tongue.hypotenuse()<2){
                 this.food.splice(0,1)
                 this.hunger+=1000
             }


            }else{
                if(Math.random()<.005){
                    this.direction*=-1
                    if(this.direction == 1){
                        this.x += 56
                    }
                    if(this.direction == -1){
                        this.x -= 56
                    }
                }
                if(Math.random()<.01){
                    this.ydirection*=-1
                }
                if(this.x < 10){
                    if(this.direction == -1){
                        this.x += 56
                    }
                    this.direction = 1
                }
                if(this.x > 690){
                    if(this.direction == 1){
                        this.x -= 56
                    }
                    this.direction = -1
                }
                if(this.y > 690){
                    this.ydirection = -1
                }
                if(this.direction == 1){
                    this.x +=.5   
                       this.framecount++
                    if(this.framecount%10 == 0){
                        this.frame++
                    }
                    this.frame%=15
                }else if(this.direction == -1){
                 this.x -=.5     
                  this.framecount++
                 if(this.framecount%10 == 0){
                     this.frame++
                 }
                 this.frame%=15
                }
                if(!island.isPointInside(this)){
                    this.ydirection = 1
                }
                if(this.ydirection == 1){
                    this.y +=.5   
                       this.framecount++
                    if(this.framecount%10 == 0){
                        this.frame++
                    }
                    this.frame%=15
                }else if(this.ydirection == -1){
                 this.y -=.5     
                  this.framecount++
                 if(this.framecount%10 == 0){
                     this.frame++
                 }
                 this.frame%=15
                }
            }
        }
    
        draw(){
            if(this.hunger > -1){
                this.hunger-=1
            }

            for(let t =0;t<this.food.length; t++){
                this.food[t].draw()
            }


            this.control()
            // if(Math.random()<.1){
          
            // }
            let columns = 15 
            let rows = 1 
            let iWidth = petImage.width/columns
            let iHeight = petImage.height/rows

            let sourceX = this.frame*iWidth
            let sourceY = 0

        //     tutorial_canvas_context.lineWidth = 1
        //     tutorial_canvas_context.strokeStyle = this.color
        //     tutorial_canvas_context.beginPath();
        //     tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
        //     tutorial_canvas_context.fillStyle = this.color
        //    tutorial_canvas_context.fill()
        //     tutorial_canvas_context.stroke(); 
            if(this.direction == 1){
                tutorial_canvas_context.drawImage(petImage, sourceX, sourceY, iWidth, iHeight, this.x-58, this.y-26, iWidth, iHeight)
            }else if (this.direction == -1){
                tutorial_canvas_context.drawImage(petImageLeft, sourceX, sourceY, iWidth, iHeight, this.x-6, this.y-26, iWidth, iHeight)
            }
        }
    }
    class Plant{
        constructor(){
            this.direction = 1
            this.x = 400
            this.y = 400
            this.frame = 0
            this.framecount=0

        }

        draw(){
            let columns = 4
            let rows = 1 
            let iWidth = plantImage.width/columns
            let iHeight = plantImage.height/rows

            this.framecount++
            if(this.framecount%1000 == 0){
                this.frame++
                if(this.frame%4 == 0){
                    let fruit = new Circle(this.x+((Math.random()-.5)*30), this.y+30+(Math.random()*10), 3, "cyan")
                    pet.food.push(fruit)
                }
            }
            this.frame%=4
        

            let sourceX = this.frame*iWidth
            let sourceY = 0

            if(this.direction == 1){
                tutorial_canvas_context.drawImage(plantImage, sourceX, sourceY, iWidth, iHeight, this.x, this.y, iWidth, iHeight)
            }else if (this.direction == -1){
                // tutorial_canvas_context.drawImage(petImageLeft, sourceX, sourceY, iWidth, iHeight, this.x-6, this.y-26, iWidth, iHeight)
            }
        }
    }

    let island = new Circle(350, 500, 400, "#BB66AA")

    let pet = new Pet()

    let plant = new Plant()
   
    window.setInterval(function(){ 
        tutorial_canvas_context.clearRect(0,0,tutorial_canvas.width, tutorial_canvas.height)
        island.draw()
        plant.draw()
        pet.draw()

    }, 14) 



        
})