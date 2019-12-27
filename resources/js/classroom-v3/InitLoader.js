export default class InitLoader {
    constructor(container)
    {
        this.container = container;

        const wrapper = document.createElement('div');
        wrapper.className = 'init-wrapper';
        wrapper.innerHTML = 
        `<h1 data-init-header></h1>
        <span data-init-subheader></span>
        <div data-init-spinner></div>`;

        wrapper.style.width = window.innerWidth +'px';
        wrapper.style.height = window.innerHeight +'px';
        
        document.getElementsByTagName('body')[0].appendChild(wrapper);

        this.wrapper = wrapper;
        this.header = wrapper.querySelector('h1[data-init-header]');
        this.subheader = wrapper.querySelector('span[data-init-subheader]');
        this.spinner = wrapper.querySelector('div[data-init-spinner]');
    }

    start()
    {
        this.setHeaderText('Loading...');
        this.setSubheaderText('Preparing classroom...');
    }

    setHeaderText(text)
    {
        this.header.innerText = text;
    }

    setSubheaderText(text)
    {
        this.subheader.innerText = text;
    }

    end()
    {
        this.wrapper.remove();
    }
}