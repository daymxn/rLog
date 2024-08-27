# TODO()

- Remove deps/eslint/tsconfig settings that aren't needed
- Write a proper readme

## Future plans

- Seperate provided sinks into a sub package
- Support google cloud console logging
- Migrate tests to individual files
- Implement more refined serialization/assertions lib

## Contributing

If you're interested in contributing to **rLog**, you can use the following
commands to setup your development environment.

### Building

Use the `build` command to build the source files.

```sh
npm run build
```

Or `watch` to watch the source files.

```sh
npm run watch
```

### Running Tests

Start a watch for the test place.

```sh
npm run dev
```

Serve `test.project.json` with rojo and link with an empty base plate in roblox studio.

Finally, use the shortcut `ctrl` + `:` with the [Test EZ Companion](https://github.com/tacheometry/testez-companion) plugin
to run the tests.

### API Docs

API docs are built through the following tools:

`api-extractor` -> `api-documenter` -> post processing (`/scripts`) -> docusaurus (`/wiki`)

To host the `wiki` you'll need to scope to the `/wiki` directory and run the commands listed there.

For syncing the API, you can run the `api` command from the **rLog** root directory.

```sh
npm run api
```

This will automatically extract the api, generate the docs for it, perform post processing, and copy it
over to the wiki.
