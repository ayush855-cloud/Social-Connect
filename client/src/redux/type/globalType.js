export const MODAL="MODAL";
export const SOCKET="SOCKET";
export const ONLINE="ONLINE";
export const OFFLINE="OFFLINE";
export const CALL="CALL";
export const PEER="PEER";

export const EditData=(data,id,post)=>{
    const newData=data.map(item=>(item._id ===id ? post : item));
    return newData;
}

export const DeleteData=(data,id)=>{
    const newData=data.filter(item=>item._id !==id);
    return newData;
}
