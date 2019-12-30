export default class Tool {
    constructor(name, ToolBox)
    {
        this.ToolBox = ToolBox;

        this.name = name;
        this.button = this.ToolBox.wrapper.querySelector(`[data-tool="${this.name}"]`);

        this.content = document.createElement('div');
        this.content.setAttribute('data-tool-content', this.name);
        this.content.style.display = 'none';

        const splitClassName = this.name.split('-');
        let className = '';

        splitClassName.forEach((word) => {
            className += word.charAt(0).toUpperCase() + word.slice(1);
        });

        this.className = className;
    }

    setContent(htmlContent)
    {
        this.content.innerHTML = htmlContent;
        this.ToolBox.controls.appendChild(this.content);
    }

    use()
    {
        this.ToolBox.tools.forEach((tool) => {
            tool.classList.remove('active');
        });

        this.button.classList.add('active');

        this.displayContent();
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