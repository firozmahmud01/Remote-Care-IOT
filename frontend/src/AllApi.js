export const host="http://localhost:4000"


function getheader(){
  let header={}
  if(localStorage.getItem('cookie')){
    header['Authorization']=localStorage.getItem('cookie');
  }
  return {headers:header};
}
function post(body){
  let header={'Content-Type': 'application/json;charset=utf-8'}
  if(localStorage.getItem('cookie')){
    header['Authorization']=localStorage.getItem('cookie');
  }
return {
    method: 'POST',
    headers: header,
    body: JSON.stringify(body)
  }
}

export async function requestLogin(user,pass){
    let res=await fetch(host+'/login',post({user,pass}))
    let da=await res.json();
    if(da.status=='OK'){
        return da.data;
    }
    throw "Failed to login"
}

export async function loadallroom(){
  let res=await fetch(host+'/api/listallroom',getheader())
    let da=await res.json();
    if(da.status=='OK'){
        return da.rooms;
    }
    throw "Failed"
}
export async function createroom(){
  let res=await fetch(host+'/api/addnewroom',getheader())
    let da=await res.json();
    if(da.status=='OK'){
        return da.roomid;
    }
    throw "Failed"
}