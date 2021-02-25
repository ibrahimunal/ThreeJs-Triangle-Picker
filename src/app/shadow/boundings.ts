import * as THREE from "three";
import { BufferGeometry } from "three";
import { computeBoundsTree, MeshBVH } from "three-src";

export { } // this will make it module

// interface BufferGeometry {
//     computeBoundsTree(): MeshBVH;
// }

// BufferGeometry.prototype.computeBoundsTree = function(options) {
        
//     this.boundsTree = new MeshBVH(this, options);
//     return this.boundsTree;
    
// }

    // declare module 'three' {
    //     export interface BufferGeometry {
    //         computeBoundsTree(): MeshBVH;
    //     }
    //   }
    // BufferGeometry.prototype.computeBoundsTree = function(options) {
        
    //     this.boundsTree = new MeshBVH(this, options);
    //     return this.boundsTree;
        
    // }

    declare global { // this is important to access it as global type String
        interface BufferGeometry {
            computeBoundsTree(options: any): MeshBVH;
        }
        }
      
      
    BufferGeometry.prototype.computeBoundsTree = function (options) {

	this.boundsTree = new MeshBVH(this, options);
	return this.boundsTree;

}

    declare global { // this is important to access it as global type String
    interface BufferGeometry {
        disposeBoundsTree(): null;
    }
    }

    BufferGeometry.prototype.disposeBoundsTree= function() {

	this.boundsTree = null;

}

    
    //test prototype-1 
    declare global { // this is important to access it as global type String
    interface String {
    capitalizeFirstLetter(): string;
    }
    }

    //test prototype-2
    declare global { // this is important to access it as global type String
        interface String {
            specialToUpperCase(): string;
        }
        }

    String.prototype.capitalizeFirstLetter = function() {
        console.log("Hello World from capitalizeFirstLetter");
    return this.charAt(0).toUpperCase() + this.slice(1);
    }


    String.prototype.specialToUpperCase = function() {
        console.log("Hello World from capitalizeFirstLetter");
    return this.toUpperCase();
    }