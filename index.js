const config = require('./config'),
    chalk = require('chalk'),
    Discord = require('discord.js')

const client = new Discord.Client()

client.on('ready', () => {
    console.log('%s %s%s',
        chalk.yellow('Screen master is'),
        chalk.red('CONNECTED'),
        chalk.yellow('!')
    )
    client.user.setPresence({
        'game': {
            'name': 'your screen',
            'type': 3
        }
    })
})

client.login(config.token)
