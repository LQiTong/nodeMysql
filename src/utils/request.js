/* eslint-disable */
import axios from 'axios'
import {
  MessageBox,
  Message,
  Loading
} from 'element-ui'
import Cookie from 'js-cookie'
import router from '@/router'
import store from '@/store'
// import {
//   getToken,
//   removeToken
// } from '@/utils/auth'
import qs from 'qs'

/** ================================== 环境 ======================================= **/
let ENV = 'payuat'
/** ================================== 生产环境打包拦路虎（预防打包出错） ============================ **/
ENV = process.env.NODE_ENV === 'production' ? ENV : 'dev'

export const BASE_CONFIG = {
  prod: {
    baseURL: '/manager'
  },
  dev: {
    baseURL: '/api'
  }
} [ENV]

// create an axios instance
const service = axios.create({
  baseURL: BASE_CONFIG.baseURL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
  headers: {

  }
})
// axios.defaults.baseURL = BASE_CONFIG.baseURL

// request interceptor
export let loadingInstance;
service.interceptors.request.use(
  config => {
    if (config.url === "thirdProduct/syncProgress") {

    } else if (config.url.indexOf("user/regioninfo/") >= 0) {
      // 去除查地址页面多刷情形
      // console.log(1);
    } else if (config.url.indexOf("user/region/list") >= 0) {
      // 祛除地址页面多刷情况
      // console.log(1);
    } else {
      loadingInstance = Loading.service({
        lock: true,
        text: "数据加载中，请稍后...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }

    config.headers["Berchina-Request-ID"] = new Date().getTime() * 1000
    // 弄个随机整数 0～logTips.length - 1 ，用于 logTips
    let jsonData = config.method == "get" ? config.params : config.data;
    console.info(
      `%c[ 请求 ]: [ ${process.env.VUE_APP_BASE_URL}/${config.url} ] [ ${config.method.toUpperCase()} ] 数据接口，参数：`, "color:DodgerBlue", jsonData || {}
    );

    // 加入时间戳
    let params = config.params || {}
    params = {
      ...params,
      r: new Date().getTime()
    }
    config.params = params
    return config;
  },
  err => {
    loadingInstance.close();
    Message.error("请求错误");
    return Promise.reject(err);
  }
)

// response interceptor
service.interceptors.response.use(
  res => {
    console.log('res --> ', res);
    loadingInstance.close();
    console.info(
      `%c[ 响应 ]: [ ${process.env.VUE_APP_BASE_URL}/${res.config.url
        .replace(new RegExp(`${res.config.baseURL}/`), "")} ] [ ${res.config.method.toUpperCase()} ] 数据接口，返回：`, "color:YellowGreen", res.data);
    if (res.config.responseType && res.config.responseType === 'blob') {
      return res.data
    }
    if (res.data.status === "200") {
      loadingInstance.close();
      const data = res.data;
      const {
        code
      } = data;
      if (res.config.responseType === 'blob') {
        return res.data
      }
      // 错误处理
      if (code == 1) {
        Message({
          message: res.data.message,
          type: 'warning'
        })
      } else if (code === '000000') {
        Message({
          message: res.data.message,
          type: 'success'
        })
      }
    } else {
      // 获取 本地json 数据时的处理
      if (res.config.url.indexOf('.json') >= 0) {
        return res.data
      }
      loadingInstance.close();
      Message.error(res.data.message || '未知错误');
      return Promise.reject(res);
    }
  },
  err => {
    loadingInstance.close();
    let message = "网络错误";
    if (err && err.response && err.response.status) {
      switch (err.response.status) {
        case 500:
          message = "服务器在思考人生，请稍后再试";
          break;
        case 504:
          message = "服务器在思考人生，请稍后再试";
          break;
        case 400:
          message = "请求有误";
          break;
        case 404:
          message = "无法访问资源";
          break;
        default:
          message = "网络错误";
          break;
      }
    }
    Message.error(message);
    return Promise.reject(err);
  }
)

// 发送请求
export function fetchPost(url, params, json = false, config) {
  if (params) {
    removeEmptyKeyValue(params);
  }

  return new Promise((resolve, reject) => {
    let data = qs.stringify(params);
    if (json) {
      data = params;
    }
    service({
        url,
        data,
        method: 'post',
        responseType: config && config.responseType || 'json'
      })
      .then(res => {
        resolve(res);
      }, err => {
        reject(err);
      })
      .catch(err => {
        reject(err);
      });
  });
}

const removeEmptyKeyValue = obj => {
  let params = JSON.parse(JSON.stringify(obj))
  Object.keys(params).forEach(key => {
    if (
      params[key] === undefined ||
      params[key] === "undefined" ||
      params[key] === "null" ||
      params[key] === "" ||
      params[key] === null
    ) {
      delete params[key];
    }
    if (typeof params[key] === "object") {
      params[key] = removeEmptyKeyValue(params[key]);
    }
  });
  return params;
};

export function fetchGet(url, params, config) {
  if (params) {
    removeEmptyKeyValue(params);
  }
  return new Promise((resolve, reject) => {
    service.get(url, {
        params,
        ...config
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function fetchPatch(url, params) {
  return new Promise((resolve, reject) => {
    service.patch(url, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export function fetchPut(url, params, format) {
  if (params) {
    removeEmptyKeyValue(params);
  }
  if (format == "FORMDATA") {
    let ret = "";
    ret = qs.stringify(params)
    return new Promise((resolve, reject) => {
      service.put(url, ret)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  } else {
    return new Promise((resolve, reject) => {
      service.put(url, params)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export function fetchDelete(url, params) {
  if (params) {
    removeEmptyKeyValue(params);
  }
  return new Promise((resolve, reject) => {
    service.delete(url, {
        params: params
      })
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
}

export default service