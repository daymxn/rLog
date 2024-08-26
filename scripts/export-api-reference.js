#!/usr/bin/env node
import { readdir } from "fs-extra";

/**
 * Transformations that need to occurr:
 * - Remove the first line (<!===)
 * - convert X.Y to X/Y
 * - remove the breadcrumbs (docasarus already has one if the folder dir is right)
 * - something to fix the overloads being in different files
 * - file name to the actual name (rlog.rlogconfig -> RLogConfig)
 * - underscores might be broken? _where_ came out as literally "_where_" in sourcemetadata
 *
 * We should checkout other doc generation projects too (like how does typedoc look)
 */

/**
 * Ideal world docs:
 * - Static method is a seperate section
 * - Constructors look better?
 *
 * Can we make types in code blocks clickable?
 */

// I'll have to migrate my types to interfaces probably. `types` seems to exclude the properties in the generated docs
async function main() {
	const files = await readdir("./docs/api");
	for (const file of files) {
	}
}
