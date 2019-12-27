import KonvaStage from '../KonvaStage';

export default class BaseHistory {
    constructor(current)
    {
        this.current = current;
    }

    removeTransformers()
    {
        const transformers = KonvaStage.Stage.find('Transformer');
        
        if (transformers.length) {
            transformers.each((node) => {
                node.destroy();
            });
        }
    }

    findMissingNode(id)
    {
        return KonvaStage.Stage.findOne(`#${id}`);
    }
}