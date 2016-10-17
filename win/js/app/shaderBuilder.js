function shaderBuilder(s1d,s2d){

	var baseShader = { 

	    defines: {
	        "K_VEL_DECAY": "0.99",
	        "K_INPUT_ACCEL": "2.0",
	        "K_TARGET_ACCEL": "0.2"
	    },

	    uniforms: {
	        "tPrev": { type: "t", value: null },
	        "tCurr": { type: "t", value: null },
	        "uDeltaT": { type: "f", value: 0.0 },
	        "uTime": { type: "f", value: 0.0 },
	        "uInputPos": { type: "v3v", value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
	        "uInputPosAccel": { type: "v4", value: new THREE.Vector4(0,0,0,0) },
	    },

	    vertexShader: Utils.loadTextFile("shaders/Basic.vs.glsl"),

	    fragmentShader: Utils.loadTextFile("shaders/Base.fs.glsl")

	};




	var createShaderMaterial = function(shader) {

    return new THREE.ShaderMaterial({
        defines: cloneDefines(shader.defines),
        uniforms: THREE.UniformsUtils.clone(shader.uniforms),
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    	});
	};


}