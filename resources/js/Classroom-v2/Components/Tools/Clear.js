import ToolButton from '../Tools/ToolButton';
import Users from '../../Users';
import Layers from '../../Layers';

export default class Clear extends ToolButton {
    constructor(button)
    {
        super('clear', button);

        if (Users.current.user_type === 'teacher') {
            this.registerClearEvents();
        }
    }

    registerClearEvents()
    {
        this.button.addEventListener('click', (evt) => {
            evt.preventDefault();

            this.clear();
        }, false);
    }

    clear()
    {
        const layer = Layers.current();

        if (layer.hasChildren()) {
            const nodes = layer.getChildren((node) => {
                return node.getClassName() !== 'Image';
            });

            nodes.each((node) => {
                node.destroy();
                // @TODO add history
            });
        }
    }
}