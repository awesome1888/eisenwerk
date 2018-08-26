import Entity from '../../../lib/entity/client.js';
import Common from './both.js';

export default class FileEntity extends mix(Entity).with(Common) {
    // static async save(id, data, parameters = {})
    // {
    //     if (!_.isStringNotEmpty(id)) {
    //         const result = new ActionResult();
    //
    //         let formData;
    //         if (data instanceof Blob || data instanceof File) {
    //             formData = new FormData();
    //             formData.append('file', data);
    //         } else if (data instanceof FormData) {
    //             formData = data;
    //         } else {
    //             result.addError(new Error('Illegal new file'));
    //             return result;
    //         }
    //
    //         formData.append('token', await Util.execute('file.uploader.token.get'));
    //
    //         if (!formData)
    //         {
    //             result.addError(new Error('Illegal data argument'));
    //             return result;
    //         }
    //
    //         // create file in a special way
    //         return new Promise((resolve, reject) => {
    //             // todo: dont use jquery here...
    //
    //             const ajaxParams = {
    //                 url: '/upload',
    //                 type: 'post',
    //                 contentType: false,
    //                 processData: false,
    //                 data: formData,
    //                 dataType: 'json',
    //                 success: function(json){
    //                     result.setId(json._id);
    //                     resolve(result);
    //                 },
    //                 error: function(x, text, expl){
    //                     const e = new Error(expl);
    //                     if ('status' in x)
    //                     {
    //                         e.httpStatus = x.status;
    //                     }
    //
    //                     result.addError(e);
    //                     reject(result);
    //                 },
    //             };
    //
    //             if (_.isObjectNotEmpty(parameters) && _.isFunction(parameters.progressCallback))
    //             {
    //                 ajaxParams.xhr = () => {
    //                     const xhr = $.ajaxSettings.xhr();
    //                     xhr.upload.addEventListener('progress', (evt) => {
    //                         if (evt.lengthComputable)
    //                         {
    //                             parameters.progressCallback(Math.ceil(evt.loaded / evt.total * 100));
    //                         }
    //                     }, false);
    //                     return xhr;
    //                 };
    //             }
    //
    //             $.ajax(ajaxParams);
    //         });
    //     }
    //     else
    //     {
    //         return super.save(id, data);
    //     }
    // }
    //
    // getAbsoluteURL(tail = '', parameters = {})
    // {
    //     const cdn = Option.findOnePublished({name: 'file.cdn.1'});
    //     if (!cdn || !_.isStringNotEmpty(cdn.getValue()))
    //     {
    //         return '';
    //     }
    //
    //     return `${cdn.getValue()}/${this.extractURL()}/${tail}`;
    // }
}
