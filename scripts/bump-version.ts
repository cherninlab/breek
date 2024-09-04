import { $ } from 'bun'

async function bumpVersion() {
    // Check for uncommitted changes
    const status = await $`git status --porcelain`.quiet();
    if (!!status.text() && !process.env.FORCE) {
        console.error("There are uncommitted changes. Commit them before releasing or run with FORCE=true.");
        process.exit(1);
    }

    // Get version from command line argument
    const newVersion = Bun.argv[2];
    if (!newVersion) {
        console.error("Please provide a version number.");
        process.exit(1);
    }

    // Update package.json
    const packageJson = await Bun.file("./package.json").json();
    packageJson.version = newVersion;
    await Bun.write("./package.json", JSON.stringify(packageJson, null, 2));

    console.log(`Updated version to ${newVersion} in package.json`);
}

bumpVersion().catch(console.error);