import wxToPromise from "./wx";
import APIConfig from "../config/api";
import Http from "./http";

class FileUploader extends Http{
    static async upload(filePath, key = 'file') {
        let res;
        try {
            res = await wxToPromise('uploadFile', {
                url: APIConfig.baseUrl + '/v1/file',
                filePath,
                name:key
            });
        } catch (e) {
            FileUploader.showMessage(-1)
            throw Error(e.errMsg)
        }
        const sercerData = JSON.parse(res.data);
        if (res.statusCode !== 201) {
            FileUploader.showMessage(sercerData.error_code, sercerData.message);
            throw Error(sercerData.message);
        }
        return sercerData.data
    }
}

export  default  FileUploader;