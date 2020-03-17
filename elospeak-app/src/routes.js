import Home from './views/Home.svelte';
import Classrooms from './views/Classrooms.svelte';
import Feedbacks from './views/Feedbacks.svelte';
import Profile from './views/Profile.svelte';
import Settings from './views/Settings.svelte';
import Teacher from './views/Teacher.svelte';
import Student from './views/Student.svelte';
import Invoices from './views/Invoices.svelte';


const routes = {
    '/': Home,
    '/classrooms': Classrooms,
    '/feedbacks': Feedbacks,
    '/profile': Profile,
    '/settings': Settings,
    '/teacher': Teacher,
    '/student': Student,
    '/invoices': Invoices
}

export default routes;