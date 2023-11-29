import { useSelector } from "react-redux";

function useCdUser(){
    const user = useSelector((state) => state.usuarioDBroker.value);
    
    return user.USUARIO
}

export default useCdUser