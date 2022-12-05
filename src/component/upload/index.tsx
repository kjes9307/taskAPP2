import { ChangeEvent, FC ,useRef, useState} from 'react'
import axios from 'axios';
import {UploadList} from './uploadList'
import Icon from 'component/Icon'
import {taskPhotoData} from 'auth/TaskBoard/util'
// 檢查大小 檔案類型 
// 可訂製header
// 設定檔案上傳key值
// 可以預覽檔案
interface UploadProps {
    action: string;    
    defaultFileList?: UploadFile[];
    beforeUpload? : (file: File) => boolean | Promise<File>
    onProgress?: (percentage: number, file: File) => void;
    onSuccess?: (data: any, file: File) => void;
    onError?: (err: any, file: File) => void;
    onChange?: (file: File) => void;
    onRemove?: (file: UploadFile) => void;
    accept?: string
    headers?: {[key:string]:any}
    multiple?:boolean
    fileKey?:string; 
    photoList?:taskPhotoData
}

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error' | 'onPreview'

export interface UploadFile {
    uid: string;
    size: number;
    name: string;
    status?: UploadFileStatus;
    percent?: number;
    raw?: File;
    response?: any;
    error?: any;
    data_url?:string
}
export const UploadFile: FC<UploadProps> = (props) =>{
    const {
        action,
        defaultFileList,
        onProgress,
        onSuccess,
        onError,
        beforeUpload,
        onChange,
        onRemove,
        accept,
        headers,
        multiple,
        fileKey,
        photoList
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    const [ fileList, setFileList ] = useState<UploadFile[]>(defaultFileList || [])
    // 0 . 觸發上傳
    const handleClick = () => {
        // button 觸發 input上傳
        if (fileInput.current) {
            fileInput.current.click()
        }
    }
    // 1. input file 接收更新
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        // 文件上傳
        if(!files){
            return
        }
        uploadFiles(files)
        if(fileInput.current){
            fileInput.current.value = ""
        }
    }
    // 2. 上傳檔案
    const uploadFiles = (files: FileList) => {
        // 將FileList 轉成一個 array
        let postFiles = Array.from(files)
        postFiles.forEach(file => {
            if(beforeUpload){ 
                const result = beforeUpload(file)
                if (result !== false){
                    onViewFile(file)
                }
            }
        }
    )
   }
   // extra file Preview 
   const onViewFile = (file: File) =>{
        let _file: UploadFile = {
            uid: Date.now() + 'upload-file',
            status : 'onPreview',
            name: file.name,
            size: file.size,
            percent: 0,
            raw: file,
            data_url:""
        }
        const myReader = new FileReader()
        myReader.addEventListener('load',()=>{
            _file.data_url=myReader.result as string
            setFileList(prevList => [_file, ...prevList])
        },false)
        myReader.addEventListener('error',()=>{
            console.log("load image failed?")
        },false)
        myReader.readAsDataURL(file)
   }
   // 4. 上傳&axios&監測更新
   const post = (uploadFile: UploadFile) => {
        if(uploadFile.raw){
            let file = uploadFile.raw;
            const formData = new FormData()
            formData.append(fileKey || 'fileKey', file)
            axios.post(action, formData, {
                headers: {
                ...headers,
                'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (e) => {
                    let percentage = Math.round((e.loaded * 100) / e.total) || 0;
                    // 希望在上傳過程用state監測
                    if(percentage < 100){
                        updateFileList(uploadFile, { percent: percentage, status: 'uploading'})
                        if (onProgress){
                            onProgress(percentage, file)
                        }
                    }
                }
            }).then(resp => {
                console.log(resp)
                updateFileList(uploadFile,{status: 'success', response: resp.data})

                if(onSuccess){
                    onSuccess(resp.data.data, file)
                }
                if(onChange) {
                    onChange(file);
                }
            }).catch(err => {
                console.error(err)
                updateFileList(uploadFile, {status: 'error', error: err})

                if(onError){
                    onError(err, file)
                }
                if(onChange) {
                    onChange(file);
                }
            })
        }
    }
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList( prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return {...file, ...updateObj}
                }else {
                    return file;
                }
            })
        })
    }
    
    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if (onRemove){
            onRemove(file)
        }
    }
    return (
        <div>
            <div className='d-flex align-items-center flex-wrap'>
                <div 
                onClick={handleClick}
                className='d-flex align-items-center justify-content-center border file-preview'
                style={{cursor:"pointer",width: 50,height:50,objectFit:"cover"}}
                >
                <Icon icon='plus' />
                </div>
                {photoList?.images?.map(x=> (
                    <div key={x} className='ms-2'>
                        <img src={x} className='uploaded-img' alt="uploaded-image" />
                    </div>
                    ))
                }
            </div>
            <input
                style={{display: 'none'}}
                ref={fileInput}
                onChange={handleFileChange}
                type = "file"
                accept={accept}
                multiple={multiple}
            />
            <UploadList
                fileList={fileList}
                onRemove={handleRemove}
                updateFileList={updateFileList}
                post={post}
            />
        </div>
    )
}