export default class Tool {
    constructor(ToolBox)
    {
        this.ToolBox = ToolBox;
    }

    displayContent()
    {
        const toolId = this.content.getAttribute('data-tool-content');
        const content = this.ToolBox.controls.querySelector(`[data-tool-content="${toolId}"`);

        this.ToolBox.controls.querySelectorAll('[data-tool-content').forEach(element => {
            element.style.display = 'none';
        });

        if (content) {
            content.style.display = 'block';
        } else {
            this.ToolBox.controls.appendChild(this.content);
        }
    }
}