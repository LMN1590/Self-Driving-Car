class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=0;
        this.accel=0.2;
        this.maxSpeed=10;
        this.friction=0.1;
        this.angle=0;
        this.damaged=false;

        this.controls= new Controls();
        this.sensors=new Sensor(this);
    }
    #move(){
        if(this.controls.forward){
            if(this.speed>0) this.speed-=this.accel*2;
            else this.speed-=this.accel;
        }
        if(this.controls.reverse){
            if(this.speed<0) this.speed+=this.accel*2;
            else this.speed+=this.accel;
        }
        if(this.controls.forward || this.controls.reverse){
            if(this.controls.left){
                this.angle+=0.05;
            }
            if(this.controls.right){
                this.angle-=0.05;
            }
        }
        //if(this.speed>this.maxSpeed/2) this.speed=this.maxSpeed/2;
        //if(this.speed<-this.maxSpeed) this.speed=-this.maxSpeed;

        if(Math.abs(this.speed)<this.friction)this.speed=0;
        if(this.speed>0)this.speed-=this.friction;
        if(this.speed<0)this.speed+=this.friction;

        this.x+=Math.sin(this.angle)*this.speed;
        this.y+=Math.cos(this.angle)*this.speed;
    }
    update(roadBorder){
        this.#move();
        this.polygon=this.#createPolygon();
        this.damaged=this.#accessDamage(roadBorder);
        this.sensors.update(roadBorder);
    }
    #accessDamage(roadBorder){
        for(let i=0;i<roadBorder.length;i++){
            if(polyIntersect(this.polygon,roadBorder[i])){
                return true;
            }
        }
        return false;
    }
    #createPolygon(){
        const points=[]
        const radius=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*radius,
            y:this.y-Math.cos(this.angle-alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*radius,
            y:this.y-Math.cos(this.angle+alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*radius,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*radius
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*radius,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*radius
        });
        return points;
    }
    draw(ctx){
        if(this.damaged){
            this.y=0;
            this.x=250;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        this.sensors.draw(ctx);
    }
}