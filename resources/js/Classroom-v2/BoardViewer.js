export default class BoardViewer {
    constructor()
    {
        this.drawboard = document.getElementById('vr-db-0');
        this.canvas = document.createElement('canvas');

        this.drawboard.appendChild(this.canvas);
    }

    drawOnCanvas(draw)
    {
        const context = this.canvas.getContext('2d');
        const img = new Image();

        var self = this;

        img.onload = function() {
            self.canvas.width = draw.width;
            self.canvas.height = draw.height;

            context.drawImage(this, 0, 0);
        };

        img.src = draw.data;
    }
}