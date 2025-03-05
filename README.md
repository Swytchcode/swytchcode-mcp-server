# Swytchcode MCP server
[Model Context Protocol (MCP)](https://docs.anthropic.com/en/docs/agents-and-tools/mcp) server implementation  to interact with Swytchcode.

## Index
1. [Requirements](#requirements)
2. [Obtain Swytchcode API Key](#obtain-swytchcode-api-key)
3. [Installation](#installation)
4. [Configuration with Claude Desktop](#configuration-with-claude-desktop)
    - [Mac/Linux](#maclinux)
    - [Windows](#windows)
5. [Invoking from Claude Desktop](#invoking-from-claude-desktop)

    

## Requirements
* [Node.js](https://nodejs.org/en)
* _SWYTCHCODE_API_KEY_: To interact with Sywtchcode APIs, you'll need to have an [account with Swytchcode](https://docs.swytchcode.com/quickstart/account/).

## Obtain Swytchcode API Key

Run the following command to obtain the Swytchcode API key
```sh
# Permissions
chmod +x api_key.sh

# Execute script
./api_key.sh
```


Rename `.env.sample` file to `.env` and paste the obtained key

```sh
SWYTCHCODE_API_KEY=YOUR_API_KEY
```

## Installation

```sh
cd swytchcode-mcp-server

# install dependencies
npm install

# build project
npm run build
```


## Configuration with Claude Desktop

### Mac/Linux
Open the file with any code editor. We are using VSC in our case
```
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

and paste the following after modifying the path to your script

```json
{
    "mcpServers": {
        "swytchcode": {
            "command": "node",
            "args": [
                "/ABSOLUTE/PATH/TO/PARENT/FOLDER/swytchcode-mcp-server/build/index.js"
            ]
        }
    }
}
```

### Windows

Open the following file

```sh
code $env:AppData\Claude\claude_desktop_config.json
```

and paste the following after modifying the path to your script

```json
{
    "mcpServers": {
        "swytchcode": {
            "command": "node",
            "args": [
                "C:\\PATH\\TO\\PARENT\\FOLDER\\swytchcode-mcp-server\\build\\index.js"
            ]
        }
    }
}
``` 

## Invoking from Claude Desktop

Restart Calude Desktop after the changes are made to the `claude_desktop_config.json` file. You should now see 2 new tools installed

1. *swytchcode-generate-code*
2. *swytchcode-list-options*

Try running the following command
```
list workflows stripe:v3 *
```
If you see an output, then congratulations! you have installed Swytchcode MCP server successfully 🎉🎉

You can find all the [available commands here](https://docs.swytchcode.com/guides/commands/)

