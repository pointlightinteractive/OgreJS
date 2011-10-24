// exports.system = system ; exports.system.Camera = system.Camera ; exports.Input = Input ; 

// var extend = require( 'extend' ) ;

// var init = function( ogre ) {


var sys = require( 'sys' ) ;

ogre.input = {} ; // new extendable.Extendable() ;
system = ogre.system ;

function delegateFromAtoB( a, b )
	{
	 for( var i in b )
		{
	 	 if( typeof b[ i ] == 'function' )
			{
			
	 		 a[ i ] = (function(){ var func = b[i] ; var name = i ; return function() { return func.apply( b, arguments ) ;   } ; })() ;
			}
		
		}
	}



function delegateFromPrototypeAtoMemberMforPrototypeP( a, m, p )
	{
	 for( var i in p )
		{
	 	 if( typeof p[ i ] == 'function' )
			{
	 		 a[ i ] = (function(){ var func = p[i] ; var name = i ; return function() { return func.apply( this[ m ], arguments ) ;   } ; })() ;
			}

		}
	}

delegateFromAtoB( ogre.input, system.input ) ;

ogre.input.start = function( rateHz )
	{
	 ogre.input.captureProcess = setInterval( system.input.captureUI, 1000 / rateHz ) ;
	}

ogre.input.stop = function()
	{
	 clearInterval( ogre.input.captureProcess ) ;
	}

ogre.window = { width: system.window.width, height: system.window.height } ;

ogre.input.mouseMoved = function( mouseEvent ) {}
ogre.input.mousePressed = function( mouseEvent ) {}
ogre.input.mouseReleased = function( mouseEvent ) {}

ogre.input.keyPressed = function( mouseEvent ) {}
ogre.input.keyReleased = function( mouseEvent ) {}

ogre.input.on( 'mouseMoved', ogre.input.mouseMoved ) ;
ogre.input.on( 'mousePressed', ogre.input.mousePressed ) ;
ogre.input.on( 'mouseReleased', ogre.input.mouseReleased ) ;

ogre.input.on( 'keyPressed', ogre.input.keyPressed ) ;
ogre.input.on( 'keyReleased', ogre.input.keyReleased ) ;

var input = ogre.input ;



function SubEntity( cpp )
	{
	 this.cpp = cpp ;
	 this.material = ogre.materialSet[ cpp.getMaterialName() ] ;	
	}


SubEntity.prototype.setMaterialByName = function( name )
	{
	 this.cpp.setMaterialByName( name ) ;
	}


SubEntity.prototype.setMaterial = function( material )
	{
	 this.cpp.setMaterial( material.cpp ) ;
	
	 this.material = material ;
	}
	
	

SubEntity.prototype.getMaterial = function()
	{
	 return this.material ;
	}


function Entity( meshname ) {}



Entity.prototype.init = function( meshname )
	{
	 this.cpp = new system.Entity( meshname ) ;

	 this.cpp.functionalEntity = this ;

	 this.parent = null ;

	 this.subEntitySet = [] ;

	 for( var i in this.cpp.subEntitySet )
		{
		 this.subEntitySet[ i ] = new SubEntity( this.cpp.subEntitySet[ i ] ) ;
		 this.subEntitySet[ i ].functionalSubEntity = this ;
		}
		
	 return this ;
	} ;


// Entity.prototype = new extendable.Extendable() ;

delegateFromPrototypeAtoMemberMforPrototypeP( Entity.prototype, 'cpp', ogre.EventEmitter.prototype ) ;

Entity.prototype.setParent = function( newParent ) 
	{
	 if( newParent != null )
		 this.cpp.setParent( newParent.cpp ) ;
	 else
		 this.cpp.setParent( null ) ;

	 if( this.parent != null )
		{
		 var removeFromOldParent = this.parent.children.indexOf( this ) ;
		 if( removeFromOldParent >= 0 ) this.parent.children.splice( removeFromOldParent, 1 ) ;
		}

	 this.parent = newParent ;

	 if( newParent != null )
		 newParent.children.push( this ) ;
	} 


ogre.Entity = Entity ;



function SceneNode() {}

SceneNode.prototype.init = function()
	{
	 this.cpp = new system.SceneNode() ;

	 this.parent = null ;

	 this.children = [] ;
	
	 return this ;
	}
	
	
	
	

// SceneNode.prototype = new extendable.Extendable() ;

SceneNode.prototype.setParent = function( newParent ) 
	{
	 if( newParent != null )
		 this.cpp.setParent( newParent.cpp ) ;
	 else
		 this.cpp.setParent( null ) ;
	 if( this.parent != null )
		{
		 var removeFromOldParent = this.parent.children.indexOf( this ) ;
		 if( removeFromOldParent >= 0 ) this.parent.children.splice( removeFromOldParent, 1 ) ;
		}
	 this.parent = newParent ;

	 if( newParent != null )
		 newParent.children.push( this ) ;
	} 

SceneNode.prototype.moveL3N = function( x, y, z ) { this.cpp.moveL3N( x, y, z ) ; } 

SceneNode.prototype.roll  = function( r ) { this.cpp.roll(  r ) ; } 
SceneNode.prototype.pitch = function( r ) { this.cpp.pitch( r ) ; } 
SceneNode.prototype.yaw   = function( r ) { this.cpp.yaw(   r ) ; } 

SceneNode.prototype.convertLocalOXYZToWorldOXYZ = function( oXYZ ) { return this.cpp.convertLocalOXYZToWorldOXYZ( oXYZ ) ; } 
SceneNode.prototype.convertWorldOXYZToLocalOXYZ = function( oXYZ ) { return this.cpp.convertWorldOXYZToLocalOXYZ( oXYZ ) ; } 

SceneNode.prototype.convertLocalOXYZToParentOXYZ = function( oXYZ ) 
	{ return this.parent.convertWorldOXYZToLocalOXYZ( this.convertLocalOXYZToWorldOXYZ( oXYZ ) ) ;   } ;

SceneNode.prototype.convertParentOXYZToLocalOXYZ = function( oXYZ ) 
	{ return this.convertWorldOXYZToLocalOXYZ( this.parent.convertLocalOXYZToWorldOXYZ( oXYZ ) ) ;   } ;


ogre.SceneNode = SceneNode ;


function RootNode()
	{
	 this.cpp = system.root ;
	 this.parent = null ;

	 this.children = [] ;

	}

RootNode.prototype = SceneNode ;

var root = new RootNode() ;

function Camera()
	{
	}

// Camera.prototype = new extendable.Extendable() ;
	
Camera.prototype.init = function()
	{
		
	 this.cpp 	= system.Camera ;
	
	 this.setParent( root ) ;

	 this.movementProcesses = {} ;
	 this.activeHandlers = {} ;
		
	 return this ;
	}


Camera.prototype.initDefault = function()
	{

	 this.cpp 	= system.Camera ;
//	 this.node 	= new SceneNode() ;	

	 this.setParent( root ) ;

	 // this.node.setParent( root ) ;	

	 // this.node.moveL3N( 0, 0, 200 ) ;

//	 this.node.yaw( 3.145 ) ;

	 this.movementProcesses = {} ;
	 this.activeHandlers = {} ;


	// this.setDefaultInputHandlers() ;

	 return this ;
	}


Camera.prototype.pick = function( x, y )
	{
	 var hit = this.cpp.pick( x, y ) ;
	
	 if( hit )
		{
		 return { entity: hit.entity.functionalEntity, point: hit.point } ;
		}
	
	 // if( systemEntity ) return systemEntity.functionalEntity ;
	}



Camera.prototype.renderOneFrame = function()
	{
	 return this.cpp.renderOneFrame() ;
	}


Camera.prototype.setParent = function( newParent ) 
	{
	 if( newParent != null )
		 this.cpp.setParent( newParent.cpp ) ;
	 else
		 this.cpp.setParent( null ) ;

	 if( this.parent != null )
		{
		 var removeFromOldParent = this.parent.children.indexOf( this ) ;
		 if( removeFromOldParent >= 0 ) this.parent.children.splice( removeFromOldParent, 1 ) ;
		}

	 this.parent = newParent ;

	 if( newParent != null )
		 newParent.children.push( this ) ;
	}


Camera.prototype.start = function( rateHz )
	{
	 var self = this ;
		
	 this.renderProcess = setInterval( function() { self.renderOneFrame() ; }, 1000 / rateHz ) ;		
	}



Camera.prototype.stop = function()
	{
	 clearInterval( this.renderProcess ) ;
	}
	


/*
ogre.rotatingHead = function( rateHz )
	{
	 var head = new Entity( 'ogrehead.mesh' ) ;
	 var node = new SceneNode() ;
	
	 head.setParent( node ) ;
	
	 node.setParent( root ) ;
	
	 ogre.rotatingHead.entity = head ; ogre.rotatingHead.node = node ;
	
	 ogre.rotatingHead.process = setInterval( function() { node.yaw( 1.0 / rateHz ) ; }, 1000 / rateHz ) ;
	}

*/
ogre.RootNode = RootNode ;

ogre.root = root ;

var cam =  new Camera() ;


function Material() {}

Material.prototype.init = function()
	{
	 this.cpp = new ogre.system.Material() ;
	 this.cpp.init() ;
	
	 return this ;
	} ;


Material.prototype.initSystemMaterial = function( name, systemMaterial )
	{
	 this.name	= name 				;
	 this.cpp 	= systemMaterial 	;
	
	 return this ;
	} ;	

Material.prototype.clone			= function() 
	{
	 var systemMaterial = this.cpp.clone() ; 
	
	 return ( new Material() ).initSystemMaterial( "anonymous", systemMaterial ) ;
	} ;


Material.prototype.setAmbient 			= function( r, g, b ) { this.cpp.setAmbient( r, g, b ) ; } ;

Material.prototype.setDiffuse 			= function( r, g, b, a ) { this.cpp.setDiffuse( r, g, b, a ) ; } ;

Material.prototype.setSpecular 			= function( r, g, b, a ) { this.cpp.setSpecular( r, g, b, a ) ; } ;

Material.prototype.setSelfIllumination 	= function( r, g, b ) { this.cpp.setSelfIllumination( r, g, b ) ; } ;


Material.prototype.setTexture 		= function( textureName ) { this.cpp.setTexture( textureName ) ; } ;

Material.prototype.setTextureScroll = function( u, v ) { this.cpp.setTextureScroll( u, v ) ; } ;

Material.prototype.setTextureScale	= function( w, h ) { this.cpp.setTextureScale( w, h  ) ; } ;


ogre.Material = Material ;

ogre.materialSet = {} ;

for( var materialName in ogre.system.materialSet )
	{
	 ogre.materialSet[ materialName ] = ( new Material() ).initSystemMaterial( materialName, ogre.system.materialSet[ materialName ] ) ;
	}


cam.initDefault() ;

ogre.Camera = Camera ;

ogre.camera = cam  ;//cam.initDefault() ;

ogre.start = function( rateHz ) { cam.start( rateHz ) ; input.start( rateHz ) ; /* ogre.rotatingHead( rateHz ) ; */ } ;
ogre.stop  = function() { cam.stop() 	 ; input.stop() ;  }


return ogre ;
// }


// exports.init = init ;