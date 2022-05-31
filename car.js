class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=0;
        this.accel=0.2;
        this.maxSpeed=3;
        this.friction=0.1;
        this.angle=0;
        this.controls= new Controls();
    }
    update(){
        if(this.controls.forward){
            if(this.speed>0) this.speed-=this.accel*2;
            else this.speed-=this.accel;
        }
        if(this.controls.reverse){
            if(this.speed<0) this.speed+=this.accel*2;
            else this.speed+=this.accel;
        }
        if(this.controls.left){
            this.angle-=0.05;
        }
        if(this.controls.right){
            this.angle+=0.05;
        }
        if(this.speed>this.maxSpeed/2) this.speed=this.maxSpeed/2;
        if(this.speed<-this.maxSpeed) this.speed=-this.maxSpeed;

        if(Math.abs(this.speed)<this.friction)this.speed=0;
        if(this.speed>0)this.speed-=this.friction;
        if(this.speed<0)this.speed+=this.friction;

        console.log(this.angle);

        this.x+=Math.cos(this.angle+Math.PI/2)*this.speed;
        this.y+=Math.sin(this.angle+Math.PI/2)*this.speed;
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle)
        ctx.beginPath();
        ctx.rect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        ctx.fill();
        ctx.restore();

    }
}