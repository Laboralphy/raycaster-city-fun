const Point = require('../Point');

class CollisionResolver {


	static checkRectVsRect(rectA, rectB) {
		let rap = rectA.points();
		let rbp = rectB.points();
		return rap[0].x < rbp[1].x && rap[1].x > rbp[0].x && rap[0].y > rbp[1].y && rap[1].y < rbp[0].y;
	}

	static checkCircleVsCircle(circA, circB) {
		let pA = circA.center()
		let d =
		let cap = circA
	}
}