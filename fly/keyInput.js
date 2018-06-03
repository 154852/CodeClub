class KeyInput {
    constructor(element) {
        element = element? element:document.body;
        var keys = [];

        element.addEventListener('keydown', function(event) {
            if (keys.indexOf(event.keyCode) == -1) keys.push(event.keyCode);
        });

        element.addEventListener('keyup', function(event) {
            keys.splice(keys.indexOf(event.keyCode), 1);
        });

        this.isKeyPressed = function(character) {
            var code;
            if (typeof character == "string")
                code = character.toUpperCase().charCodeAt(0);
            else code = character;
            
            return keys.indexOf(code) != -1;
        }
    }
}