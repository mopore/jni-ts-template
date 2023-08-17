```
    ███        ▄████████   ▄▄▄▄███▄▄▄▄      ▄███████▄  ▄█          ▄████████     ███        ▄████████ 
▀█████████▄   ███    ███ ▄██▀▀▀███▀▀▀██▄   ███    ███ ███         ███    ███ ▀█████████▄   ███    ███ 
   ▀███▀▀██   ███    █▀  ███   ███   ███   ███    ███ ███         ███    ███    ▀███▀▀██   ███    █▀  
    ███   ▀  ▄███▄▄▄     ███   ███   ███   ███    ███ ███         ███    ███     ███   ▀  ▄███▄▄▄     
    ███     ▀▀███▀▀▀     ███   ███   ███ ▀█████████▀  ███       ▀███████████     ███     ▀▀███▀▀▀     
    ███       ███    █▄  ███   ███   ███   ███        ███         ███    ███     ███       ███    █▄  
    ███       ███    ███ ███   ███   ███   ███        ███▌    ▄   ███    ███     ███       ███    ███ 
   ▄████▀     ██████████  ▀█   ███   █▀   ▄████▀      █████▄▄██   ███    █▀     ▄████▀     ██████████ 
                                                      ▀                                               
```

Source for ASCII-fonts: https://www.coolgenerator.com/ascii-text-generator
(Font: Delta Corps Priest 1


# What is this?

This is template for TypeScript project in VS Code with linting.

# What's the motivation?

To have an easier start for my projects.

# Setup

## Development environment
For local development start with `pnpm i` to install all dependencies.
Use Visual Studio Code compilation command or `pnpm run build` to compile the project.
Use Visual Studio Code test command or `pnpm run test` to run the tests.
To simply run the project us the VS launch configuration or `pnpm run start`.

Launch configs of VS Code can be found in `.vscode/launch.json`.

## Docker Setup
To build a docker image use 
```bash
docker buildx build -t jni-ts-template . 
```
or run `pnpm run build-image`.

To run a temporary container from the image call: 
```bash
docker container run --rm jni-ts-template "test arg value"
```
or call `pnpm run run-container`.

Change the image name (here `jni-ts-template`) to your liking.

### Optional: Add an alias to run the docker container as an CLI tool
```bash
alias yourcommand='docker container run --rm jni-ts-template'
```

## Setting env variables (optional)
Place keys and environment variable values inside a .env file in the project's root folder. The `.env` fils is included in `.gitignore`.

```
TEST_VAR = "Test value"
```

# Update all packages to the latest version
`pnpm up --latest` to update all packages to the latest version.

# Add a package to the project
`pnpm add -D <package>` to add a package to the project. The `-D` flag is for development dependencies.


# How to use
Provide an adequate descrioption.

# Release History

## v0.7.0 (Untagged)
- Add optional package with test.
- Remove obsolete greeter code.


## v0.6.0
- Add docker image creation (e.g. for an encapsulated CLI rool).
- Add helpers for reading the version, parsing .env file and user arguments.

## v0.5.1
- Remove not used workspace configuration.

## v0.5.0
- Upgrade all components to latest versions.
- Use 'NodeNext' for module resolution.
- Replace 'npm' with 'pnpm'.
- Replace 'jest' with 'mocha'.

## v0.4.1
- Template restrictions removed in linting.
## v0.4.0
- NCU guide added to readme.
- Upgraded to latest versions of TypeScript (4.5.2), Jest (27.4.3) and the rest.

## v0.3.0
- Upgrade of TypeScript to 4.3

## v0.2.0
- Support for dotenv

## v0.1.0
- Initial commit.
