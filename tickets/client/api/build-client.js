import axios from 'axios';

export default ({req}) => {
    if (typeof window === 'undefined') {
        console.log('We are on the server!');

        // call ingress-nginx-controller service of ingress-nginx namespace
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        console.log('We must be on the browser!');

        return axios.create({
            baseUrl: '/'
        });
    }
};
