import { FC,useState,useRef,useEffect,RefObject } from "react";
import ReactCrop , {Crop,PixelCrop} from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { UploadFile } from './index'
import Icon from 'component/Icon'
import {ProgressBar,Modal,Button,Container,Row,Col} from 'react-bootstrap'

interface UploadListProps {
    post : (uploadFile: UploadFile) => void
    fileList: UploadFile[];
    onRemove: (_file: UploadFile) => void;
    updateFileList: (updateFile: UploadFile, updateObj: Partial<UploadFile>) => void
}

const EditImage = (props:{post : (uploadFile: UploadFile) => void,img:UploadFile,show:boolean,handleClose:()=>void,updateFileList: (updateFile: UploadFile, updateObj: Partial<UploadFile>) => void}) => {
    const {
        img,
        show,
        handleClose,
        updateFileList,
        post
    } = props
    const [imgType,setType] = useState('')
    const [imgCategory,setCategory] = useState('')
    const canvasRef = useRef<HTMLCanvasElement|null>(null)
    const imgRef = useRef<HTMLImageElement|null>(null)
    const [imgMode,setImgMode] = useState<string|undefined>('contain')
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })
    const onHandleCrop = (e:PixelCrop) =>{
        setCrop(e)
    } 
    const handleImgFile =() =>{
        if(canvasRef.current&&canvasRef){
            const canvas = canvasRef.current
            let dataURL = canvas.toDataURL(imgType,0.5)
            let blobStr = window.atob(dataURL.split(',')[1])
            const array = []
            for (let i = 0; i < blobStr.length; i++) {
                array.push(blobStr.charCodeAt(i))
            }
            const file = new File([new Uint8Array(array)],`uploadFile.${imgCategory}` ,{ type: imgType })
            handleClose()
            img.raw = file
            updateFileList(img,{status:'ready'})
            post(img)
        }
        
    }
    function image64toCanvasRef (canvaRef:RefObject<HTMLCanvasElement>, image64:string, pixelCrop:Crop,imgRef:RefObject<HTMLImageElement>) {
        if(canvaRef && canvaRef.current && image64){
            const canvas = canvaRef.current 
            canvas.width = pixelCrop.width
            canvas.height = pixelCrop.height
            let scaleX:number;
            let scaleY:number;
            if(imgRef&&imgRef.current){
                scaleX = imgRef.current.naturalWidth / imgRef.current.width;
                scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            }
            const ctx = canvas.getContext('2d')
            if(!ctx) return;
            const image = new Image()
            image.src = image64
            image.onload = function () {
                ctx.drawImage(
                    image,
                    pixelCrop.x * scaleX,
                    pixelCrop.y * scaleY,
                    pixelCrop.width * scaleX,
                    pixelCrop.height * scaleY,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height 
                )
            }
        }
    }
    useEffect(()=>{
        setCrop({
            unit: '%',
            x: 25,
            y: 25,
            width: 50,
            height: 50
        })
        if(img?.data_url){
            let data = img?.data_url
            let imageType = data?.split(',')[0]
            let str1 = imageType.split(';')[0]
            let str2 = str1.split(":")[1]
            let imageCategory = str2?.split('/')[1]
            setCategory(imageCategory)
            setType(str2)
        }
        return () =>{
            setCategory('')
            setType('')
        }
    },[img?.data_url])
    useEffect(()=>{
        if (canvasRef.current) {
            image64toCanvasRef(canvasRef,img?.data_url as string,crop,imgRef)
        }
    },[crop])
    return (
      <>
        <Modal centered size='lg' show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <h1>
                    相片裁剪
                </h1>
            </Modal.Header>
          <Modal.Body>
          <Container>
            <Row className="d-flex justify-content-center">
                <Col md='6' className="d-flex align-items-center justify-content-center">
                    <ReactCrop crop={crop} aspect={4/3} onChange={e => onHandleCrop(e)}>
                        <img ref={imgRef} src={img?.data_url} className={`crop-img obj-${imgMode}`}/>
                    </ReactCrop>
                </Col>
                <Col md='6'>
                    <div className="d-flex flex-column align-items-center justify-content-start">
                        <h3>Preview Image</h3>
                        <canvas 
                            ref={canvasRef} 
                            className='border file-preview p-1' 
                            style={{
                                objectFit:"contain",
                                width:320,
                                height:320
                            }}
                        >
                        </canvas>
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                        <Button className="btn-primary" size='sm' onClick={()=>setImgMode('contain')}>contain</Button>
                        <Button className="btn-primary ms-1" size='sm' onClick={()=>setImgMode('cover')}>cover</Button>
                    </div>
                </Col>
            </Row>
           </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button onClick={handleImgFile}>
                Upload modified Image
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
// 13. 上傳列表
export const UploadList: FC<UploadListProps> = (props) => {
    const {
        fileList,
        onRemove,
        updateFileList,
        post
    }  = props
    const [show, setShow] = useState(false);
    const [img,setData] = useState<UploadFile|undefined>(undefined);
    const handleClose = () => setShow(!show);
    const handImageData = (data:UploadFile) =>{
        setShow(!show)
        setData(data)
    }
    return (
        <ul className="list-unstyled position-relative d-inline-block">
            {fileList.map(item => {
                return (
                    <li key={item.uid}>
                        <span className={`file-name file-name-${item.status}`}>
                            <Icon icon="file-alt" theme="secondary" />
                            {item.name.slice(0,10)+'.'+item.name.split('.')[1]}
                        </span>
                        <span className = "file-status">
                            {(item.status === 'uploading' || item.status === 'ready') && <Icon icon="spinner" spin theme="primary" />}
                            {item.status === 'success' && <Icon icon="check-circle" theme="success" />}
                            {item.status === 'error' && <Icon icon="times-circle" theme="danger" />}
                            {item.status === 'onPreview' && <Icon icon="eye" theme="dark" onClick={()=>handImageData(item)} />}
                        </span>
                        <span className="file-actions ms-2">
                            <Icon icon="times" onClick={() => { onRemove(item)}}/>
                        </span>
                        {item.status === 'uploading' &&
                            <ProgressBar
                                now={item.percent || 0}
                            />
                        }
                        <EditImage post={post} updateFileList={updateFileList} show={show} img={img as UploadFile} handleClose={handleClose} />
                    </li>
                )
            })}
        </ul>
    )
}

export default UploadList;