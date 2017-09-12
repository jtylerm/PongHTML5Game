
exports.up = function(knex, Promise) {
 	return knex.raw('ALTER TABLE Leaderboard ' +
		'CHANGE intials initials CHAR(3);'
	);
};

exports.down = function(knex, Promise) {
  
};
