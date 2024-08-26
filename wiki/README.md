# rLog website

The website for rLog.

Built with docusaurus.

```sh
npm run start
```

You can use `--no-open` to avoid opening a web page on start.

```sh
npm run start -- --no-open
```

## API docs

The API docs are built from the root **rLog** project directory
with an npm script.

```sh
npm run api
```

If you have the website in watch mode, it might cause a stack overflow if you
rebuild the api at the same time. To fix this, you'll have to stop watching, build the api
docs, and start watching again.

## Future plans

- Update when support for google cloud logging is added
- Possibly seperate provided sinks into their own package
- Auto deploy workflow
- Custom domain
