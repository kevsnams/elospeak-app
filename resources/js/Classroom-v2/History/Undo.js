import Layers from '../Layers';
import History from '../History';
import Tabs from '../Components/Tabs';
import BaseHistory from './BaseHistory';
import KonvaStage from '../KonvaStage';

export default class Undo extends BaseHistory {
    constructor(current)
    {
        super(current);

        this.action = History.getAction(current);

        if (!this.action) {
            console.log('History.action not found {'+ current +'}');
            return;
        }

        const func = `action_${this.action.type}`;

        if (typeof this[func] !== 'function') {
            console.log('History action function not found {'+ func +'}');
            return;
        }

        this[func]();
    }

    action_new()
    {
        const node = this.action.data.node;
        const layer = Layers.get(this.action.data.layer_id);

        // Update the node because it will be deleted
        History.updateAction(this.current, 'node', node.clone());

        if (node.hasName('shapes')) {
            this.removeTransformers();
        }

        node.destroy();

        layer.batchDraw();
    }

    action_newImage()
    {
        const data = this.action.data;
        const node = data.node;

        // Update the node because it will be deleted
        History.updateAction(this.current, 'node', node.clone());

        node.destroy();
        Tabs.remove(data.tab_id, false);

        Layers.remove(data.layer_id);
        Layers.use(data.layer_id_previous);

        Tabs.get(data.layer_id_previous).setActive();

        Layers.get(data.layer_id_previous).draw();
    }

    action_move()
    {
        const data = this.action.data;
        let node = data.node;

        if (!node.getLayer()) {
            node = this.findMissingNode(node.id());
        }

        // We only have to deal with data.from
        node.x(data.from.x);
        node.y(data.from.y);

        const transformer = KonvaStage.Stage.find('Transformer');

        if (transformer && transformer.isTransforming()) {
            transformer.detach();
            transformer.attachTo(node);
        }

        node.getLayer().batchDraw();
    }

    action_shapeTransform()
    {
        const data = this.action.data;
        let node = data.node;

        if (!node.getLayer()) {
            node = this.findMissingNode(node.id());
        }

        node.x(data.from.x);
        node.y(data.from.y);
        node.scaleX(data.from.scaleX);
        node.scaleY(data.from.scaleY);
        node.rotation(data.from.rotation);

        const transformer = KonvaStage.Stage.find('Transformer');

        if (transformer && transformer.isTransforming()) {
            transformer.detach();
            transformer.attachTo(node);
        }

        node.getLayer().batchDraw();
    }

    action_tabSwitch()
    {
        const from = this.action.data.from;
        
        Tabs.get(from).setActive();
        Layers.use(from);
    }

    action_remove()
    {
        const node = this.action.data.node;
        const layer = Layers.get(this.action.data.layer_id);

        node.show();
        layer.draw();
    }
}