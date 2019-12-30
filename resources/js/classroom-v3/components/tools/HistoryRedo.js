import Tool from './Tool';

export default class HistoryRedo extends Tool {
    constructor(ToolBox)
    {
        super('history-redo', ToolBox);

        this.setContent(``);
    }

    use()
    {
        console.log('HistoryRedo');
        return;
    }
}