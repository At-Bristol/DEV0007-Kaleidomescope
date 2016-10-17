
	  #ifdef GL_ES
	  precision highp float;
	  #endif

	  #define PI 3.1415926535897931
	  #define PI2 6.2831853071795862
				
		varying vec2 vTextureCoord;

		//Source 1

		uniform float u_FOV;
		uniform float u_Roll;

		uniform sampler2D tSource1;
		uniform sampler2D tSource2;
		

		uniform float u_phi1;
			uniform float u_lambda0;
			uniform float u_GuideOn;
			uniform float u_GuideOpacity;
			uniform float u_Repetitions;
			uniform float u_Panorama_FOV_Multiplier;

			uniform float u_CC_Hue;
			uniform float u_CC_Saturation;
			uniform float u_CC_Gamma;
		    uniform float u_CC_Value;
		    uniform float u_CC_Edge_Vingette;
		    uniform float u_CC_Fade;

			uniform float u_bmSpread;
			uniform float u_bmStrength; 

			uniform float u_BC_Blend;
			uniform float u_BC_Fade; 

			//Source 2

			uniform float u_FOV_2;
			uniform float u_Roll_2;

			uniform float u_phi1_2;
			uniform float u_lambda0_2;
			uniform float u_GuideOn_2;
			uniform float u_GuideOpacity_2;
			uniform float u_Repetitions_2;
			uniform float u_Panorama_FOV_Multiplier_2;

			uniform float u_CC_Hue_2;
			uniform float u_CC_Saturation_2;
			uniform float u_CC_Gamma_2;
		    uniform float u_CC_Value_2;
		    uniform float u_CC_Edge_Vingette_2;
		    uniform float u_CC_Fade_2;

			uniform float u_bmSpread_2;
			uniform float u_bmStrength_2; 

			uniform float u_BC_Blend_2;
			uniform float u_BC_Fade_2; 


			vec3 rgb2hsv(vec3 c){
			    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
			    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
			    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

			    float d = q.x - min(q.w, q.y);
			    float e = 1.0e-10;
			    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
			}

		vec3 hsv2rgb(vec3 c){
				    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
				    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
				    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
				}

		vec2 tc_ae(vec2 vTextureCoord , float lambda0, float repetitions, float phi1, float angleOfView){

			float x = PI2*(vTextureCoord.s - 0.5) * (angleOfView) ;
		    float y = PI2*(vTextureCoord.t - 0.5 ) * (angleOfView) ;

			float c = sqrt(x*x + y*y);
		    float phi = asin( cos(c)*sin(phi1) + y*sin(c)*cos(phi1)/c );
		    float lambda = lambda0 + atan( x*sin(c), (c*cos(phi1)*cos(c) - y*sin(phi1)*sin(c)));

			return vec2( (lambda /(PI*(2.0 / repetitions))) + 0.5, (phi/(PI)) + 0.5 );

		}


		
		void main() {
        
			float guideOpacity  = u_GuideOpacity/100.00;			    

			//source
		    float repetitions   = 	u_Repetitions;
		    float angleOfView 	= 	u_FOV/(360.0 / u_Panorama_FOV_Multiplier);
			float phi1       	=   ((u_phi1 +90.0 )* PI)/180.0;
			float lambda0       =   (u_lambda0 * PI )/180.0;

			//source2
			float repetitions_2  = 	u_Repetitions_2;
		    float angleOfView_2  = 	u_FOV_2/(360.0 / u_Panorama_FOV_Multiplier_2);
			float phi1_2       	 =  ((u_phi1_2 +90.0 )* PI)/180.0;
			float lambda0_2      =  (u_lambda0_2 * PI )/180.0;

			//coordinates
     		vec2 tc = tc_ae(vTextureCoord,lambda0, repetitions, phi1, angleOfView);
 		    vec2 tc2 = tc_ae(vTextureCoord,lambda0_2, repetitions_2, phi1_2, angleOfView_2);

		    float maskRadius	  = 	PI*-angleOfView;
		    float circle          =   pow(PI2*(vTextureCoord.s - 0.5) * (angleOfView)  , 2.0) + pow(PI2*(vTextureCoord.t - 0.5 ) * (angleOfView), 2.0) - pow(maskRadius , 2.0) ;
			float vingette        =   clamp(-circle*pow(2.0,u_CC_Edge_Vingette),0.0,1.0);

		    vec4 texSample        = 	texture2D(tSource1, tc);
		  
		     vec4 tex2Sample      = 	texture2D(tSource2, tc2);
		

		    float bmSpread        = pow(vTextureCoord.t * ((u_bmSpread/100.0)*3.0),1.5) * (u_bmStrength/100.0);


		   
		    vec4 backMask         =   vec4(bmSpread,bmSpread,bmSpread,bmSpread);  

		  	//color correction

		    vec3 hsv  =  rgb2hsv(texSample.rgb);

		    hsv = vec3(hsv.r + (u_CC_Hue/360.0), hsv.g *( u_CC_Saturation/50.0), hsv.b * u_CC_Value/50.0);

		    texSample.rgb = hsv2rgb(hsv);

		    texSample.rgb = vec3(pow(texSample.r, u_CC_Gamma),pow(texSample.g, u_CC_Gamma),pow(texSample.b, u_CC_Gamma)) * (u_CC_Fade/100.0);


		   //color correction

		    vec3 hsv2  =  rgb2hsv(tex2Sample.rgb);

		    hsv2 = vec3(hsv2.r + (u_CC_Hue_2/360.0), hsv2.g *( u_CC_Saturation_2/50.0), hsv2.b * u_CC_Value_2/50.0);

		    tex2Sample.rgb = hsv2rgb(hsv2);

		    tex2Sample.rgb = vec3(pow(tex2Sample.r, u_CC_Gamma_2),pow(tex2Sample.g, u_CC_Gamma_2),pow(tex2Sample.b, u_CC_Gamma_2)) * (u_CC_Fade_2/100.0);


		   //////

		   vec4 source1 = ((((texSample ) - backMask)   ) * vingette );
		   vec4 source2 = ((((tex2Sample ) - backMask)   ) * clamp(-circle*pow(2.0,u_CC_Edge_Vingette),0.0,1.0));

		   gl_FragColor	    = ((source1 * smoothstep(100.0, 0.0, u_BC_Blend)) + (source2 * smoothstep(0.0, 100.0, u_BC_Blend))) * smoothstep(0.0, 100.0, u_BC_Fade);//  + (source1);

           // gl_FragColor       =   vec4(1.0,1.0,0.0,1.0);
	    	
		  }