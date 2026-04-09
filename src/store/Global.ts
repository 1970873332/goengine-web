
/**
 * 全局仓库
 */
export abstract class Global {
    /**
     * 开发模式
     */
    public static get devMode(): boolean {
        return __NODE_ENV__ === "development";
    }
    /**
     * 调试
     */
    public static get debug(): boolean {
        return __DEBUG__ === "true";
    }
}
