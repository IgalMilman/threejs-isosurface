
THREE.IsosurfaceGeometry = function(dims, map, bounds) {

    THREE.Geometry.call( this );

    var result = isosurface.marchingCubes(dims, map, bounds)

    var v, f;

    for (var i = 0; i < result.positions.length; ++i) {
        v = result.positions[i];
        this.vertices.push(new THREE.Vector3().fromArray(v));
    }

    for (var i = 0; i < result.cells.length; ++i) {
        f = result.cells[i];
        if (f.length === 3) {
            this.faces.push(new THREE.Face3(f[0], f[1], f[2]));
        } else if (f.length === 4) {
            this.faces.push(new THREE.Face3(f[0], f[1], f[2]));
            this.faces.push(new THREE.Face3(f[0], f[2], f[3]));
        }
    }

    this.mergeVertices();

    var s = 0.001;
    var tinyChangeX = new THREE.Vector3( s, 0, 0 );
    var tinyChangeY = new THREE.Vector3( 0, s, 0 );
    var tinyChangeZ = new THREE.Vector3( 0, 0, s );

    var upTinyChangeInX, upTinyChangeInY, upTinyChangeInZ;
    var downTinyChangeInX, downTinyChangeInY, downTinyChangeInZ;
    var tinyChangeInX, tinyChangeInY, tinyChangeInZ;

    var vertexNormals = [];
    var normal;

    for (var i = 0; i < geometry.vertices.length; ++i) {
        vertex = geometry.vertices[i];

        upTinyChangeInX   = modelVector( vertex.clone().add(tinyChangeX) ); 
        downTinyChangeInX = modelVector( vertex.clone().sub(tinyChangeX) ); 
        tinyChangeInX = upTinyChangeInX - downTinyChangeInX;

        upTinyChangeInY   = modelVector( vertex.clone().add(tinyChangeY) ); 
        downTinyChangeInY = modelVector( vertex.clone().sub(tinyChangeY) ); 
        tinyChangeInY = upTinyChangeInY - downTinyChangeInY;

        upTinyChangeInZ   = modelVector( vertex.clone().add(tinyChangeZ) ); 
        downTinyChangeInZ = modelVector( vertex.clone().sub(tinyChangeZ) ); 
        tinyChangeInZ = upTinyChangeInZ - downTinyChangeInZ;
        
        normal = new THREE.Vector3(tinyChangeInX, tinyChangeInY, tinyChangeInZ);
        normal.normalize();
        vertexNormals.push(normal);
    }

    for (var i = 0; i < geometry.faces.length; ++i) {
        f = geometry.faces[i];
        f.vertexNormals = [
            vertexNormals[f.a],
            vertexNormals[f.b],
            vertexNormals[f.c]
        ];
    }
};

THREE.IsosurfaceGeometry.prototype = Object.create( THREE.Geometry.prototype );
THREE.IsosurfaceGeometry.prototype.constructor = THREE.IsosurfaceGeometry;
