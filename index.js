import { js2xml, xml2js } from "xml-js"
import fs from "fs"
import { glob } from "glob"

async function giveFileNames() {
    return await glob("xml-files/**/*.xml", { ignore: "node_modules/**" })
}

async function main() {
    const xmlpaths = await giveFileNames()
    let output = null
    let urls = [];

    for await (const path of xmlpaths) {
        const xml = await fs.readFile(path, "utf-8")
        const result = await xml2js(xml, { ignoreComment: true, compact: true })

        if (output === null) {
            output = result
        }
        urls = urls.concat(result.urlset.url)
    }
    output.urlset.url = urls
    const result = await js2xml(output, { spaces: 2, compact: true })
    await fs.writeFile("output.xml", result)

}

main()

