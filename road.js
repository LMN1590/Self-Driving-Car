class Road{
    constructor(x,width,numLane=3){
        const inf=1000000;

        this.x=x;
        this.width=width;
        this.laneCount=numLane;

        this.left=this.x-this.width/2;
        this.right=this.x+this.width/2;
        this.top=-inf;
        this.bottom=inf;
        
        const topLeft={x:this.left,y:this.top};
        const topRight={x:this.right, y:this.top};
        const bottomLeft={x:this.left,y:this.bottom};
        const bottomRight={x:this.right, y:this.bottom};

        this.border=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
    }
    getMiddleLane(index){
        return this.left+(index+0.5)*this.width/this.laneCount;
    }
    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for (let i=1; i<this.laneCount; i++){
            let x = lerp(this.left,this.right,i/this.laneCount);
            ctx.beginPath();
            ctx.setLineDash([20,20]);
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);
            ctx.stroke();
        }
        ctx.setLineDash([]);
        ctx.strokeStyle="white";
        this.border.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x,border[0].y);
            ctx.lineTo(border[1].x,border[1].y);
            ctx.stroke();
        });
    }
}