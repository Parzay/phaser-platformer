//@ts-check

export class EnemiesGroup {
	/**
	 * @param {Phaser.Physics.Arcade.Group} group
	 * @param {any[]} spawnLocations
	 */
	constructor(group, spawnLocations) {
		this.group = group;
		this.spawnLocations = spawnLocations;
		this.xDirection = 1;
	}

	spawn() {
		let spawn =
			this.spawnLocations[
				Phaser.Math.Between(0, this.spawnLocations.length - 1)
			];

		let enemy = this.group.create(spawn.x, spawn.y, "enemy");
		let vX = Phaser.Math.FloatBetween(50, 200) * this.xDirection;
		let vY = Phaser.Math.FloatBetween(50, 200);
		this.xDirection *= -1;

		enemy
			.setCollideWorldBounds(true)
			.setBounce(1.1)
			.setVelocity(vX, vY)
			.setCircle(60, 12, 14)
			.setScale(0.25);
		enemy.body.allowDrag = false;
		enemy.body.allowGravity = false;
		enemy.body.maxSpeed = 250;
	}
}
