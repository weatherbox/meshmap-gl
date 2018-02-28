class MeshmapGL {
    constructor (url){
        this.url = url;

        // options
        this.bounds = [[100, 7], [170, 61]];
        this.zooms = [2, 4, 6];
        this.opacity = 0.7;
    }
    
    addTo (map){
        this.map = map;
        this.init();
    }

    getTileUrl (coord){
        return this.url + "zoom" + coord.z + "/" + coord.x + "_" + coord.y + ".png";
    }

    getTileBounds (coord){
        var tilew = (this.bounds[1][0] - this.bounds[0][0]) / Math.pow(2, coord.z);
        var west = this.bounds[0][0] + tilew * coord.x;
        var east = this.bounds[0][0] + tilew * (coord.x + 1);

        var tileh = (this.bounds[1][1] - this.bounds[0][1]) / Math.pow(2, coord.z);
        var north = this.bounds[1][0] - tileh * coord.y;
        var south = this.bounds[1][0] - tileh * coord.y;

        return [west, east, north, south];
    }

    addTile (coord){
        var url = this.getTileUrl(coord);
        var bounds = this.getTileBounds(coord);
        var id = ['tile', coord.z, coord.x, coord.y].join('-');

        this.map.addSource(id, {
            type: 'image',
            url: url,
            coordinates: [
                [bounds[0], bounds[2]],
                [bounds[1], bounds[2]],
                [bounds[1], bounds[3]],
                [bounds[0], bounds[3]]
            ]
        });
    }

    init (){
        this.addTile({ z: 4, x: 6, y: 7 });
    }
}


