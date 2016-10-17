var Source = function(filepath, side){

			    this.side = side;

				this.completePath = filepath;

		 		var imageSeqCounterLength = 0;
			    var name        =  filepath.substr(filepath.lastIndexOf('\\') + 1);

			   	name 			=  name.substring(0, name.lastIndexOf('.') );

			   	//name

			   	this.name 		= 		name;

			   	//path to file 

			   	this.path        = filepath.substr(0, filepath.length - ( filepath.length - filepath.lastIndexOf("\\") -1 ) ); 

			   	//extention

			   	this.extension   = filepath.substr(- ( filepath.length - (filepath.lastIndexOf('.') + 1) ) );

			   	this.seqid = false; 

			   	this.type  = 'not recognised';

			   	if (this.extension == 'jpg'){
					this.type = 'image'

				}else if(this.extension == 'png'){
					this.type = 'image'


				}else if(this.extension == 'bmp'){
					this.type = 'image'


				}else if(this.extension == 'mp4'){

					this.type = 'video'


				}else if(this.extension == 'mov'){

					this.type = 'video'


				}else if(this.extension == 'mkv'){

					this.type = 'video'


				}else if(this.extension == 'ogg'){

					this.type = 'video'


				}else if(this.extension == 'webm'){

					this.type = 'video'



				}else{

					console.log('File type not recognised');
					return false;
				}


				if(this.type == 'image'){

			  	    imageSeqCounterLength = determineImageSequenceCounterLength(name);

		  	    }

		  	    this.seqCounterLength = imageSeqCounterLength;

		  	    if(imageSeqCounterLength > 0){

		  	    	//seqid - if image sequence this contains image sequence header without the incrementing values

		  	         this.seqid = name.substr( 0, name.length - (imageSeqCounterLength) ) 

		  	    }


		  		function determineImageSequenceCounterLength(imgName){

				   		l=0;

				   	    while(l<imgName.length){
				   	    	currentChar =  imgName.charAt( imgName.length - (l + 1) ) ;
				   	    	if( !parseInt(currentChar) && currentChar != 0 ){
				   	    		return(l);
				   	    		break
				   	    	};
				   	        l++;
				   	    };
					};
				};