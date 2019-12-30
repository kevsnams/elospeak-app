import Tool from './Tool';

export default class ZoomReset extends Tool {
    constructor(ToolBox)
    {
        super('zoom-reset', ToolBox);

        this.setContent(``);

        this.zoomValue = document.getElementById('zoom-value');
    }

    use()
    {
        return;
    }
}