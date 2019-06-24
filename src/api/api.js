import axios from 'axios';
import NProgress from 'nprogress'
import router from '../routes'
//let base = 'http://192.168.42.175:8081/vueAdmin';
//let base = 'http://192.168.43.243:8081/vueAdmin';
//let base = 'http://localhost:8888/grading';
let base = '/grading';
/*Token*/
// var storageToke = {
//     getToken() {
//         if (sessionStorage.getItem("user")) {
//             return JSON.parse(sessionStorage.getItem("user")) || []; //逻辑或|| 第一个正确后面就会被忽略  ,如果没有值,返回空数组
//         } else {
//             return [];
//         }
//
//     }
// };
axios.defaults.withCredentials = true;
// //每次请求携带Token
// axios.interceptors.request.use(function (config) {
//     NProgress.start();
//     let token = storageToke.getToken();
//     if(token){
//         config.headers['Authorization']=token;
//     }else {
//
//     }
//     return config;
// },function (error) {
//     NProgress.done();
//     return Promise.reject(error);
// });
//
axios.interceptors.response.use(function (response) {
    NProgress.done();
    return response;
}, function (error) {
    if (error && error.response) {
        sessionStorage.removeItem('user');
        router.push('/login');
    }
    NProgress.done();
    return Promise.reject(error);
});


export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/getPersonal`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/api/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/api/batchremove`, { params: params }); };

export const downGoods = params => { return axios.get(`${base}/api/downGoods`, { params: params }); };

export const getSHgoods = params => { return axios.get(`${base}/api/getSHgoods`, { params: params }); };

export const upgoods = params => { return axios.get(`${base}/api/upgoods`, { params: params }); };

export const getAllgoods = params => { return axios.get(`${base}/api/goodsList`, { params: params }); };

export const orderList = params => { return axios.get(`${base}/api/orderList`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };

export const commmentList = params => { return axios.get(`${base}/api/commmentList`, { params: params }); };

export const backComment = params => { return axios.get(`${base}/api/backcommment`, { params: params }); };

export const delcommment = params => { return axios.get(`${base}/api/delcommment`, { params: params }); };

export const sensitiveList = params => { return axios.get(`${base}/api/sensitiveList`, { params: params }); };

export const addSensitiveWord1 = params => { return axios.get(`${base}/api/addSensitiveWord`, { params: params }); };
export const updateSensitiveWord = params => { return axios.get(`${base}/api/updateSensitiveWord`, { params: params }); };
export const delSensitiveWord = params => { return axios.get(`${base}/api/delSensitiveWord`, { params: params }); };



