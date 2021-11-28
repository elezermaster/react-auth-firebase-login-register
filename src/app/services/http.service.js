import axios from "axios";
import { toast } from "react-toastify";
import configFile from "../config.json";

// becase axios is global we need change instance
//axios.defaults.baseURL = configFile.apiEndpoint;
const httpAxios = axios.create({baseURL: configFile.apiEndpoint})

httpAxios.interceptors.request.use(
    function (config) {
        if (configFile.isFirebase) {
            const containSlash = /\/$/gi.test(config.url)
            config.url =
                (containSlash ? config.url.slice(0, -1) : config.url) + ".json"
        }
        return config
    },
    function (error) {
        return Promise.reject(error);
    }
);

function transformData(data) {
    return data ? Object.keys(data).map(key => ({
            ...data[key],
            })) : []
}

httpAxios.interceptors.response.use(
    (res) => {
        console.log(res.data)
        if (configFile.isFirebase) {
            res.data = {content: transformData(res.data)}
            console.log(res.data)
        }
        return res
    },
    function (error) {
        const expectedErrors =
            error.response &&
            error.response.status >= 400 &&
            error.response.status < 500;

        if (!expectedErrors) {
            console.log(error);
            toast.error("Somthing was wrong. Try it later");
        }
        return Promise.reject(error);
    }
);
const httpService = {
    get: httpAxios.get,
    post: httpAxios.post,
    put: httpAxios.put,
    delete: httpAxios.delete
};
export default httpService;
