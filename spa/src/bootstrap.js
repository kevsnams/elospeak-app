/**
 * All the libraries that needs to be processed globally,
 * should be written here.
 */

import axios from 'axios';

axios.defaults.baseURL = '__APP_URL__'.replace('localhost', window.location.host);