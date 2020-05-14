import axios from 'axios'

const headers = {
    'token': 'eyJpc3MiOiJKb2huI.eyJpc3MiOiJ.Kb2huIFd1IEp' // 在这里设置请求头与携带token信息
};

/**
 * 更新token
 * @param token
 */
const updateToken = (token) => {
    sessionStorage.setItem("Authorization", token);
    headers.token = token;
};

/**
 * return  this token
 * @returns {string}
 */
const getToken = () => {
    return headers.token;
};

/**
 * 保存用户信息
 * @param userVo 用户vo
 * @param auth 用户的授权
 */
const saveUserAuth = (userVo, auth) => {
    const user_key = "userInfoVO";
    const auth_key = userVo.id + "auth_vo";
    sessionStorage.setItem(user_key, JSON.stringify(userVo));
    sessionStorage.setItem(auth_key, JSON.stringify(auth));
};

/**
 * 获取用户的授权
 */
const getUserAuth = () => {
    const user = JSON.parse(sessionStorage.getItem("userInfoVO"));
    const auth_key = user.id + "auth_vo";
    return JSON.parse(sessionStorage.getItem(auth_key));
};


/**
 * 相等
 * @param a
 * @param auth
 * @returns {boolean}
 */
const equals = (a, auth) => {
    if (a.code && a.code.toUpperCase() === auth.toUpperCase()) {
        return true;
    }
    const as = a.code.split("$");
    let has = false;
    if (as.length > 3) {
        if ((as[0] + "$_" + as[1] + "$_" + as[2] + "$_" + as[3]).toUpperCase() === auth.toUpperCase()) {
            has = true;
        }
    }
    if (!has && as.length > 2) {
        if ((as[0] + "$_" + as[1] + "$_" + as[2]).toUpperCase() === auth.toUpperCase()) {
            has = true;
        }
    }
    if (!has && as.length > 1) {
        if ((as[0] + "$_" + as[1]).toUpperCase() === auth.toUpperCase()) {
            has = true;
        }
    }
    if (!has && as.length > 0) {
        if ((as[0]).toUpperCase() === auth.toUpperCase()) {
            has = true;
        }
    }
    return has;
};
/**
 * 检查是否拥有权限
 * @param nav
 */
export const hasAuth = (nav) => {
    const auth = nav.auth;
    if (nav.role !== undefined && nav.role !== null && nav.role !== "") {
        const user = JSON.parse(sessionStorage.getItem("userInfoVO"));
        if (user == null){
            return false;
        }
        const roleId =user.rolePermissionVO.roleId;
        if (nav.role && nav.role.startsWith("!")) {
            const r  = nav.role.substr(1, nav.role.length -1 );
            const auths = getUserAuth();
            for (let i = 0; i < auths.length; i++) {
                const a = auths[i];
                if (equals(a, auth) && roleId != r) {
                    return true;
                }
            }
            return false;
        }else if (nav.role && !nav.role.startsWith("!") ){
            const r  = nav.role;
            const auths = getUserAuth();
            for (let i = 0; i < auths.length; i++) {
                const a = auths[i];
                if (equals(a, auth) && roleId == r) {
                    return true;
                }
            }
            return false;
        } else {
            return roleId == nav.role;
        }
    }
    //如果没有，还是需要显示
    if (auth) {
        const auths = getUserAuth();
        for (let i = 0; i < auths.length; i++) {
            const a = auths[i];
            if (equals(a, auth)) {
                return true;
            }
        }
        return false;
    }
    return true;


};
export default {headers, updateToken, getToken, saveUserAuth, getUserAuth, hasAuth}
