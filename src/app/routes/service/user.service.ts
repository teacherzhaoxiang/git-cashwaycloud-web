import {Injectable, Injector, Inject, EventEmitter, ModuleWithProviders} from '@angular/core';
import {User} from '../entity/user';
import * as CryptoJS from 'crypto-js/crypto-js';
import {RoleMenu} from '../entity/role-menu';
/**
 * 用户数据
 */
@Injectable()
export class UserService {

    public user: User;

    // 当前用户的角色菜单，主要是审核功能使用
    private roleMenuList: RoleMenu[];

    public setUser(user: User) {
        this.user = user;
    }

    public getUser() {
        return this.user;
    }

    public setRoleMenuList(roleMenuList: RoleMenu[]) {
        this.roleMenuList = roleMenuList;
    }

    public getRoleMenuList() {
        return this.roleMenuList;
    }

    private DESKey = 'cashway-cloud@2018';

    public encryptedDES(data) {
        const keyHex = CryptoJS.enc.Utf8.parse(this.DESKey);
        // 模式为ECB padding为Pkcs7
        const encrypted = CryptoJS.DES.encrypt(data, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        // 加密出来是一个16进制的字符串
        const str =  encrypted.ciphertext.toString();
        return str;
    }

    // 解密
    public decryptedDES(data) {
        const keyHex = CryptoJS.enc.Utf8.parse(this.DESKey);
        const decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(data)
        }, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        // 以utf-8的形式输出解密过后内容
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
