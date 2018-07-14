const config = require('./config'),
    chalk = require('chalk'),
    Discord = require('discord.js')

const client = new Discord.Client()

let lastMessageChannel = ''

/*
 * 1. Receive message with start command from host
 * 2. Create new channel in that guild
 * 3. Take screenshots and send them in that channel
 * 4. Until host sends stop command -> delete channel
 */

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
    }
})

client.login(config.token)
