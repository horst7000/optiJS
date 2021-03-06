class Edge {
	constructor(src,trg,directed,nodeRadius,nodraw=false) {
		this.r = nodeRadius;
		this.src = src;
        this.trg = trg;
        this._cost = Math.floor(src.dist(trg.x,trg.y)/10);
		this.directed = directed;
		this.nodraw = nodraw;

		if(!directed && !nodraw) {
			this.backEdge = new Edge(trg, src, directed, nodeRadius, true);
		}
		
		src.addOut(this);
		trg.addIn(this);

		this.draw();
    }
    
    set color(col) { this.line.attr({stroke: col}) }
	set cost(cost) {
		this._cost = cost;
		if(!this.nodraw)
			this.costTxt.attr({text: cost});

		if(this.backEdge)
			this.backEdge.cost = cost;
	}
	get cost() { return this._cost }
	get txtX() { return this.nodraw ? 0 : this.costTxt.attr('x')}
	get txtY() { return this.nodraw ? 0 : this.costTxt.attr('y')}

	draw() {
		if(this.nodraw)  return;
		if(this.line) 	 this.line.remove();
		if(this.costTxt) this.costTxt.remove();

		let src 	= this.src;
		let trg 	= this.trg;
		let dist 	= src.dist(trg.x,trg.y);
		let dx 		= trg.x-src.x;
		let dy		= trg.y-src.y;
		let normdx 	= (dx)/dist;
		let normdy 	= (dy)/dist;
		let orth  = {
			x: -normdy,
			y: normdx
		};
		this.line = {};

		if(this.directed)
			this.line 	= s.path(
				"M"+src.x+" "+src.y+
				" Q"+(src.x+dx/2+orth.x*dist/3)+" "+(src.y+dy/2+orth.y*dist/3)+
				", "+(trg.x-this.r*normdx)+" "+(trg.y-this.r*normdy)+
				" l"+(dist*0.05*(-2*normdx+orth.x))+" "+(dist*0.05*(-2*normdy+orth.y)) //arrow head
			);
		else
			this.line 	= s.path(
				"M"+src.x+" "+src.y+
				" L"+trg.x+" "+trg.y
			);

		this.line.attr({
            stroke: "#000",
			fill: "transparent",
			strokeWidth: this.r/4
		});
		
		// draw text / cost
		this.costTxt = s.text(0,0,this.cost);
		let fontSize = 1.1*this.r;		
		if(this.directed)
			this.costTxt.attr({
				x: src.x + dx/2+orth.x*dist/4 - fontSize/2,
				y: src.y + dy/2+orth.y*dist/4 + fontSize/2,
				fontSize: fontSize,
				stroke: "#333"
			})
		else
			this.costTxt.attr({
				x: src.x + dx/2+orth.x*1.2*this.r - fontSize/2,
				y: src.y + dy/2+orth.y*1.2*this.r + fontSize/2,
				fontSize: fontSize,
				stroke: "#333"
			})
	}

}