function generateSquareMaze(dimension) {

var maze = [

	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,0,1,1,1,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],


	[1,0,0,0,0,0,0,1,0,0,1,1,1,0,1],
	[1,0,1,1,1,1,1,1,1,0,1,0,0,0,1],
	[1,0,1,0,0,0,0,1,0,0,1,0,1,1,1],
	[1,0,1,0,0,0,1,1,0,1,1,0,0,0,1],
	[1,0,1,1,1,0,1,0,0,1,0,0,1,0,1],


	[1,0,0,0,1,0,1,0,1,1,1,1,1,0,1],
	[1,1,1,0,1,0,0,0,1,0,0,0,0,0,1],
	[1,0,1,0,0,0,1,0,1,1,0,1,1,1,1],
	[1,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]


    // Initialize the field.
    var field = new Array(dimension);
    field.dimension = dimension;
    for(var i = 0; i < dimension; i++) {
        field[i] = new Array(dimension);
        for (var j = 0; j < dimension; j++) {
        	if (maze[i][j] == true){
            	field[i][j] = true;
            }
            else{
            	field[i][j] = false;
        	}
   	 	}
    }

    return field;

}


