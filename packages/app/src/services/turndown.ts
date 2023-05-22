import TurndownService from "turndown"

let turndownService = new TurndownService({ headingStyle: "atx" })

turndownService.addRule("underline", {
  filter: "u",
  replacement: function (content) {
    return "__" + content + "__"
  },
})
turndownService.addRule("figure", {
  filter: function (node) {
    const isMatch = node.nodeName === "FIGURE" && node.innerHTML.trim() === "&nbsp;"
    console.log(`Checking node: ${node.outerHTML}, isMatch: ${isMatch}`)
    return isMatch
  },
  replacement: function () {
    console.log("Replacing figure node with divider")
    return "\n\n---\n\n"
  },
})

export default turndownService
