//Class to handle what keys are down and which aren't
class KeyInput {
    constructor(element) {
        element = element? element:document.body;
        var keys = []; //Array of numbers corresponding to keys currently being pressed

        element.addEventListener('keydown', function(event) {
            if (keys.indexOf(event.keyCode) == -1) keys.push(event.keyCode); //Add the key if it does not already exist
        });

        element.addEventListener('keyup', function(event) {
            keys.splice(keys.indexOf(event.keyCode), 1); //Remove the key from the array
        });

        this.isKeyPressed = function(character) {
            if (typeof character == "string") { //If the character is a string get its keyCode
                var characters = character.split('|');
                for (var i = 0; i < characters.length; i++) {
                    var code = characters[i].toUpperCase().charCodeAt(0);
                    return keys.indexOf(code) != -1;
                }
            } else return keys.indexOf(character) != -1; //If the key is in the array then it is being pressed
        }
    }
}