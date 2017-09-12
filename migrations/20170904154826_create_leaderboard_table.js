
exports.up = function(knex, Promise) {
	return knex.raw('CREATE TABLE Leaderboard (' +
		'ID INT NOT NULL AUTO_INCREMENT,' +
	    'initials CHAR(3) NOT NULL,' +
	    'score INT NOT NULL,' +
	    'difficulty CHAR(1) NOT NULL,' +
	    'createdTimestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
	    'PRIMARY KEY(ID)' +
		');'
	);
};

exports.down = function(knex, Promise) {
  
};
