import Dashboard from 'elo/components/Dashboard.svelte';
import Schedules from 'elo/components/Schedules.svelte';
import Enrollments from 'elo/components/Enrollments.svelte';

import {
    SidebarIcon,
    BookOpenIcon,
    CalendarIcon
} from 'svelte-feather-icons';

export const routes = {
    '/': {
        label: 'Dashboard',
        component: Dashboard,
        icon: SidebarIcon,
        active_if: {
            path: '/',
            className: 'active-nav'
        }
    },

    '/schedules': {
        label: 'Schedules',
        component: Schedules,
        icon: CalendarIcon,
        active_if: {
            path: '/schedules*',
            className: 'active-nav'
        }
    },

    '/enrollments': {
        label: 'Enrollments',
        component: Enrollments,
        icon: BookOpenIcon,
        active_if: {
            path: '/enrollments*',
            className: 'active-nav'
        }
    }
};