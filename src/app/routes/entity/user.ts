import {UserExtension} from './user-extension';

export class User {


    /**
     * 用户id
     */
    public id: string;

    /**
     * 机构id
     */
    public orgId: string;

    /**
     * 机构名称
     */
    public orgName: string;

    /**
     * 用户名
     */
    public userName: string;


    /**
     * 联系人
     */
    public contact: string;

    /**
     * 密码
     */
    public password: string;

    /**
     * 邮箱
     */
    public email: string;

    /**
     * 手机号
     */
    public mobile: string;

    /**
     * 状态(0：禁用   1：正常)
     */
    public status: number;

    /**
     * 创建用户id
     */
    public author: string;

    /**
     * 备注
     */
    public remark: string;


    /**
     * 创建时间
     */
    public gmtCreated: Date;

    /**
     * 修改时间
     */
    public gmtModified: Date;

    /**
     * 角色id列表
     */
    public roleIdList: string[];


    /**
     * 创建用户的名字
     */
    public createUserName: string;

    /**
     * 用户扩展对象
     */
    sysUserExtensionDO: UserExtension;

    manageFlag:string;

    orgPath:string

}
