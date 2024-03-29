class Car{
    constructor(x,y,width,height,controlType,maxSpeed){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.speed=0;
        this.accel=1;
        this.maxSpeed=maxSpeed;
        this.friction=0.1;
        this.angle=0;
        this.damaged=false;
        this.type=controlType;
        this.polygon=this.#createPolygon();
        this.useBrain=controlType=="AI";

        this.controls = new Controls(controlType);
        if(this.type!="DUMMY") {
            this.sensors=new Sensor(this);
            this.brain= new NeuralNetworks(
                [this.sensors.rayCount+1,10,8,6,3]
            );
        }
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
        if(this.speed!=0){
            if(this.controls.left){
                this.angle+=0.2;
            }
            if(this.controls.right){
                this.angle-=0.2;
            }
        }

        if(Math.abs(this.speed)<this.friction)this.speed=0;
        if(this.speed>0)this.speed-=this.friction;
        if(this.speed<0)this.speed+=this.friction;

        if(this.speed>this.maxSpeed) this.speed=this.maxSpeed;
        if(this.speed<-this.maxSpeed) this.speed=-this.maxSpeed;

        this.x+=Math.sin(this.angle)*this.speed;
        this.y+=Math.cos(this.angle)*this.speed;
    }
    update(roadBorder,traffic,bestY){
        if(!this.damaged){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#accessDamage(roadBorder,traffic,bestY);
        }
        
        if(this.sensors) {
            this.sensors.update(roadBorder,traffic);
            const offsets=this.sensors.readings.map(
                s=>s===null?0:1-s.offset
            );
            const outputs=NeuralNetworks.feedForward([this.speed/15 + 1,...offsets],this.brain);
            if(this.useBrain){
                this.controls.forward=outputs[0]==1?true:false;
                this.controls.reverse=outputs[1]==1?true:false;
                this.controls.left=outputs[2]==1?true:false;
                this.controls.right=!this.controls.left;
            }
        }
    }
    #accessDamage(roadBorder,traffic,bestY){
        for(let i=0;i<roadBorder.length;i++){
            if(polyIntersect(this.polygon,roadBorder[i]) || Math.abs(bestY-this.y)>200){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polyIntersect(this.polygon,traffic[i].polygon || Math.abs(bestY-this.y)>200)){
                //traffic[i].damaged=true;
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
    draw(ctx,defaultCol,sensorsDraw=false){
        if(this.damaged){
            ctx.fillStyle="gray";
        }
        else{
            ctx.fillStyle=defaultCol;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=1;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensors && sensorsDraw) this.sensors.draw(ctx);
    }
}