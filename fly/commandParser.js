class Command {
    constructor(name, regex, callback) {
        this.name = name;
        this.regex = regex;
        this.callback = callback;
    }
}

class CommandParser {
    constructor(commands) {
        this.commands = commands;
    }

    parse(string) {
        var parts = string.split(' '),
            name = parts[0].substring(1, parts[0].length),
            params = parts.slice(1, parts.length),
            regex = params.join(' ');
 
        for (var i = 0; i < this.commands.length; i++) {
            var command = this.commands[i];
            if (command.name == name && command.regex.test(regex)) {
                try {
                    return command.callback(params);
                } catch {
                    return 'ERROR: Command callback error'
                }
            }
        }
        return 'ERROR: Command not found'
    }
}