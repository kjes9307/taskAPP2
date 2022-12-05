import {Container,Form,Row,Col,Button} from 'react-bootstrap'
import { useForm, SubmitHandler } from "react-hook-form";
import {cleanObject} from 'utils'
import {useTaskSearchParam} from './util'
interface IFormValues {
  owner: string;
  Status: string;
  type : string;
  taskName?: string;
  onChange: ()=>void
}

export const SearchPanel = () => {
  const { register, handleSubmit } = useForm<IFormValues>();
  const [param ,setPanelParam]= useTaskSearchParam()
  const onSubmit: SubmitHandler<IFormValues> = data => {
    let res= {...data}
    console.log(cleanObject(res))
  };
  const reset = () =>{
    setPanelParam({
        type: undefined,
        status: undefined,
        taskName: undefined,
    });
  }
  const {type,status,taskName} = param
  return (
    <Container fluid='md' className="mb-3 p-0">
  
    <form onSubmit={handleSubmit(onSubmit)}>
     <Row className="d-flex align-items-center flex-wrap">
      <Col xs='12' lg='3'>
        <Form.Group 
            controlId="exampleForm" 
            className="d-flex align-items-center">
            <Form.Control 
                {...register('taskName')} 
                type="text"
                value={taskName || ''}
                placeholder="任務名" 
                onChange={(e)=>setPanelParam({...param,taskName:e.target.value})}
                />
        </Form.Group>
      </Col>
      <Col xs='12' lg='2' className='mt-xs-2'>
        <Form.Select 
            {...register("Status")} 
            className="h-25p font-color" 
            value={status || ''} 
            aria-label="Default select example"
            onChange={(e)=>setPanelParam({...param,status:e.target.value})}
            >
            <option value=''>狀態</option>
            <option value="idle">idle</option>
            <option value="ongoing">ongoing</option>
            <option value="done">done</option>
        </Form.Select>
      </Col>
      <Col xs='12' lg='2' className='mt-xs-2'>
        <Form.Select 
        {...register("type")} 
        className="h-25p font-color" 
        value={type || ''} 
        aria-label="Default select example"
        onChange={(e)=>setPanelParam({...param,type:e.target.value})}
        >
        <option value=''>任務類型</option>
        <option value={0}>question</option>
        <option value={1}>bug</option>
        <option value={2}>task</option>
        <option value={3}>idea</option>
        <option value={4}>note</option>
        <option value={5}>Improvement</option>

        </Form.Select>
      </Col>
      {/* <Select label="負責人" {...register("owner")} /> */}
      <Col xs='12' lg='4'>
      <Button type="submit" children='Search' className="text-white mt-xs-2" />
      <Button type="reset" children='Reset' className="text-white mt-xs-2 ms-3" onClick={()=> reset()} />
      </Col>
      </Row>
    </form>
    </Container>
  );
};