const config = require('./config'),
    chalk = require('chalk'),
    Discord = require('discord.js'),
    screenshot = require('screenshot-desktop')

const client = new Discord.Client()

let lastMessageChannel = ''
let streamSource = {}

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

client.on('message', async msg => {
    if (!msg.author.bot) {
        if (msg.channel.id !== lastMessageChannel) {
            switch(msg.channel.type) {
                case 'text': {
                    console.log('Guild: %s',
                        chalk.green(msg.guild.name)
                    )
                    console.log('Channel: %s',
                        chalk.green(msg.channel.name)
                    )
                    break
                }
                case 'dm': {
                    console.log('DM with: %s',
                        chalk.green(msg.channel.recipient.username)
                    )
                    break
                }
                case 'group': {
                    console.log('Group DM: %s',
                        chalk.green(msg.channel.name)
                    )
                    break
                }
                default: {
                    console.log('%s: %s',
                        chalk.bgBlue.bold(
                            'MESSAGE SENT IN UNRECOGNIZED CHANNEL TYPE'
                        ),
                        chalk.red(msg.channel.type)
                    )
                }
            }
            lastMessageChannel = msg.channel.id
        }

        console.log('%s: %s',
            chalk.red(msg.author.username),
            chalk.magenta(msg.content)
        )

        if (config.hostID === msg.author.id && msg.content.startsWith(']')) {
            msg.delete()
            switch (msg.content.slice(1)) {
                case 'start': {
                    console.log('%s %s',
                        chalk.red('Starting stream for'),
                        chalk.blue(msg.author.username)
                    )
                    msg.guild.createChannel(msg.author.tag + '\'s Screen')
                        .then( channel => {
                            streamSource[msg.author.id] = channel.id
                            let imageSender = setInterval( () => {
                                if (streamSource[msg.author.id]) {
                                    screenshot()
                                        .then( img => {
                                            channel.send({
                                                'files': [{
                                                    'attachment': img,
                                                    'name': 'screenshot.jpg'
                                                }]
                                            })
                                        })
                                } else {
                                    clearInterval(imageSender)
                                }
                            }, 2000)
                        })
                        .catch(err => {
                            msg.reply('Failed to create channel: ' + err)
                        })
                    break
                }
                case 'end': {
                    console.log('%s %s',
                        chalk.red('Terminating stream for'),
                        chalk.blue(msg.author.username)
                    )
                    let channel = msg.guild.channels.get(
                        streamSource[msg.author.id]
                    )
                    console.log('%s: %s',
                        chalk.red('Found channel'),
                        chalk.yellow(channel.name)
                    )
                    delete streamSource[msg.author.id]
                    channel.delete()
                    break
                }
            }
        }
    }
})

process.on('SIGINT', () => handleExit(client))
process.on('SIGTERM', () => handleExit(client))

function handleExit(client) {
    console.log(chalk.yellow('Terminating client...'))
    client.destroy()
        .then(process.exit())
}
client.login(config.token)
