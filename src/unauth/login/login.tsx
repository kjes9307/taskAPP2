import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {Form, Button, Spinner } from 'react-bootstrap';
import {useAuth} from "context/userContext"
import {useAsync} from "utils/use-async";
import Icon from 'component/Icon'
import {MainLayout} from 'unauth/login-layout'
type LoginInputs = {
  email: string,
  password: string
};
type switchModeParam = {
  setMode: () => void
}
export const LoginForm = (props:switchModeParam) => {
  const {appLogin} = useAuth(); // user 登入系統
  const {run,isLoading} = useAsync(undefined,{throwError:true}); // 處理所有異步請求 & 執行狀態
  const [errorInfo,setMsg] = useState<{message:string}|null>(null);
  const [open,setOpen] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>();
  const onSubmit: SubmitHandler<LoginInputs> = async data => {
    try{  
      await run(appLogin(data))
    }catch(error:any){
      setMsg(error)
    }
  };
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/i;
  return (
    <MainLayout>
    <h2 className="text-secondary mb-4">登入</h2>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-5" controlId="formBasicEmail">
        <Form.Label><h6 className="text-dark mb-0">電子信箱 <Icon icon='envelope' /></h6></Form.Label>
        <Form.Control  placeholder="Enter email" {...register("email",{ pattern: emailRule,required: true, })} />
        {errors?.email?.type === "pattern" && 
          <div className="text-danger d-flex align-items-center alert-font">
            <Icon icon='circle-exclamation' />Email form error
          </div>
        }
        {errors?.email?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
      </Form.Group>
      <Form.Group className="mb-1" controlId="formBasicPassword">
        <Form.Label><h6 className="text-dark mb-0">輸入密碼 {!open ?<Icon icon='lock' style={{cursor:"pointer"}} onClick={()=> setOpen(!open)} />:<Icon icon='unlock' style={{cursor:"pointer"}} onClick={()=>setOpen(!open)} />}</h6></Form.Label>
        <Form.Control type={!open?"password":"text"} placeholder="Password" {...register("password", { required: true })} />
        {errors?.password?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
      </Form.Group>
      <Form.Group className="mb-5" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="記住我的帳號" />
      </Form.Group>
      <div className='d-flex justify-content-center mb-2'>
          {isLoading ? 
            <Spinner animation="border" role="status" className="text-secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner> :
            null
          }
          <div className="text-danger fs-4">{ errorInfo?.message || null}</div>
      </div>
      <Button variant="primary" type="submit" className="w-100 login-btn mb-2 text-white">
        登入
      </Button>
      <h6 className="mb-0" style={{cursor:"pointer"}}>
        <span className="text-primary" onClick={()=>props.setMode()}>還沒註冊嗎?</span>
      </h6>
    </Form>
    </MainLayout>
  );
}

