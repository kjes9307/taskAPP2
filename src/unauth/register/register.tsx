import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {Form, Button, Spinner } from 'react-bootstrap';
import {useAuth} from "context/userContext"
import {useAsync} from "utils/use-async";
import Icon from 'component/Icon'
import {MainLayout} from 'unauth/layout'
type RegisterInputs = {
  email: string,
  password: string,
  confirmPassword: string,
  name: string
};
type switchModeParam = {
  setMode: () => void
}
export const RegisterForm = (props:switchModeParam) => {
  const {appRegister} = useAuth(); // user 登入系統
  const {run,isLoading} = useAsync(undefined,{throwError:true}); // 處理所有異步請求 & 執行狀態
  const [errorInfo,setMsg] = useState<{message:string}|null>(null);
  const [regInfo,setInfo] = useState<string|undefined>(undefined);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterInputs>();
  const onSubmit: SubmitHandler<RegisterInputs> = async data => {
    console.log(errors,data)
    try{  
      let res = await run(appRegister(data))
      if(res.status===201){
        setInfo("Register success")
      }
    }catch(error:any){
      setMsg(error)
    }
  };
  const [open,setOpen] = useState(false)
  const handleType = () =>{
    setOpen(!open)
  }
  const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/i;
  const checkRule = /^[A-Za-z0-9]{8,}$/;
  console.log(errors)
  return (
    <MainLayout>
    <h2 className="text-secondary mb-4">註冊</h2>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-4" controlId="formBasicEmail">
        <Form.Label><h6 className="text-dark mb-0">輸入電子信箱 <Icon icon='envelope' /></h6></Form.Label>
        <Form.Control  placeholder="Enter email" {...register("email",{ pattern: emailRule,required: true, })} />
        {errors?.email?.type === "pattern" && 
          <div className="text-danger d-flex align-items-center alert-font">
            <span className="material-symbols-outlined me-1 alert-font">warning</span>Email form error
          </div>
        }
        {errors?.email?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
      </Form.Group>
      <Form.Group className="mb-4" controlId="BasicName">
        <Form.Label><h6 className="text-dark mb-0">暱稱</h6></Form.Label>
        <Form.Control type="text" placeholder="暱稱" {...register("name", {required: true ,minLength: 2, maxLength:8})} />
        {errors?.name?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
        {errors?.name?.type === "minLength" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />name need at least 2 characters
          </div>
        }
        {errors?.name?.type === "maxLength" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />name can not over 8 characters
          </div>
        }
      </Form.Group>
      <Form.Group className="mb-4" controlId="formBasicPassword">
        <Form.Label><h6 className="text-dark mb-0">輸入密碼 {!open ?<Icon icon='lock' style={{cursor:"pointer"}} onClick={handleType} />:<Icon icon='unlock' style={{cursor:"pointer"}} onClick={handleType} />}</h6></Form.Label>
        <Form.Control type={!open?"password":"text"} placeholder="Password" {...register("password", {pattern: checkRule ,required: true ,minLength: 6})} />
        {errors?.password?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
        {errors?.password?.type === "minLength" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />Passwords need at least 6 characters
          </div>
        }
        {errors?.password?.type === "pattern" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />Passwords are only available for a combination 
          of uppercase and lowercase letters, numbers
          </div>
        }
      </Form.Group>
      <Form.Group className="mb-4" controlId="formCopyPassword">
        <Form.Label><h6 className="text-dark mb-0">再次輸入密碼</h6></Form.Label>
        <Form.Control type={!open?"password":"text"} placeholder="Check Password" {...register("confirmPassword", { required: true,validate: {
      checkSame: v => v === getValues('password')
    } })} />
        {errors?.confirmPassword?.type === "required" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />This field is required
          </div>
        }
        {errors?.confirmPassword?.type === "checkSame" && 
          <div className="text-danger d-flex align-items-center alert-font">
          <Icon icon='circle-exclamation' />Validation password is different from what you input above
          </div>
        }
      </Form.Group>
      <div className='d-flex justify-content-center mb-2'>
          {isLoading ? 
            <Spinner animation="border" role="status" className="text-secondary">
              <span className="visually-hidden">Loading...</span>
            </Spinner> :
            null
          }
          <div className="text-danger fs-4">
          { errorInfo!==null ? 
             <div className="text-danger d-flex align-items-center">
              <span className="material-symbols-outlined">error</span>
              {errorInfo?.message} </div>:null
          }
          { regInfo!==undefined ?
            <div className="brand-color d-flex align-items-center">
            <span className="material-symbols-outlined">done</span>
            {regInfo}
            </div>:null
          }
          </div>
      </div>
      <Button variant="primary" type="submit" className="w-100 login-btn mb-2 text-white">
        註冊
      </Button>
      <h6 className="mb-0" style={{cursor:"pointer"}}>
        <span className="text-primary" onClick={()=>props.setMode()}>返回登入</span>
      </h6>
    </Form>
    
    </MainLayout>
  );
}