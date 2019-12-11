import Layers from '../Layers';
import History from '../History';
import Tabs from '../Components/Tabs';
import BaseHistory from './BaseHistory';
import KonvaStage from '../KonvaStage';
import Konva from 'konva';

export default class Redo extends BaseHistory {
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
        const nodeId = this.action.data.node_id;
        const node = this.action.data.node;
        const layer = Layers.get(this.action.data.layer_id);

        if (!this.findMissingNode(nodeId)) {
            node.id(nodeId);
        }

        this.removeTransformers();

        layer.add(node);
        layer.draw();
    }

    action_newImage()
    {
        const data = this.action.data;
        const nodeId = data.node_id;
        const node = data.node;

        if (!this.findMissingNode(nodeId)) {
            node.id(nodeId);
        }

        Tabs.create(data.tab_id, data.tab_label).setActive();

        Layers.set(data.layer_id, new Konva.Layer({
            id: data.layer_id
        }), {
            classroom: {
                height: data.stage_height
            }
        });

        Layers.use(data.layer_id);
        const layer = Layers.get(data.layer_id);

        this.removeTransformers();
        
        layer.add(node);
        layer.draw();
    }

    action_move()
    {
        const data = this.action.data;
        let node = data.node;

        if (!node.getLayer()) {
            node = this.findMissingNode(node.id());
        }

        node.x(data.to.x);
        node.y(data.to.y);

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

        node.x(data.to.x);
        node.y(data.to.y);
        node.scaleX(data.to.scaleX);
        node.scaleY(data.to.scaleY);
        node.rotation(data.to.rotation);

        const transformer = KonvaStage.Stage.find('Transformer');

        if (transformer && transformer.isTransforming()) {
            transformer.detach();
            transformer.attachTo(node);
        }

        node.getLayer().batchDraw();
    }

    action_tabSwitch()
    {
        const to = this.action.data.to;
        Tabs.get(to).setActive();
        Layers.use(to);
    }
}