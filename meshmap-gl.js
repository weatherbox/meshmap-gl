class MeshmapGL {
    constructor (url){
        this.url = url;

        // options
        this.bounds = new mapboxgl.LngLatBounds([100, 7], [170, 61]);
        this.zooms = [2, 4, 6];
        this.opacity = 0.7;

        this.tiles = {};
    }
    
    addTo (map){
        this.map = map;
        this.init();
    }
    
    init (){
        this.update();

        var self = this;
        this.map.on("render", function(){
            self.update();
        });
    }

    getTileUrl (coord){
        return this.url + "zoom" + coord.z + "/" + coord.x + "_" + coord.y + ".png";
    }

    getTileBounds (coord){
        var tilew = (this.bounds.getEast() - this.bounds.getWest()) / Math.pow(2, coord.z);
        var west = this.bounds.getWest() + tilew * coord.x;
        var east = this.bounds.getWest() + tilew * (coord.x + 1);

        var tileh = (this.bounds.getNorth() - this.bounds.getSouth()) / Math.pow(2, coord.z);
        var north = this.bounds.getNorth() - tileh * coord.y;
        var south = this.bounds.getNorth() - tileh * (coord.y + 1);

        return [west, east, north, south];
    }

    addTile (coord){
        var url = this.getTileUrl(coord);
        var bounds = this.getTileBounds(coord);
        var id = ['tile', coord.z, coord.x, coord.y].join('-');

        if (this.tiles[id]) return;
        this.tiles[id] = true;

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

        this.map.addLayer({
            id: id,
            source: id,
            type: 'raster',
            paint: {
                'raster-opacity': this.opacity
            }
        }, 'admin-3-4-boundaries');
    }

    _getTileZoom (zoom){
        return (zoom <= 4) ? 2
             : (zoom <= 6) ? 4
             : 6;
    }

    update (){
        if (!this.map) { return; }

        var bounds = this.map.getBounds(),
            zoom = this.map.getZoom();

        var tileZoom = this._getTileZoom(zoom);
        var ntiles = Math.pow(2, tileZoom);
        var tilew = (this.bounds.getEast() - this.bounds.getWest()) / ntiles;
        var tileh = (this.bounds.getNorth() - this.bounds.getSouth()) / ntiles;

        var sw = new mapboxgl.LngLat(
            Math.max(0, Math.floor((bounds.getWest() - this.bounds.getWest()) / tilew)),
            Math.min(ntiles - 1, Math.floor((this.bounds.getNorth() - bounds.getSouth()) / tileh))
        );
        var ne = new mapboxgl.LngLat(
            Math.min(ntiles - 1, Math.floor((bounds.getEast() - this.bounds.getWest()) / tilew)),
            Math.max(0, Math.floor((this.bounds.getNorth() - bounds.getNorth()) / tileh))
        );
        var tileBounds = new mapboxgl.LngLatBounds(sw, ne);

        for (var x = tileBounds.getWest(); x <= tileBounds.getEast(); x++){
            for (var y = tileBounds.getNorth(); y <= tileBounds.getSouth(); y++){
                this.addTile({ z: tileZoom, x: x, y: y });
            }
        }
    }
}


