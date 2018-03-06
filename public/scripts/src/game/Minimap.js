class Minimap extends O876_Raycaster.Minimap {
	render() {
		this.updateSquares();
		this.renderSurface();
	}
}