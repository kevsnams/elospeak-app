import _ from 'underscore';
import DOMElements from './DOMElements';

class Curtain {
    constructor()
    {
        this.element = DOMElements.curtain;
        this.container = DOMElements.container;

        const title = document.createElement('div');
        title.className = 'title';

        this.title = title;

        const content  = document.createElement('div');
        content.className = 'content';

        this.content = content;

        this.element.appendChild(title);
        this.element.appendChild(content);

        this.show('<h1>Uploading...</h1>', 'SOME DESCRIPTION');
    }

    resize()
    {
        const parentRect = this.container.getBoundingClientRect();

        this.element.style.height = this.container.scrollHeight +'px';
    }

    show(title, content)
    {
        this.resize();

        this.title.innerHTML = title;
        this.content.innerHTML = content;

        this.element.style.display = 'block';
    }

    hide()
    {
        this.element.style.display = 'none';
    }
}


const ELOSpeakCurtain = new Curtain();

export default ELOSpeakCurtain;