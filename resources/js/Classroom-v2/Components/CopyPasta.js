import Users from '../Users';
import KonvaStage from '../KonvaStage';
import Tools from './Tools';
import Layers from '../Layers';
import History from '../History';
import IDGenerator from '../Utils/IDGenerator';
import DataTransmitter from '../Components/DataTransmitter';

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
                this.delete();
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

            DataTransmitter.send({
                event: 'newNode',
                node,
                node_id: node.id(),
                layer_id: Layers.current().id()
            });
        }
    }

    delete()
    {
        const transformers = KonvaStage.Stage.find('Transformer');

        if (transformers.length) {
            transformers.each((node) => {
                node.destroy();
            });
        }

        let node = Tools.getSelectedNode();

        if (node) {
            node.hide();
            Layers.current().draw();

            History.add('remove', {
                node,
                node_id: node.id(),
                layer_id: Layers.current().id()
            });

            DataTransmitter.send({
                event: 'removeNode',
                node_id: node.id(),
                layer_id: Layers.current().id()
            });
        }
    }
}

const ComponentCopyPasta = new CopyPasta();

export default ComponentCopyPasta;