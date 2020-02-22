import { writable } from 'svelte/store';

const SettingsBrush = writable({
    thickness: 5,
    color: 'rgb(0, 0, 0)',
    opacity: 1
});

const SettingsEraser = writable({
    thickness: 5
});

const SettingsShapes = writable({
    shape: null,
    fill: {
        color: 'rgb(0,0,0)',
        opacity: 1,
        transparent: false
    },
    border: {
        color: 'rgb(0,0,0)',
        enabled: true
    }
});

const SelectedNode = writable(null);

export {
    SettingsBrush,
    SettingsEraser,
    SettingsShapes,
    SelectedNode
};