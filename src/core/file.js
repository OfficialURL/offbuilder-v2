import LinkedListNode from "../classes/linkedListNode.js";
import Caret from "../classes/caret.js";
import { dimensions_nud } from "./domElements.js";
import coordinates from "./coordinates.js";

export function exportCoordinates() {
	let txt = dimensions_nud.value + '\n';

	const values = Object.values(coordinates.dictionary),
		len = values.length;

	txt += len + '\n';

	for(let i = 0; i < len; i++)  {
		const point = values[i];

		for(let j = 0; j < point.length; j++)
			txt += point[j] + ' ';
		txt += '\n';
	}

	saveFile(txt, 'polytope_input.txt', 'text/plain');
}

const elementNames = [ "Vertices", "Edges", "Faces", "Cells", "Tera", "Peta", "Exa", "Zetta", "Yotta" ];

export const importCoordinates = function(event) {
	//Loads header info, declares some variables.
	const caret = new Caret(event.target.result),
		dim = caret.readNumber(),
		vertexCount = caret.readNumber(),
		facetCount = caret.readNumber(),
		ridgeCount = caret.readNumber(),
		elementList = [[]];

	//Reads the output file, gets the elements.

	//Reads vertices.
	for(let i = 0; i < vertexCount; i++) {
		elementList[0].push([]);
		for(let j = 0; j < dim; j++)
			elementList[0][i].push(caret.readNumber());
	}

	//Reads facets.
	elementList[dim - 1] = [];
	for(let i = 0; i < facetCount; i++) {
		const elCount = caret.readNumber();
		const facet = [];

		for(let j = 0; j < elCount; j++)
			facet.push(caret.readNumber());
		elementList[dim - 1].push(facet.sort((a, b) => {return a - b;}));
	}

	//Generates (d - 1)-dimensional elements out of d-dimensional elements.
	//At the same time, rewrites d-elements in terms of them.
	for(let d = dim - 1; d >= 2; d--) {
		elementList[d - 1] = [];
		const newElements = [];
		for(let i = 0; i < elementList[d].length; i++)
			newElements[i] = [];

		//Two d-dimensional elements have a common face iff they have at least d common vertices
		//NOT CONTAINED IN (d-2)-DIMENSIONAL SPACE (this code won't yet work for 5D!)
		for(let i = 0; i < elementList[d].length; i++)
			for(let j = i + 1; j < elementList[d].length; j++) {
				const commonElements = common(elementList[d][i], elementList[d][j]);

				if(commonElements.length >= d && (d <= 4 || rankstuff())) {
					//Checks that the element has not been added before.
					const duplicate = checkDuplicate(elementList[d - 1], commonElements, equal);

					//If not, adds the element to the element list and the corresponding parent elements.
					if(duplicate === -1) {
						const idx = elementList[d - 1].length;
						newElements[i].push(idx);
						newElements[j].push(idx);
						elementList[d - 1].push(commonElements);
					}
					//Otherwise, only adds the element to the corresponding parent elements.
					else {
						if(newElements[i].indexOf(duplicate) === -1)
							newElements[i].push(duplicate);
						if(newElements[j].indexOf(duplicate) === -1)
							newElements[j].push(duplicate);
					}
				}
			}

		elementList[d] = newElements;
	}

	//Faces are currently in terms of their edges.
	//We convert them to an ordered vertex representation.
	for(let f = 0; f < elementList[2].length; f++) {
		const edges = elementList[1];
		const face = elementList[2][f];
		const linkedList = [];

		for(let i = 0; i < face.length; i++) {
			const edge = edges[face[i]];

			for(let j = 0; j <= 1; j++) {
				const vertex = edge[j];

				if(!linkedList[vertex])
					linkedList[vertex] = new LinkedListNode(vertex);
			}

			linkedList[edge[0]].linkTo(linkedList[edge[1]]);
		}

		//Gets the cycle starting from whatever of the face's vertices.
		elementList[2][f] = linkedList[edges[face[0]][0]].getCycle();
	}

	//Writes the OFF file.

	//nOFF
	let txt = '';
	if(dim != 3)
		txt += dim;
	txt += 'OFF\n';

	//# Vertices, Faces, Edges, ...
	txt += '# ' + elementNames[0];
	if(dim >= 3)
		txt += ', ' + elementNames[2];
	if(dim >= 2)
		txt += ', ' + elementNames[1];
	for(let i = 3; i < dim; i++)
		txt += ', ' + elementNames[i];
	txt += '\n';

	//The corresponding numbers.
	txt += elementList[0].length;
	if(dim >= 3)
		txt += ' ' + elementList[2].length;
	if(dim >= 2)
		txt += ' ' + elementList[1].length;
	for(let i = 3; i < dim; i++)
		txt += ' ' + elementList[i].length;
	txt += '\n\n';

	//Vertices.
	txt += '# ' + elementNames[0] + '\n';
	for(let i = 0; i < elementList[0].length; i++) {
		const vertex = elementList[0][i];
		txt += vertex[0];

		for(let j = 1; j < dim; j++)
			txt += ' ' + vertex[j];
		txt += '\n';
	}

	//The rest of the elements.
	for(let d = 2; d < dim; d++) {
		txt += '\n# ' + elementNames[d] + '\n';
		for(let i = 0; i < elementList[d].length; i++) {
			const el = elementList[d][i];
			let len = el.length;
			txt += len;

			for(let j = 0; j < len; j++)
				txt += ' ' + el[j];
			txt += '\n';
		}
	}

	saveFile(txt, 'polytope.off', 'application/off');
}

function rankstuff() {
	return true;
}

const dl_a = document.getElementById('dl-a');
function saveFile(txt, fileName, mimeType) {
	const blob = new Blob([txt], {type: mimeType});

	if(window.navigator.msSaveOrOpenBlob)
		window.navigator.msSaveOrOpenBlob(blob, filename);
	else {
		dl_a.href = window.URL.createObjectURL(blob);
		dl_a.download = fileName;
		dl_a.click();
	}
}

"use strict";


//Returns the common elements of two sorted arrays.
//el1: number[]
//el2: number[]
//returns: number[]
function common(el1, el2) {
	const common = [];
	let m = 0, n = 0;

	while(m < el1.length && n < el2.length) {
		if(el1[m] < el2[n])
			m++;
		else if(el1[m] > el2[n])
			n++;
		else
			common.push(el1[m++]);
	}

	return common;
}

//Checks whether an array has already been added to another.
//Returns -1 if not, the index otherwise.
//els: number[]
//elList: number[][]
//equal: (number[], number[]) => boolean
//returns: number
function checkDuplicate(elList, els, equal) {
	for(let i = 0; i < elList.length; i++)
		if(equal(els, elList[i]))
			return i;

	return -1;
}

//Checks whether two arrays are equal.
//el1: number[]
//el2: number[]
//returns: boolean
function equal(el1, el2) {
	if(el1.length != el2.length)
		return false;

	for(let i = 0; i < el1.length; i++)
		if(el1[i] != el2[i])
			return false;

	return true;
}