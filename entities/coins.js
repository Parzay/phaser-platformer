//@ts-check

import { ASSET_KEYS, TILE_SIZE, WIDTH } from "../constants";

export class CoinsGroup {
	/**
	 * @param {Phaser.Physics.Arcade.Group} group
	 */
	constructor(group) {
		this.group = group;
		this.coinCount = 12;
		this.spawnXY = {
			x: TILE_SIZE * 4,
			y: 0,
			stepX: WIDTH / (this.coinCount - 1),
		};

		this.#initSpawn();
	}

	#initSpawn() {
		this.group.createFromConfig({
			key: ASSET_KEYS.coin,
			quantity: this.coinCount,
			setXY: {
				x: this.spawnXY.x,
				y: this.spawnXY.y,
				stepX: this.spawnXY.stepX,
			},
			setScale: { x: 0.25, y: 0.25 },
		});

		this.group.children.iterate(
			//@ts-ignore each child will be a Phaser.Physics.Arcade.Body
			(/** @type {Phaser.Physics.Arcade.Body} */ coin) => {
				coin
					.setCircle(40)
					.setCollideWorldBounds(true)
					.setBounce(Phaser.Math.FloatBetween(0.4, 0.8))
					.setVelocityX(Phaser.Math.FloatBetween(-10, 10));

				return true;
			}
		);
	}

	respawn() {
		if (this.group.countActive()) {
			// if the active count is "truthy" (not zero)
			// return, since we have active coins still
			return;
		}

		// set starting x position
		let { x, y, stepX } = this.spawnXY;

		this.group.children.iterate((c) => {
			//@ts-ignore enableBody is available on c
			c.enableBody(true, x, y, true, true);
			x += stepX;
			return true;
		});
	}
}
