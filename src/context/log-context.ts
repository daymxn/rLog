/**
 * Intead, we'll migrate to a world where you don't create loggers per file, but create optional configs.
 *
 * Then, in function's, you'll start context by "using" those configs.
 *
 * Benefits:
 *  - We can inherit the default without needing people to face race conditions.
 *  - We can create a more strict definition and seperation between context, config, and loggers
 *  - It makes it easier in usage because you don't have `Logger` and `logger`. You'd just have `config` and `logger` or something like that
 *
 * We'll need to move some things to config though- like tags
 *
 * I just realized... rLog is really only meant for the server, huh? should note this somewhere
 * "Context based Server-Side logging for ROBLOX"
 */
