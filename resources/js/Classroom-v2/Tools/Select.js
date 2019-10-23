import ToolButton from './ToolButton';

export default class Select extends ToolButton {
    constructor(button)
    {
        super('select', button);

        this.addControlContent(``);
    }
}