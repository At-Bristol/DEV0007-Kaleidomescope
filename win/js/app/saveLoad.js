
function __loadFile(){

      //dialog.showOpenDialog(function(fileName){ 
       	 console.log('fileName[0]');
    	//};

}



function __saveAs(){

	console.log('__saveAs');



	//gui.saveToLocalStorage(fileName);


}


function __save(){

	console.log('__save');


	
}


function __load(){

	   __loadFile();


		console.log('__load	');

	
}





/*


function __loadFile() {

     
      dialog.showOpenDialog(function(fileName){ 
        console.log(fileName[0]);

        fs.readFile(fileName[0], 'utf8', (err, data) => {
          if (err) throw err;
          data = JSON.parse(data);

          var key = Object.keys(data.remembered)[1];
          

          console.log( data.remembered[key][0]);

          data = data.remembered[key][0];

          for(entry in data){

          	console.log(entry)

          }

		}

	}
  */