# Background and Overview
I want to make some sort of vehicle to drive around a 3d world. It would be really cool to basically make it a portfolio, like you could visit certain places with examples of my work, but also have little activities to do. Example if it was a spaceship you could have a basic shooter game. I have a feeling it’s going to be hard enough figuring out how to use three.js and make the physics, so really all I would like to accomplish is having the user be able to control a spaceship or plane in space and have other 3d objects in that space.


# Functionality and MVP

In Fizzix, users will to start off in a spaceship and be able to ride around in the spaceship using the arrow keys shift and space to control the speed and where the ship is going. User will also be able to look at a 3d rendered map of the area they are exploring, to see what destination they would like to go to. In my 100% finished idea basically it would have different planets and bases that would hold smaller games or example of my portfolio work. I really want to use three.js to make a 3d map, three.js seems really rad.



# File Structure:


* /dist 

* Index.html
* .gitignore
* node_modules
* package.json
* package.lock.json
* postcss.config.js
* README.md
* webpack.common.js
* webpack.dev.js
* Webpack.prod.js

* /src/
	* assets/
		* 3d models if any
		* Music if any
	* index.js
	* js
		* scenes
		* cameras
		* vehicles
		* objects
		* planets
    
# Wire Frame

![wire frame](./src/images/wireframe.png)


# Architecture and Technology

My project is going to rely heavily on three.js, canvas, and javascript. The bulk of the rendering will be done with three.js. Javascript will be used to create the UI and conditionals of exploration and game like feature.

# Timeline
This project is going to be a real learning experience, I have done a good amoun tof animation and 3d mapping in the past, but never with coding. My goal and schedule is as follows.

### Monday - 10/12/20
Set up three.js, make basic moving ball action, which will eventually become the spaceship using keydown listeners. Make physics of movement fluid.

### Tuesday - 10/13/20
Start mapping 3d space with objects. Make a general layour of the map. Succefully be able to fly around the map. Design spaceship look. Add lights, perspective camera movements.

### Wednesday - 10/14/20
Try to implement the crahsing and shooting aspects of exploration.

### Thursday - 10/15/20
Polish up looks, keep trying to implement crashing and shooting.



