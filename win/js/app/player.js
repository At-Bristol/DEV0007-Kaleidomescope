function Player(name) {

	//props

 


	this.source;
	this.name 								 = name;
	this.context;
	this.typeLoaded 					     = 'video';
	this.canvas;
	this.context;
	this.video   							 = {};
	this.image;
	this.videoSource;
	this.videoPlaying 						 = true;					
	this.video.progress     				 = 0;
	this.video.frameRate 	 				 = 30; 



			    

	//oncanvas controls

	this.v_Panorama_Height         			 = 1.0;
    this.v_Panorama_Position       			 = 0.0;
	this.v_Guide_On 				  	     = 0.0;
	this.v_Panorama_FOV_Multiplier      	 = 1.0;
	this.v_Panorama_Rotate_Source       	 = 0.0;
	this.v_Panorama_Scale_Source        	 = 100.0;


	_this = this


	


	//private 

	existingSourceDivs = [];


	init();




	function init(){
 
    	createCanvas();

    	createContext();

    	_this.video.progress = VideoFrame({
		    id : _this.video.id,
		    frameRate: FrameRates.web,
		    callback : function(response) {
		        console.log('callback response: ' + response);
	    }
	});			



    };









	//public methods


	this.loadSource = function(source){
		

		this.source = source;
		
	    if(source.type == 'video'){
	    	this.loadVideo();
	       
	    }else if(source.type == 'image'){
	    	this.loadStill()

	    }

    } 


    this.drawFrame = function(){

	    if(this.source.type == 'video'){
	        this.drawVideoFrameInCanvas();
	    }else if(this.source.type == 'image'){
	    	this.drawImageFrameInCanvas();
	    }else{
	    	console.log('no source found');
	    };

    };

    this.play = function(a){

    	if(this.typeLoaded == 'video'){
    		if(a){
    			this.video.play();
    			this.videoPlaying = true;
    		}else{
    			this.video.pause();
    			this.videoPlaying = false;
    		}
    		
    		
    	}
    }


    this.mute = function(a){

    	if(this.typeLoaded == 'video'){
    		if(a){
    			this.video.muted = true;
    		}else{
    			this.video.muted = false;
    		}
    	}
    }

    this.loop = function(a){

    	if(this.typeLoaded == 'video'){
    		if(a){
    			this.video.loop = true;
    		}else{
    			this.video.loop = false;
    		}
    	}
    }






    this.viewSource = function(){

    	console.log('viewSource ' + this.name)

    	document.getElementById(this.name).style.display = 'inline' ;
    
    }

    this.hideSource = function(){

    	document.getElementById(this.name).style.display = 'none';
    
    }


    this.loadVideo = function(){

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.videoSource.setAttribute('src', this.source.completePath);
		//console.log("add to" + this.canvas.id + "  video Source = " + this.videoSource.src);

		this.typeLoaded = 'video'
		this.video.load();
		this.play(true);
		if(this.video.muted){
			this.mute(true);
		}
		this.loop(true);


		var that = this;

        this.video.addEventListener('loadedmetadata', function() {

		   that.setCanvasResolution(that.video.videoWidth);

	 	}, false);



		
	   if(this.source.completePath){


			transmit(['v_Path',this.source.completePath, this.name]);
			transmit(['v_Name',this.source.name + '.' + this.source.extension, this.name]);
		}
	}


	this.loadStill = function(){

	
		console.log("loadStill")

		this.video.pause()

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.typeLoaded = 'image';

		this.image = new Image();

		this.image.src = this.source.completePath;

		var that = this;

		this.image.onload = function(){
			that.drawImageFrameInCanvas();
			that.setCanvasResolution(that.image.clientWidth);

		}
		
		if(this.source.path){
			transmit(['v_Path',this.source.path, this.name]);
			transmit(['v_Name',this.source.name  + '.' + this.source.extension, this.name]);
		}
	}



   this.drawVideoFrameInCanvas = function() {

	
		if(this.video.paused || this.video.ended) return false;

			this.typeLoaded = 'video';

		    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.context.save(); 

			this.context.translate(this.canvas.width/2, this.canvas.height/2)

			rotation = ((this.v_Panorama_Rotate_Source_Rate*0.0001) * (frame)  );   

			this.context.rotate((this.v_Panorama_Rotate_Source * (Math.PI / 180.0)) + rotation ) ;
			this.context.scale(this.v_Panorama_Scale_Source/100.00,this.v_Panorama_Scale_Source/100.00)


		    this.context.drawImage(this.video,0 - (this.canvas.width/2), (this.canvas.height * (this.v_Panorama_Position/100)) - (this.canvas.height/2), this.canvas.width  ,this.canvas.height * this.v_Panorama_Height);

		    guiupdateRes = 10

		    
		   	 if(this.video.progress.get() % guiupdateRes == 0){
		   	 	    transmit(['v_Video_Progess', this.video.progress.get()/(this.video.duration*(30/100)) , this.name]);
		    		
		    	}
		 

			this.context.restore(); 

			return true
		   			  
		};

    this.drawImageFrameInCanvas = function(){


		  	    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		  	    this.typeLoaded = 'image';

		
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				this.context.drawImage(this.image, 0, this.canvas.height * (v_Panorama_Position/100), this.canvas.width  ,this.canvas.height * v_Panorama_Height);
				
			
			}


	this.setCanvasResolution = function(width){


	     if (width < 2048){
		   	   this.canvas.width = 2048;
			   this.canvas.height = 1024;
			   currentResolution = '1k';
			   transmit(['v_currentResolution',currentResolution,this.name]);
			
		   } else if(width >= 4096) {
		   	   this.canvas.width = 4096;
			   this.canvas.height = 2048;
			   currentResolution = '4k';
			   transmit(['v_currentResolution',currentResolution,this.name]);
		   } else{
		   		this.canvas.width = 4096;
		  		this.canvas.height = 2048;
		  		currentResolution = '2k';
		  		transmit(['v_currentResolution',currentResolution,this.name]);
			
		   }

	}


	this.clear = function(){
		blankSource = new Source('assets\\img\\blank.png')
		this.loadSource(blankSource);
		transmit(['v_Path','None', this.name]);
		transmit(['v_Name','None', this.name]);
	}




	this.progress = function(){
		if(this.videoPlaying = true){
			frame = this.video.progress.get()/(this.video.duration*(30/100));
			return frame
		}else{
			return false
		}
	}


	//private methods


	//init methods

    function createCanvas(){

    	c   			= 	document.createElement('canvas');
        c.id 				=	_this.name;
		c.className 	= 	'sourceCanvas';
		c.width 		= 	2048;
		c.height 		= 	1024;
    	
    	v 	 			= 	document.createElement('video');
    	v.id 			= 	_this.name + 'VideoPlayer';
    	v.className    =    'videoPlayer';


		vs 		    = 	document.createElement('source');
		vs.id 			=	_this.name + 'Video'

		v.appendChild(vs);


	    
		

		document.body.appendChild(c);
		document.body.appendChild(v);


		_this.canvas 		= 	c;
		_this.video  		= 	v;
		_this.videoSource 	= 	vs;


		return true;





    };



    function createContext(){


		context = _this.canvas.getContext('2d');
		context.fillRect(0, 0, _this.canvas.height, _this.canvas.width);
		_this.context = context;

		return true; 


    };




    
	//controls
				
	function videoPlayPause(play){
		if(play){
			video.play();
		}else{
			video.pause();
		}
	}

    function videoMuteUnMute(mute){
	    if(mute){
			 video.muted='muted';
		}else{
		    video.muted = false;
		}		
    }


    //utils

    function clearCanvas(){
        if(this.context){
            loadStill('assets\\img\\blank.png')
            transmit(["v_Clear_Dome","false", this.name]);
        }
    }




	document.onkeyup = function(evt){
			if (evt.keyCode == 32) {
	    	  videoPlayPause(this.v);
	   	 }
		}




	function updateTransportIndicator(frame){
		indicator = document.getElementById('indicator');

	   var indicatorDivider =   (this.v.duration*30)/document.getElementById('transportControls').clientWidth;
	   indicator.style.left = frame/indicatorDivider + 'px';

	}


	

};


