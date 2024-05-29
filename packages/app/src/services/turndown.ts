import TurndownService from "turndown"

// Inicializa el servicio Turndown
let turndownService = new TurndownService({ headingStyle: "atx" })

// Regla para subrayado
turndownService.addRule("underline", {
  filter: "u",
  replacement: function (content) {
    return "<u>" + content + "</u>"
  },
})

// Regla para tachado
turndownService.addRule("strikethrough", {
  filter: ["del"],
  replacement: function (content) {
    return "~~" + content + "~~"
  },
})

// Regla para preformato
turndownService.addRule("pre", {
  filter: "pre",
  replacement: function (content) {
    content = "\n" + content + "\n"
    return "```" + content + "```"
  },
})

// Regla para figura
turndownService.addRule("figure", {
  filter: function (node) {
    const isMatch = node.nodeName === "FIGURE" && node.innerHTML.trim() === "&nbsp;"
    return isMatch
  },
  replacement: function () {
    return "\n\n---\n\n"
  },
})

// Nueva regla para listas de tareas
turndownService.addRule("taskListItems", {
  filter: function (node) {
    return node.nodeName === "LI" && node.hasAttribute("data-type") && node.getAttribute("data-type") === "taskItem"
  },
  replacement: function (content, node) {
    const checkbox = node.querySelector('input[type="checkbox"]')
    let checked = " "
    if (checkbox && checkbox instanceof HTMLInputElement) {
      checked = checkbox.checked ? "x" : " "
    }
    return `- [${checked}] ${content.trim()}`
  },
})

export default turndownService
