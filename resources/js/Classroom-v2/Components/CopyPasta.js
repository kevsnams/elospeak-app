import Users from '../Users';
import KonvaStage from '../KonvaStage';
import Tools from './Tools';
import Layers from '../Layers';
import History from '../History';
import IDGenerator from '../Utils/IDGenerator';

class CopyPasta {
    constructor()
    {
        this.clipboard = null;

        this.pastedX = null;
        this.pastedY = null;
    }

    start()
    {
        if (Users.current.user_type === 'teacher') {
            this.registerCopyPasteEvents();
        }
    }

    registerCopyPasteEvents()
    {
        document.addEventListener('keyup', (evt) => {
            const transformers = KonvaStage.Stage.find('Transformer');

            // CTRL+C
            if (evt.ctrlKey && evt.keyCode === 67 && transformers && transformers.isTransforming()) {
                this.copy(Tools.getSelectedNode());
            }


            // CTRL+V
            if (evt.ctrlKey && evt.keyCode === 86 && transformers && transformers.isTransforming()) {
                this.paste(transformers);
            }

            // DELETE
            if (evt.keyCode === 46) {
                if (transformers && transformers.isTransforming()) {
                    transformers.destroy();
                }

                let node = Tools.getSelectedNode();

                if (node) {
                    let node_id = node.id();
                    node = node.clone();

                    Tools.removeSelectedNode();
                    Layers.current().draw();

                    History.add('remove', {
                        node: node,
                        node_id,
                        layer_id: Layers.current().id()
                    });
                }
            }
        }, false);
    }

    clearClipboard()
    {
        this.clipboard = null;
    }

    copy(node)
    {
        this.clipboard = node;
    }

    paste(transformers)
    {
        if (this.clipboard !== null) {
            const node = this.clipboard.clone();
            const layer = Layers.current();

            node.id(IDGenerator.create());

            transformers.detach();
            transformers.attachTo(node);

            const newX = Tools.getSelectedNode().x() - 10;
            const newY = Tools.getSelectedNode().y() - 10;
            
            node.x(newX);
            node.y(newY);

            Tools.selectedNode = node;

            layer.add(node);
            layer.batchDraw();

            History.add('new', {
                node,
                node_id: node.id(),
                layer_id: Layers.current().id()
            });
        }
    }
}

const ComponentCopyPasta = new CopyPasta();

export default ComponentCopyPasta;