import Classroom from './Classroom-v2/Classroom';

window.ELOSpeakClassroom = null;
window.addEventListener('load', (evt) => {
    const classroom = new Classroom('vr-db-0');
    ELOSpeakClassroom = Object.freeze(classroom);
});