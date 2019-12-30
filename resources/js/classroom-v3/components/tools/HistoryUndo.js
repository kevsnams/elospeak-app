import Tool from './Tool';

export default class HistoryUndo extends Tool {
    constructor(ToolBox)
    {
        super('history-undo', ToolBox);

        this.setContent(``);
    }

    use()
    {
        console.log('HistoryUndo');
        return;
    }
}