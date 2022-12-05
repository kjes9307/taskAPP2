export interface DataType {
    _id?:string,
    name?:string,
    todoList? : DataType[]
    userList? : UserDataType[]
    personId?: string
    pin?:boolean
}
export type ItemProps = {
    item: Partial<DataType>
    index?: number
    creator? : string
}

export interface UserDataType {
    _id?:string,
    name?:string,
    personId?:string
}

export type IfuncProps = {
    searchItem:(newObj:Pick<DataType,'name'|'personId'>)=>void
    userList: UserDataType[]
    param: Partial<UserDataType>
}

export interface Kanban {
    id: number;
    name: string;
    projectId: number;
  }

  export interface Task {
    id: number;
    name: string;
    // 经办人
    processorId: number;
    projectId: number;
    // 任务组
    epicId: number;
    kanbanId: number;
    // bug or task
    typeId: number;
    note: string;
  }
  