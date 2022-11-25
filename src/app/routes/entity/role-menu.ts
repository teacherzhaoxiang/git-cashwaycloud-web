export class RoleMenu {


    /**
     * 菜单id
     */
    public menuId: string;

    /**
     * url的方法类型  post get  put delete
     */
    public method: string;

    /**
     * 菜单权限id
     */
    public perms: string;
    /**
     * 角色id
     */
    public roleId: string;
    /**
     * 菜单url
     */
    public url: string;
    /**
     * 审核标志  0不用审核，1同步审核，2异步审核
     */
    public approveFlag: number;
}
