import { MeshBVH } from "three-src";

export function trimWhiteSpaces(input: string) {
    return input.split(' ').join('');
  }



  
export function computeBoundsTree(options) {

	this.boundsTree = new MeshBVH(this, options);
	return this.boundsTree;

}