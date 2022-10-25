
class Engine{

	_context;
	_canvas;
	autoResize = false;
	scenes = [];
	renderLoops = [];

	constructor(canvasOrContext, contextOptions){
		if(canvasOrContext instanceof HTMLCanvasElement){
			this._context = canvasOrContext.getContext('2d', contextOptions);
			this._canvas = canvasOrContext;
		}else if(canvasOrContext instanceof CanvasRenderingContext2D){
			this._context = canvasOrContext;
			this._canvas = canvasOrContext.canvas;
		}
		
		this.autoResize = !!contextOptions?.autoResize;

		this._canvas.addEventListener('resize', () => {
			if(this.autoResize){
				this.resize();
			}
		});

		this.resize();
	}

	resize(){
		let width = this._canvas?.clientWidth || this._canvas?.width || innerWidth;
		let height = this._canvas?.clientHeight || this._canvas?.height || innerHeight;
		this.setSize(width, height);
	}
	
	setSize(width, height){
		this._canvas.width = width;
		this._canvas.height = height;
	}

	runRenderLoop(loop){
		this.renderLoops.push(loop);
	}

	stopRenderLoop(loop){
		this.renderLoops.splice(this.renderLoops.indexOf(loop));
	}

	static get name(){
		return 'Assyrian'
	}

	static get version(){
		return '0.0.1'
	}

	static get description(){
		return Engine.name + ' ' + Engine.version
	}
}

class Scene {
	nodes = [];
	rootNodes = [];
	sprites = [];
	meshes = [];
	constructor(engine){
		this._engine = engine;
		engine.scenes.push(this);
	}

	render(){
		let ctx = this._engine._context;
		ctx.clearRect(0, 0, this._engine._canvas.width, this._engine._canvas.height);

		this.rects.forEach(rect => {
			ctx.fillStyle = `rgb(${rect.color.r},${rect.color.g},${rect.color.b})`;
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		});
	}

	serialize(){
		return {
			nodes: this.nodes.map(node => node.serialize())
		};
	}
}

class Color {
	r = 0;
	g = 0;
	b = 0;
	constructor(r, g, b){
		this.r = r;
		this.g = g;
		this.b = b;
	}

	asArray(){
		return [this.r, this.g, this.b];
	}

	static fromArray(array){
		return new Color(...array);
	}
}

class Node {

	#scene;
	#parent;
	#rotation = 0;

	x = 0;
	y = 0;
	

	get parent(){
		return this.#parent;
	}

	set parent(parent){
		if(!(parent instanceof Node)) throw new TypeError('Invalid parent type');
		this.#parent = parent;
	}

	get scene(){
		return this.#scene
	}

	set scene(scene){
		if(!(scene instanceof Scene)) throw new TypeError('Can not set scene of node to non-scene');
		this.#scene = scene;
	}

	get rotation(){
		return this.#rotation;
	}

	set rotation(rotation){
		this.#rotation = rotation % (2 * Math.PI);
	}

	constructor(name, scene){
		this._name = name;
		this.#scene = scene;
		scene.rootNodes.push(this);
		scene.nodes.push(this);
	}

	serialize(){
		return {
			...({x, y, rotation} = this)
		}
	}
}

class Camera extends Node {
	constructor(name, scene){
		super(name, scene);
	}

	serialize(){
		
	}
}

class Mesh extends Node {

	geometry = [];
	color = new Color(0, 0, 0);

	constructor(name, scene){
		super(name, scene);
		scene.meshes.push(this);
	}

	serialize(){
		return {
			...({x, y, color, geometry} = this),
			
		}
	}

	static CreateRect(name, { x = 0, y = 0, width = 0, height = 0, color = new Color(0, 0, 0)}, scene){
		let mesh = new Mesh(name, scene);
		mesh.x = x;
		mesh.y = y;
		mesh.color = color;
	}
}

class Sprite extends Node {
	constructor(name, url, scene){
		super(name, scene);
		scene.sprites.push(this);
	}

	serialize(){
		return {

		}
	}
}