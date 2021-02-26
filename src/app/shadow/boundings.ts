import * as THREE from "three";
import { BufferGeometry } from "three";
import { computeBoundsTree, MeshBVH } from "three-src";

export { } // this will make it module

declare global{
    interface BufferGeometry {
    computeBoundsTree(options:any): MeshBVH;
}
}

BufferGeometry.prototype.computeBoundsTree = function() {
        
    this.boundsTree = new MeshBVH(this);
    return this.boundsTree;
    
}

    // declare module 'three' {
    //     export interface BufferGeometry {
    //         computeBoundsTree(): MeshBVH;
    //     }
    //   }

    declare global {
        interface String {
          padZero(length: number): string;
        }
      }
      
      String.prototype.padZero = function (length: number) {
        let d = String(this)
        while (d.length < length) {
          d = '0' + d;
        }
        return d;
      };
      
 

    // declare global { // this is important to access it as global type String
    //     interface BufferGeometry {
    //         computeBoundsTree(options: any): MeshBVH;
    //     }
    //     }
      
    // BufferGeometry.prototype.computeBoundsTree = function(options) {
        
    //         this.boundsTree = new MeshBVH(this, options);
    //         return this.boundsTree;
            
    //     }

    
    //test prototype-1 
    declare global { // this is important to access it as global type String
    interface String {
    capitalizeFirstLetter(): string;
    }
    }

    String.prototype.capitalizeFirstLetter = function() {
        console.log("Hello World from capitalizeFirstLetter");
    return this.charAt(0).toUpperCase() + this.slice(1);
    }


    //test prototype-2
    declare global { // this is important to access it as global type String
        interface String {
            specialToUpperCase(): string;
        }
        }



    String.prototype.specialToUpperCase = function() {
        console.log("Hello World from capitalizeFirstLetter");
    return this.toUpperCase();
    }