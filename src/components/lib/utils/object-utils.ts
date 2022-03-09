export class ObjectUtils {
    static isFunction(obj: any): boolean {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    }

    static getJSXElement(obj: any, ...params: any[]): any {
        return this.isFunction(obj) ? obj(...params) : obj;
    }
}