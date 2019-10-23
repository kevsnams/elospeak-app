import _ from 'underscore';

import Konva from 'konva';

export default class ImportImage {
    constructor()
    {
        this.allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
        this.counter = 0;

        this.fileDropZone = document.getElementById('file-dropZone');
        this.fileInput = document.getElementById('file-input');

        _.each(['dragenter', 'dragover', 'dragleave', 'drop'], (evtName) => {
            window.addEventListener(evtName, (evt) => {
                evt.preventDefault();
                evt.stopPropagation();
            }, false);
        });

        _.each(['dragenter', 'dragover'], (evtName) => {
            window.addEventListener(evtName, (evt) => {
                this.showDropZone();
            }, false);
        });

        _.each(['dragleave', 'drop'], (evtName) => {
            this.fileDropZone.addEventListener(evtName, (evt) => {
                this.hideDropZone();
            }, false);
        });
    }

    getImages()
    {
        return this.images;
    }

    processImages(files, onAfterResolve)
    {
        const filteredFiles = _.filter(files, (file) => {
            return _.contains(this.allowedExtensions, file.type);
        });

        _.each(filteredFiles, (file) => {

            this.counter++;

            const handleImageTransfer = async (file, counter) => {
                try {
                    const img = await this.processImage(file, counter);

                    onAfterResolve(img);
                } catch(e) {
                    console.warn(e.message);
                }
            };

            handleImageTransfer(file, this.counter);
        });

        return this;
    }

    processImage(file, index)
    {
        const fr = new FileReader();

        return new Promise((resolve, reject) => {
            fr.onerror = () => {
                fr.abort();
                reject(new DOMException("Problem parsing image file. Please report to admin"));
            };

            fr.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const kImg = new Konva.Image({
                        width: img.width,
                        height: img.height,
                        x: 0,
                        y: 0,
                        draggable: true,
                        name: 'images'
                    });
                    kImg.image(img);

                    resolve({
                        kImage: kImg,
                        image: img
                    });
                };

                img.src = fr.result;
                img.setAttribute('data-index', index);
            };

            fr.readAsDataURL(file);
        });
    }

    showDropZone()
    {
        this.fileDropZone.style.visibility = 'visible';
    }

    hideDropZone()
    {
        this.fileDropZone.style.visibility = 'hidden';
    }
}