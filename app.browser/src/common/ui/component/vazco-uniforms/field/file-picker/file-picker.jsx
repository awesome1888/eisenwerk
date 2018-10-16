import React from 'react';
import connectField from 'uniforms/connectField';
import wrapField from './../../config/wrap-field.jsx';
// import Notifier from './../../../../component/general/notifier/notifier.js';
import Util from '../../../../../lib/util/index.js';
import BaseComponent from '../../../../../lib/ui/component/index.jsx';

export class FilePicker extends BaseComponent {

    getPickerOptImage() {
        return {
            fromSources: ['local_file_system'],
            accept: ['image/*'],
            transformations: {
                crop: true
            }
        };
    }

    getPickerOptPdf() {
        return {
            fromSources: ['local_file_system'],
            accept: ['.pdf']
        };
    }

    onOpenClick() {
        this.open();
    }

    open() {
        const props = this.props;
        const pickerOptImage = this.getPickerOptImage();
        const picketOptPdf = this.getPickerOptPdf();

        Util.loadJs('https://static.filestackapi.com/v3/filestack.js').then(() => {
            const pickerOpt = props.pickerOpt
                || (props.isPdf && picketOptPdf)
                || (props.isImg && pickerOptImage);
            const onReceiveResult = (result) => {
                if (result && result.filesFailed && result.filesFailed.length > 0) {
                    // Notifier.errorDefault({reason: 'Failed to upload file(s).'});
                    console.dir({reason: 'Failed to upload file(s).'});

                    return null;
                }

                if (result && result.filesUploaded && result.filesUploaded[0]) {
                    const file = result.filesUploaded[0];

                    if (props.isImg && pickerOptImage) {
                        file.url = file.url.split('.com').join('.com/compress');
                    }
                    if (_.isFunction(props.onChange2)) {
                        props.onChange2(file.url, file.filename);
                    }

                    if (_.isFunction(props.onChange)) {
                        return props.onChange(file.url);
                    }

                    return null;
                }
                // Notifier.errorDefault('Failed to upload file.');
                console.dir('Failed to upload file.');

                if (_.isFunction(props.onChange)) {
                    return props.onChange(null);
                }
                return null;
            };
            const policy = { // now its hardcoded: calculate it based on the SECRET from API
                expirity: 2355841530
            };
            const signature = 'eyJleHBpcml0eSI6IDIzNTU4NDE1MzB9'; // now its hardcoded: calculate it based on the SECRET from API
            const key = mern.app().getSettings().getFilepickerToken();
            const client = filestack.init(key, { policy, signature});// eslint-disable-line
            client.pick(pickerOpt).then(onReceiveResult);
        });
    }

    // we should have kept the original url in the database, instead of doing this :/
    makeOriginURL(url) {
        if (_.isStringNotEmpty(url)) {
            return url.replace('/resize=w:200/compress', '');
        }

        return '';
    }

    render() {
        const props = this.props;
        return wrapField(
            {
                feedbackable: true,
                className: this.props.className,
                ...props
            },
            (
                <div>
                    {
                        this.hasChildren()
                        &&
                        <div className="" onClick={this.onOpenClick.bind(this, props)}>
                            {this.getChildren()}
                        </div>
                    }
                    {
                        !this.hasChildren()
                        &&
                        <div className="rb-group_x2">
                            {
                                _.isStringNotEmpty(props.value) && this.props.showLink !== false
                                &&
                                <a href={this.makeOriginURL(props.value)} target="_blank" rel="noreferrer noopener" className="button button_back">{t('Open')}</a>
                            }
                            <button
                                type="button"
                                className={`button ${props.buttonClassName ? props.buttonClassName : ''}`}
                                onClick={this.onOpenClick.bind(this, props)}
                            >
                                {props.text}
                            </button>
                        </div>
                    }
                </div>
            )
        );
    }
}

export default connectField(FilePicker);
