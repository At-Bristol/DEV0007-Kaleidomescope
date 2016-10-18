   function transmit(message){
			 ipcRenderer.send('to_Controls', message)
		}

	

        ipcRenderer.on('from-Player', (event, arg) => {

            console.log("received arg " + arg[0] + ' = ' + arg[1]);

        	  switch(arg[0]){

        	  	case 'v_FileName':

        	  	  	source1 = new Source(arg[1]);
				  	player1.loadSource(source1);
				  	break;

				case 'v_FileName_2': 

					source2 = new Source(arg[1]);
					player2.loadSource(source2); 
					break;

				case 'v_Video_Progress_1': 
					t =  Math.round((arg[1]/100) * (player1.video.duration*30));
	        		player1.video.progress.seekTo({frame:t});
					break;

				case 'v_Video_Progress_2': 
					
					t =  Math.round((arg[1]/100) * (player2.video.duration*30));
	        		player2.video.progress.seekTo({frame:t });
					break;
					
	            case 'v_Video_Play':
	          		
	        		eval(arg[2] + ".play(" + arg[1] +  ")");
	        		break;
	        		

	            case "v_Video_Loop":

	            	eval(arg[2] + ".loop(" + arg[1] +  ")");
	        		break;

        	      case "v_Auto_Fade":



        	          if (!autoFade) {
        	              autoFade = true;
                          
        	              
        	          } else {
        	              autoFade = false;
        	              autoFadeInit = false;
        	          }
        	          break;

        	      case "v_Fade_Left":

        	          

        	          if (!autoFade) {
        	              autoFade = true;
        	              afFadeRight = true;

        	          } else {
        	              autoFade = false;
        	              autoFadeInit = false;
        	          }
        	          break;


        	      case "v_Fade_Right":
        	         


        	          if (!autoFade) {
        	              autoFade = true;
        	              afFadeRight = false;

        	          } else {
        	              autoFade = false;
        	              autoFadeInit = false;
        	          }
        	          break;


	          	case "v_Video_Mute":

	    
	            	eval(arg[2] + ".mute(" + arg[1] +  ")");

	        		break;


	          	case "v_View_Source" :

	          	   		p = eval(arg[2]);

	        			if(arg[1]){
	        				p.viewSource();
	        			}else{
	        				p.hideSource();
	        			};
	        			break;

					

	            case "v_Constrain_Aspect_Ratio":

	        		g_constrainAspectRatio = arg[1];
	        		initWindow();
	        		break;
					
	        		
	          	case "v_Guide_On":
	          		if(arg[1]){
	          		 	v_Guide_On = 1.0;
	          		 }else{
	          		 	v_Guide_On = 0.0;
	          		 }
	          		 break;
					

			    case "v_Repetitions":

	        		 eval(arg[0]+ '=' + arg[1]);

	        		 if(arg[1]>1){
	        		 	  eval(arg[2] + ".setCanvasResolution(2048)");
	        		 }
	        		 
	        		 break;

	        	   case "v_Repetitions_2":

	        		 eval(arg[0]+ '=' + arg[1]);

	        		 if(arg[1]>1){
	        		 	  eval(arg[2] + ".setCanvasResolution(2048)");
	        		 }
	        		 
	        		 break;

					
					
	        		
			  	case "v_Show_Test_Image" :

				    console.log('showTestImage');

				    if(arg[1]){
				        loadStill('assets\\img\\earth.jpg')
				    }else{
				        clearCanvas();
				   	}
				   	break;
					
			  
			  
			  	case "v_Clear_Stage":

			      	eval(arg[2] + "." + arg[1]);

			      	break;
					

			  	case  "v_Panorama_Mirror":

			      
			      	break;
					

			  	case "v_Projection_Type":

			      switch(arg[1]){
			      	case 'Azimuthal Equidistant (Planetarium)':
			      		console.log('switch to Azimuthal Equidistant (Planetarium)');
			      		g_projectionRenderPlane.material = azimuthalEquidistantShaderMaterial;
			      		break; 
			      	case 'Gnomonic/Rectilinear (Flat screen)':
			      		console.log('witch to Gnomonic/Rectilinear (Flat screen)'); 
			      		g_projectionRenderPlane.material = gnomonicShaderMaterial;
			      		break; 
			      	case 'Stereographic (Small World)':
			      	     console.log('switch to Stereographic (Small World)'); 
			      	     g_projectionRenderPlane.material = stereographicShaderMaterial;
			      	     break;
			      	case 'Equirectangular (Source)':
			      		g_projectionRenderPlane.material = equirectangularShaderMaterial;

			      	default:
			      		console.log('switch to Azimuthal Equidistant (Planetarium)'); 
			      	}
			      	
					
			  
				default:

					if(arg[2]){
						//console.log(arg[2] + "." + arg[0]+ '=' + arg[1])
				        eval(arg[2] + "." + arg[0]+ '=' + arg[1]);

				    }else{


				    	//console.log("transmiting = " + arg[0]+ '=' + arg[1])
						eval(arg[0]+ '=' + arg[1]);
				    }
				      
					
				}
	
			});