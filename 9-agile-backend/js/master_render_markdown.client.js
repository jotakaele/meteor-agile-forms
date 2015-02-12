marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});
renderMarkdown = function renderMarkdown(sContent, sDivName) {
    $('#' + sDivName).html(marked(sContent))
}
