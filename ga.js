"use strict";

var levenshtein = require('./levenshtein').levenshtein;
var format = require('util').format;

var randomChar = function(minrange, maxrange) {
	var rangelength = maxrange - minrange;
	return String.fromCharCode(Math.floor(Math.random()*rangelength) + minrange);
};

var createGeneWithRange = function(length,minrange,maxrange){
	var gene = '';
	for (var i = 0; i < length; i++) {
   		gene += randomChar(minrange,maxrange);
   	};
   	return gene;
};

var createGene = function(length){
	return createGeneWithRange(length,65,90);
};

var initGenePool = function (number) {
	var stringArray = [];
	for (var i = 0; i < number; i++) {
		stringArray.push(createGene(10));
	};
	return stringArray;
};

var mutate = function (mutationRate, gene) {
	var mutated = "";
	for (var i = 0; i < gene.length; i++ ) {
		var dice = Math.random();
		if (dice < (mutationRate / 2)) {
			// Drop == noop.
		} else if (dice < mutationRate) {
			mutated += randomChar(65,90);
			mutated += gene.substr(i, 1);
		} else {
			mutated += gene.substr(i, 1);
		}
	}
	return mutated;
};

var breed = function (gene1, gene2) {
	var window = 3;
	var chosenGene = (Math.random() < 0.5) ? gene1 : gene2;
	if (chosenGene.length <= window) {
		return chosenGene;
	}

	return chosenGene.substr(0, window) + breed(
		gene1.substr(window),
		gene2.substr(window)
	);
};

var fitness = function (gene, target) {
	return levenshtein(gene,target);
};

var rank = function (pool, target) {
	return pool.sort(function (gene1,gene2) {
		return fitness(gene1,target) - fitness(gene2,target);
	});
};

var evolve = function (pool, target) {
	var ranked = rank(pool, target);
	console.log(format("%s has a fitness of %d", ranked[0], fitness(ranked[0], target)));
	var nextGeneration = [];
	nextGeneration.push(breed(ranked[0], ranked[1]));
	nextGeneration.push(breed(ranked[0], ranked[2]));
	nextGeneration.push(breed(ranked[0], ranked[3]));
	nextGeneration.push(breed(ranked[0], ranked[4]));
	nextGeneration.push(breed(ranked[1], ranked[2]));
	nextGeneration.push(breed(ranked[1], ranked[3]));
	nextGeneration.push(breed(ranked[1], ranked[4]));
	nextGeneration.push(createGene(10));
	nextGeneration.push(createGene(10));

	nextGeneration = nextGeneration.map(function (gene) {
		return mutate(0.1, gene);
	})

	nextGeneration.unshift(ranked[0]);
	nextGeneration.unshift(ranked[1]);

	return nextGeneration;
};

var main = function (target) {
	var gen = initGenePool(10);

	var next = evolve(gen, target);
	var i = 0;
	while( fitness(next[0],target) != 0) {
		next = evolve(next, target);
		i++;
	}
	console.log("Convergence took " + i + " iterations.");
	return next;
};

main("CROWNANCHOR");
